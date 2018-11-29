
var stageWidth = 800;
var stageHeight = 600;
var massScaling = 3;

function Markers(){
    this.start = [50, stageHeight/2];
    this.target = [stageWidth-50, stageHeight/2];
}

function HumanPlayer(){
}

HumanPlayer.prototype.isHuman = function(){
    return true;
};

HumanPlayer.prototype.chooseFirstPlanetWeight = function(markers, mouseX, mouseY, isClick){
    var current = Math.round(mouseX / stageWidth * 1000);
    return [current, isClick];
};

HumanPlayer.prototype.choosePlanetPosition = function(markers, mouseX, mouseY, isClick){
    return [[mouseX, mouseY], isClick];
};

HumanPlayer.prototype.chooseR = function(markers, planets, split, moveNum, mouseX, mouseY, isClick){
    var x = mouseX - markers.start[0];
    var y = mouseY - markers.start[1];
    return [Math.PI-Math.atan2(x,y), isClick];
};

function evaluate(markers, planets, split, r){
    var minDist = Number.POSITIVE_INFINITY;
    var shipPos = [markers.start[0], markers.start[1]];
    var shipVel = [10*Math.sin(r), -10*Math.cos(r)];

    var tick = 0;
    while(true) {
        var oPos = [shipPos[0], shipPos[1]];

        for (var i = 0; i < planets.length - 1; ++i) {
            var mass = ((i == 0) ? split : 1000 - split) * massScaling;
            var xd = planets[i][0] - shipPos[0];
            var yd = planets[i][1] - shipPos[1];
            var d = Math.sqrt(xd * xd + yd * yd);
            var force = mass / (d * d);
            var direction = Math.atan2(xd, yd);
            if (isNaN(force)) {
                force = 0;
                direction = 1;
            }
            shipVel[0] += force * Math.sin(direction);
            shipVel[1] += force * Math.cos(direction);
        }

        shipPos[0] += shipVel[0];
        shipPos[1] += shipVel[1];

        tick++;

        var xDist = shipPos[0] - markers.target[0];
        var yDist = shipPos[1] - markers.target[1];
        var dist = Math.round(Math.sqrt(xDist * xDist + yDist * yDist));

        minDist = Math.min(minDist, dist);

        if (shipPos[0] < 0 || shipPos[0] > stageWidth || shipPos[1] < 0 || shipPos[1] > stageHeight || tick > 60 * 8) {
            return minDist;
        }
    }
}

function AIPlayer(){
}

AIPlayer.prototype.isHuman = function(){
    return false;
};

AIPlayer.prototype.chooseFirstPlanetWeight = function(markers, mouseX, mouseY, isClick){
    return [500+Math.random()*200, true];
};

AIPlayer.prototype.choosePlanetPosition = function(markers, mouseX, mouseY, isClick){
    return [[Math.round(((Math.random()-.5)*.5 + .5) * stageWidth),
            Math.round(((Math.random()-.5)*.25 + .5) * stageHeight)],
            true];
};

AIPlayer.prototype.chooseR = function(markers, planets, split, moveNum, mouseX, mouseY, isClick){
    var x = markers.target[0] - markers.start[0];
    var y = markers.target[1] - markers.start[1];
    var baseline = Math.PI-Math.atan2(x,y);
    var bestDist = evaluate(markers, planets, split, baseline);
    var bestR = baseline;
    for(var i = 0; i < 20; ++i){
        if(moveNum < 0){
            moveNum = 3
        }
        var r = (Math.random()-.5)*moveNum*.08 + baseline;
        var dist = evaluate(markers, planets, split, r);
        if(dist < bestDist){
            bestDist = dist;
            bestR = r;
        }
    }
    return [bestR, true];
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

$(window).load(function () {
    run();
});

function run() {

    var renderer = new PIXI.WebGLRenderer(stageWidth, stageHeight);
    document.body.appendChild(renderer.view);
    var stage = new PIXI.Container();

    var shaderCode = $("#bgshader")[0].innerHTML;

    var bg = new PIXI.Graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, stageWidth, stageHeight);
    stage.addChild(bg);

    var uniforms = {};
    uniforms.time = {
        type:"f",
        value:0.0
    };

    var simpleShader = new PIXI.AbstractFilter('',shaderCode,uniforms);
    simpleShader.resolution = .5;

    bg.filters = [simpleShader];

    var graphics = new PIXI.Graphics();
    graphics.blendMode = PIXI.BLEND_MODES.ADD;
    stage.addChild(graphics);

    var mousePos = [0,0];
    var mouseIsDown = false;
    var mouseClick = false;
    renderer.view.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(renderer.view, evt);
    }, false);
    renderer.view.addEventListener('mousedown', function(evt) {
        mouseIsDown = true;
    }, false);
    renderer.view.addEventListener('mouseup', function(evt) {
        if(mouseIsDown){
            mouseClick = true;
        }
        mouseIsDown = false;
    }, false);

    var markers = new Markers();

    var mode = $("#modeSelect")[0].innerText;
    var planetVisibility = $("#planetSelect")[0].innerText;
    var seed = $("#seed")[0].innerText;
    var players = [];

    var gameNum = 1;
    var state = "split";

    var split = null;
    var planets = [];

    var shipPos = [markers.start[0], markers.start[1]];
    var shipVel = [0, 0];

    if(mode == "PvP"){
        players.push(new HumanPlayer());
        players.push(new HumanPlayer());
    } else if (mode == "PvAI") {
        players.push(new HumanPlayer());
        players.push(new AIPlayer());
    } else if (mode == "AIvP") {
        players.push(new AIPlayer());
        players.push(new HumanPlayer());
    } else if (mode == "AIvAI") {
        players.push(new AIPlayer());
        players.push(new AIPlayer());
    }

    var target = null;
    var ship = null;

    var tick = 0;
    var minDist = Number.POSITIVE_INFINITY;
    var adversaryMinDist = Number.POSITIVE_INFINITY;
    var launchNum = 1;
    var scores = [0,0]

    target = PIXI.Sprite.fromImage('target.png');
    target.anchor.set(.5);
    target.position.x = markers.target[0];
    target.position.y = markers.target[1];
    target.scale.x = .1;
    target.scale.y = .1;
    stage.addChild(target);

    ship = PIXI.Sprite.fromImage('ship.png');
    ship.anchor.set(.5);
    ship.position.x = markers.start[0];
    ship.position.y = markers.start[1];
    ship.scale.x = .1;
    ship.scale.y = .1;
    stage.addChild(ship);

    PIXI.Sprite.fromImage('planet.png')

    var text = new PIXI.Text('', {fontFamily: 'Arial', fontSize: 18, fill: 0xFFFFFF, align: 'center'});
    text.anchor.set(.5);
    text.position.x = stageWidth / 2;
    text.position.y = 40;
    stage.addChild(text);

    var subtext = new PIXI.Text('', {fontFamily: 'Arial', fontSize: 18, fill: 0xFFFFFF, align: 'center'});
    subtext.anchor.set(.5);
    subtext.position.x = stageWidth / 2;
    subtext.position.y = 80;
    stage.addChild(subtext);

    var sent = false;

    var planetImages = [];
    animate();
    function animate() {
        requestAnimationFrame(animate);

        var newState = null;

        text.text = "";
        subtext.text = "";

        if(state == "split"){
            text.text = "Player " + gameNum + " click to choose planet weight split (horizontal mouse position)";

            if(seed !== "") {
                Math.seedrandom(seed + "-0-" + gameNum);
            }

            ship.position.x = markers.start[0];
            ship.position.y = markers.start[1];
            ship.rotation = 0;

            for(var i = 0; i < planetImages.length; ++i) {
                stage.removeChild(planetImages[i]);
            }

            var result = players[gameNum - 1].chooseFirstPlanetWeight(markers, mousePos.x, mousePos.y, mouseClick);
            var value = Math.min(999, Math.max(1, result[0]));

            subtext.text = "Planet 1: " + value +"   Planet 2: " + (1000-value);
            if(result[1]){
                split = value;
                newState = "planet1";
            }
        } else if(state == "planet1"){
            text.text = "Player " + gameNum + " click to choose planet 1 position";

            if(seed !== "") {
                Math.seedrandom(seed + "-1-" + gameNum);
            }

            var result = players[gameNum - 1].choosePlanetPosition(markers, mousePos.x, mousePos.y, mouseClick);
            if(result[1]){
                planets.push(result[0]);

                if(planetVisibility === "Visible") {
                    var scale = Math.pow((split / 1000.0) * .007, 1.0 / 3.0);
                    var img = PIXI.Sprite.fromImage('planet.png');
                    img.anchor.set(.5);
                    img.position.x = result[0][0];
                    img.position.y = result[0][1];
                    img.scale.x = scale;
                    img.scale.y = scale;
                    planetImages.push(img);
                    stage.addChildAt(img, 1);
                }

                newState = "planet2";
            }
        } else if(state == "planet2"){
            text.text = "Player " + gameNum + " click to choose planet 2 position";

            if(seed !== "") {
                Math.seedrandom(seed + "-2-" + gameNum);
            }

            var result = players[gameNum - 1].choosePlanetPosition(markers, mousePos.x, mousePos.y, mouseClick);
            if(result[1]){
                planets.push(result[0]);

                if(planetVisibility === "Visible") {
                    var scale = Math.pow(((1000 - split) / 1000.0) * .007, 1.0 / 3.0);
                    var img = PIXI.Sprite.fromImage('planet.png');
                    img.anchor.set(.5);
                    img.position.x = result[0][0];
                    img.position.y = result[0][1];
                    img.scale.x = scale;
                    img.scale.y = scale;
                    planetImages.push(img);
                    stage.addChildAt(img, 1);
                }

                newState = "chooseR";
            }
        } else if(state == "chooseR"){
            text.text = "Player " + (3-gameNum) + " click to launch";
            if(minDist < 2000) {
                subtext.text = "Closest distance (seeker): " + minDist;
            }

            var result = players[2 - gameNum].chooseR(markers, planets, split, launchNum, mousePos.x, mousePos.y, mouseClick);
            ship.rotation = result[0];
            ship.position.x = markers.start[0];
            ship.position.y = markers.start[1];
            if(result[1]){
                planets.push(result[0]);
                newState = "launch";

                shipPos = [markers.start[0], markers.start[1]];
                shipVel = [10*Math.sin(result[0]), -10*Math.cos(result[0])];
                tick = 0;

            }
        } else if(state == "adversaryChooseR"){
            text.text = "Player " + (gameNum) + " click to launch";

            var result = players[gameNum - 1].chooseR(markers, planets, split, -1, mousePos.x, mousePos.y, mouseClick);
            ship.rotation = result[0];
            ship.position.x = markers.start[0];
            ship.position.y = markers.start[1];
            if(result[1]){
                planets.push(result[0]);
                newState = "launch";

                shipPos = [markers.start[0], markers.start[1]];
                shipVel = [10*Math.sin(result[0]), -10*Math.cos(result[0])];
                tick = 0;

            }
        } else if(state == "launch"){
            var oPos = [shipPos[0], shipPos[1]];

            for(var i = 0; i < planets.length-1; ++i) {
                var mass = ((i==0) ? split : 1000-split) * massScaling;
                var xd = planets[i][0] - shipPos[0];
                var yd = planets[i][1] - shipPos[1];
                var d = Math.sqrt(xd * xd + yd * yd);
                var force = mass/(d*d);
                var direction = Math.atan2(xd, yd);
                if(isNaN(force)){
                    force = 0;
                    direction = 1;
                }
                shipVel[0] += force * Math.sin(direction);
                shipVel[1] += force * Math.cos(direction);
            }

            shipPos[0] += shipVel[0];
            shipPos[1] += shipVel[1];

            ship.position.x = shipPos[0];
            ship.position.y = shipPos[1];
            ship.rotation = Math.PI - Math.atan2(shipPos[0] - oPos[0], shipPos[1] - oPos[1]);

            graphics.beginFill(0x600000);
            graphics.lineStyle(3, 0x600000);
            graphics.moveTo(oPos[0], oPos[1]);
            graphics.lineTo(shipPos[0], shipPos[1]);
            graphics.endFill();

            tick++;

            var xDist = shipPos[0] - markers.target[0];
            var yDist = shipPos[1] - markers.target[1];
            var dist = Math.round(Math.sqrt(xDist * xDist + yDist * yDist));

            if(launchNum < 6) {
                minDist = Math.min(minDist, dist);
                subtext.text = "Closest distance (seeker): " + minDist;
            } else {
                adversaryMinDist = Math.min(adversaryMinDist, dist);
                subtext.text = "Closest distance (hider): " + adversaryMinDist;
            }

            if(shipPos[0] < 0 || shipPos[0] > stageWidth || shipPos[1] < 0 || shipPos[1] > stageHeight || tick > 60*8){
                launchNum++;
                if(launchNum <= 5) {
                    newState = "chooseR";
                } else if(launchNum == 6) {
                    newState = "adversaryChooseR";
                    graphics.clear();
                } else {
                    newState = "end";
                    graphics.clear();
                }
            }
        } else if (state == "end"){
            if(gameNum == 1) {
                scores[0] += adversaryMinDist;
                scores[1] += minDist;
                newState = "split";
                launchNum = 1;
                planets = [];
                gameNum++;
            } else {
                scores[0] += minDist;
                scores[1] += adversaryMinDist;
                newState = "complete";
            }
            minDist = Number.POSITIVE_INFINITY;
            adversaryMinDist = Number.POSITIVE_INFINITY;
        } else if (state == "complete"){
            if(scores[0] < scores[1]) {
                text.text = "Player 1 Wins";
            } else if(scores[0] > scores[1]){
                text.text = "Player 2 Wins";
            } else {
                text.text = "Tie Game";
            }
            subtext.text = "Player 1: " + scores[0] + "   Player 2: " + scores[1];

            if(!sent){
                sent = true;

                for(var i = 0; i < players.length; ++i) {
                    if(players[i].isHuman()) {
                        var won = (scores[i] < scores[1-i]) ? 1 : 0;
                        $.get("../../dbman/saveScore.php", {gamename:"Gravity", playername:"player "+(i+1), score:scores[i]});
                        // var url = "../../dbman/saveScore.php?gamename=gravity-game&playername=player" + (i+1) + "&score=" + won;
                        // httpGetAsync(url, function () {
                        // });
                    }
                }
            }
        }

        if(newState !== null){
            state = newState;
        }

        mouseClick = false;

        renderer.render(stage);

        bg.filters[0].uniforms.time += 1;
    }
}