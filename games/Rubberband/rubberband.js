/*-------------- GLOBAL VARIABLES -------------------------------------------*/

/*---Buttons and HTML---*/
var startButton = document.getElementById('startButton');
var resetButton = document.getElementById('resetButton');
var reselectButton = document.getElementById('reselect');
var drawButton = document.getElementById('draw');
var settings = document.getElementById('settings');
var help = document.getElementById('help'); 

var settingsPopup = document.getElementById('settingsModal');
var settingsClose = document.getElementsByClassName("settingsClose")[0];

var helpPopup = document.getElementById('helpModal');
var helpClose = document.getElementsByClassName("helpClose")[0];

var bandSelection = document.getElementById("numBands");

var message = document.getElementById('message');
var displayPlayerOneNails = document.getElementById('numPlayerOneNails');
var displayPlayerTwoNails = document.getElementById('numPlayerTwoNails');

/*---Canvas---*/
var canvas = document.getElementById('canvas');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var context = canvas.getContext('2d');

var width = 12;
var height = 12;

/*---Game State---*/
var nails = [];
var rubberBands = 5;
var totalNails = 60
var maxNailsSelected = 4;

var playerOneNails = [];
var playerTwoNails = [];
var unClaimedNails = [];

var playerOneBands = [];
var playerTwoBands = [];
var gameEnded = false;

/*---Turn State---*/
var currentTurn = 0;
var nailsSelected = [];


/*---Images---*/
var sources = {
	nail: 'Assets/screwHead.png'
};

var finalImages = {};

/*-------------- DISPLAY METHODS --------------------------------------------*/

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function getMousePosition(evt) {
    var x = new Number();
    var y = new Number();
    if (evt.pageX != undefined && evt.pageY != undefined) {
        x = evt.pageX;
        y = evt.pageY;
    } else {
        x = evt.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
        y = evt.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft + 1;
    y -= canvas.offsetTop + 1;
    return {
        x: x,
        y: y
    };
}

function Mix(k,x,y) {
  return (1 - k) * x + k * y;
};

function setPixel(imageData, x, y, rgb, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = rgb[0];
    imageData.data[index+1] = rgb[1];
    imageData.data[index+2] = rgb[2];
    imageData.data[index+3] = a;
};

function getPixel(imageData, x, y) {
    index = (x + y * imageData.width) * 4;
    return [imageData.data[index+0],
            imageData.data[index+1],
            imageData.data[index+2]];
};

function drawNail(i, j, color) {
	context.drawImage(finalImages.nail, i, j, width, height);

	if(color != 'none') {
		imageData = context.getImageData(i, j, width, height);
		imageDataNew = context.createImageData(width, height);

		for (x = 0 ; x < width ; x++) {
		    for (y = 0 ; y < height ; y++) {
		        rgb = getPixel(imageData, x, y);
		        if(!(rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0)) {
			        k = rgb[2] / 255;
			        
			        if(color == 'red') {
			        	rgb[0] = Mix(k, rgb[0], 255);
			        	rgb[1] = Mix((1 - k) * (1 - k), rgb[1], 0);
			        	rgb[2] = Mix(k, rgb[2], 0);
			        }
			        if(color == 'green') {
			        	rgb[1] = Mix(k, rgb[1], 255);
			        	rgb[0] = Mix((1 - k) * (1 - k), rgb[0], 0);
			        	rgb[2] = Mix(k, rgb[2], 0);
			        }
			        if(color == 'blue') {
			        	rgb[2] = Mix(k, rgb[2], 255);
			        	rgb[1] = Mix((1 - k) * (1 - k), rgb[1], 0);
			        	rgb[0] = Mix(k, rgb[0], 0);
			        }
			        if(color == 'yellow') {
			        	rgb[0] = Mix(k, rgb[0], 255);
			        	rgb[2] = Mix((1 - k) * (1 - k), rgb[2], 0);
			        	rgb[1] = Mix(k, rgb[1], 255);
			        }
			        setPixel(imageDataNew, x, y, rgb, 0xff);
			    }
		    }
		}

		context.putImageData(imageDataNew, i, j);
	}
}

function selectNail(nail) {
	centerX = nail[0] - width/2;
	centerY = nail[1] - height/2;
	drawNail(centerX , centerY, 'yellow');
}

function deselectNails(nails, color) {
	for(var i = 0 ; i < nails.length ; i++) {
		centerX = nails[i][0] - width/2;
		centerY = nails[i][1] - height/2;
		
		drawNail(centerX , centerY, color);
	}
}

function drawRubberBand(nails, turn) {

	color = 'red';
	if(turn == 2) {
		color = 'green';
	}

	for(var i = 0 ; i < nails.length - 1 ; i++) {
		drawBandLine(nails[i], nails[i + 1], color);
	}
	/*drawBandLine(nails[nails.length - 1], nails[0], color);*/
}

function drawBandLine(firstNail, secondNail, color) {
	context.beginPath();
    context.moveTo(firstNail[0], firstNail[1]);
    context.lineTo(secondNail[0], secondNail[1]);

    if(color == 'red') {
    	context.strokeStyle = '#FF0000';
    }
    if(color == 'green') {
    	context.strokeStyle = '#228B22';
    }
    if(color == 'blue') {
    	context.strokeStyle = '#1E90FF';
    }

    context.stroke();
}

function drawAllNails(nails, color) {

	for(var i = 0 ; i < nails.length ; i++) {
		centerX = nails[i][0] - width/2;
		centerY = nails[i][1] - height/2;
    	drawNail(centerX, centerY, color);
    }
}

function generateRandomNails() {
	/*var randomNails = [[50, 50], [200, 200], [200, 50],
				 	   [75, 100], [150, 350], [400, 50],
					   [400, 75], [160, 210], [390, 220],
					   [75, 120], [145, 180], [240, 400]];
	*/
	
	//console.log("Started");
	randomNails = []
	//randomNails = [[45, 45],[45, 100],[45, 200], [100, 150]];
	var count = 0;
	while(count < totalNails) {
		//console.log(count);
		x = Math.random()* 450 + 10;
		y = Math.random()* 450 + 10;
		nail = [x, y];
		//nail.push(x);
		//nail.push(y);
		//console.log(nail);
		if (!isPresentClose(nail, randomNails, 30)) {
			//console.log("not present");
			randomNails.push(nail);
			count= count + 1;
			
		}
		//console.log("count")
		//console.log(count);
	}
	//console.log("Generated");
	return randomNails;
}

function startGame() {
	currentTurn = 1;
	nails = generateRandomNails();

	playerOneNails = [];
	playerTwoNails = [];

	playerOneBands = [];
	playerTwoBands = [];

	rubberBands = bandSelection.value;
	
	var bandsLeft = rubberBands.toString();
	displayPlayerOneNails.innerHTML = 
		"<div><b>Player 1's nails: </b>" + playerOneNails.length + "</div>";
	displayPlayerTwoNails.innerHTML = 
		"<div><b>Player 2's nails: </b>" + playerTwoNails.length + "</div>";
	message.innerHTML = 
			"<div style=\"color:black;\">Player 1's turn. You have " + bandsLeft 
			+ " bands left.</div>";

	loadImages(sources, function(images) {
		finalImages = images;
		drawAllNails(nails, 'none');
	});
}

function resetGame() {
	startGame();
}

function updateDisplay(playerOneBands, playerTwoBands) {
	playerOneNails = [];
	playerTwoNails = [];
	unClaimedNails = [];
	for(var i = 0; i < nails.length; i++) {
		nail = nails[i];
		minDisPlayerOne = 10000;
		minDisPlayerTwo = 10000;
		for(var j = 0; j < playerOneBands.length; j++) {
			dis = getEnclosingDistance(nail, playerOneBands[j]);
			if(dis < minDisPlayerOne) {
				minDisPlayerOne = dis;
			}
		}
		for(var k = 0; k < playerTwoBands.length; k++) {
			dis = getEnclosingDistance(nail, playerTwoBands[k]);
			if(dis < minDisPlayerTwo) {
				minDisPlayerTwo = dis;
			}
		}
		if (minDisPlayerOne == minDisPlayerTwo) {
			unClaimedNails.push(nail);
		}
		if (minDisPlayerOne < minDisPlayerTwo) {
			playerOneNails.push(nail);
		}
		if (minDisPlayerOne > minDisPlayerTwo) {
			playerTwoNails.push(nail);
		}
	}
	updatePlayerNails(playerOneNails, playerTwoNails, unClaimedNails);
}

function updatePlayerNails(playerOneNails, playerTwoNails, unClaimedNails) {
	deselectNails(playerOneNails, 'red');
	deselectNails(playerTwoNails, 'green');
	deselectNails(unClaimedNails, 'none');
}


function orientation(p, q, r) {
	var val = (q[1] - p[1]) * (r[0] - q[0]) -
			(q[0] - p[0]) * (r[1] - q[1]);
	if (val == 0) {
		return 0;
	}
	if (val > 0) {
		return 1;
	}
	else {
		return 2;
	}
}


function onSegment(p, q, r) {
	if (q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) && q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]))
        return true;
    return false;
}

function doIntersectIncludeOnSegment(p1, q1, p2, q2) {
	o1 = orientation(p1, q1, p2);
    o2 = orientation(p1, q1, q2);
    o3 = orientation(p2, q2, p1);
    o4 = orientation(p2, q2, q1);
	if (o1 != o2 && o3 != o4) {
		//console.log("True`");
		return true;
	}
	
	if (o1 == 0 && onSegment(p1, p2, q1)) return true;
 
    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;
 
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;
 
     // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;
	return false;
}
function isPresentClose(p, band, minDis) {
	for(var i = 0; i < band.length; i++) {
		//console.log(band[i]);
		tempBand = [[band[i][0] - minDis,band[i][1] + minDis], [band[i][0] + minDis,band[i][1] + minDis], [band[i][0] +minDis,band[i][1] - minDis], [band[i][0] -minDis,band[i][1] - minDis], [band[i][0] - minDis,band[i][1] + minDis]];
		//console.log(tempBand);
		dis = getEnclosingDistance(p, tempBand);
		//console.log(dis);
		if (dis != 10000) {
			return true
		} 
	}
	return false;
}

function isPresent(p, band) {
	for(var i = 0; i < band.length; i++) {
		if(sameNails(p, band[i])){
			return true;
		}
	}
	return false;
}

function isPresentBandList(p, bandList) {
	for(var i = 0; i < bandList.length; i++) {
		if(isPresent(p, bandList[i])){
			return true;
		}
	}
	return false;
}

function anyElementAlreadyPresent(temporaryBand, primary) {
	for(var i = 0; i < temporaryBand.length; i++) {
		if(isPresent(temporaryBand[i], primary)) {
			return true;
		}
	}
	return false;
}

function anyElementAlreadyPresentBandList(temporaryBand, primaryList) {
	for(var i = 0; i < primaryList.length; i++) {
		if(anyElementAlreadyPresent(temporaryBand, primaryList[i])) {
			return true;
		}
	}
	return false;
}

function getDistance(p, q) {
	var val =  ((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]))
	var sq = Math.sqrt(val);
	return sq;
}

function getEnclosingDistance(p, rubberBand) {
    // There must be at least 3 vertices in polygon[]
    //console.log("Here");
	//console.log(p);
	//print(rubberBand);
	n = rubberBand.length;
	if (n == 1) { 
		if(sameNails(p, rubberBand[0])) {
			return 0;
		}
		else {
			return 10000;
		}
	}
	//Length of 3 implies, two points. Last and first are same.
	if (n == 3) {
		if(sameNails(p, rubberBand[0]) || sameNails(p, rubberBand[1])) {
			return 0;
		}
		else {
			return 10000;
		}
	}
		
 
    // Create a point for line segment from p to infinite
    extreme = [10000, p[1]];
 
    // Count intersections of the above line with sides of polygon
    count = 0;
	i = 0;
    do
    {
        next = (i+1)%n;
 
        // Check if the line segment from 'p' to 'extreme' intersects
        // with the line segment from 'polygon[i]' to 'polygon[next]'
        if (doIntersectIncludeOnSegment(rubberBand[i], rubberBand[next], p, extreme))
        {
            // If the point 'p' is colinear with line segment 'i-next',
            // then check if it lies on segment. If it lies, return true,
            // otherwise false
            if (orientation(rubberBand[i], p, rubberBand[next]) == 0)
			{
               if(onSegment(rubberBand[i], p, rubberBand[next])){
				   return 0;
			   }
			   else {
					return 10000;
			   }
			}
            count++;
        }
        i = next;
    } while (i != 0);
	
	//console.log(count);
    // Return true if count is odd, false otherwise
    if(count&1) {
		var dis =  getMinimumDistance(p, rubberBand);
		// console.log(dis);
		return dis;
	}
	else {
		return 10000;
	}	
}

function getMinimumDistance(p, rubberBand) {
	minimum = 10000;
	for(var i = 1 ; i < rubberBand.length ; i++) {
		dis = distToSegment(p, rubberBand[i], rubberBand[i - 1]); 
		// console.log(dis);
		if (dis < minimum) {
			minimum = dis;
		}
	}
	return minimum;
}


/* Code copied from http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment */
function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }


function doIntersect(p1, q1, p2, q2) {
	/*console.log(p1);
	console.log(q1);
	console.log(p2);
	console.log(q2);
	*/
	o1 = orientation(p1, q1, p2);
    o2 = orientation(p1, q1, q2);
    o3 = orientation(p2, q2, p1);
    o4 = orientation(p2, q2, q1);
	if (o1 == 0 || o2 == 0 || o3 == 0 || o4 == 0) {
		//console.log("False");
		return false;
	}
	
	if (o1 != o2 && o3 != o4) {
		//console.log("True`");
		return true;
	}
	//console.log("False");
	return false;
}


function checkIfBandsIntersect(p1, q1, nailsSelected, startIndex) {
	for(var i = startIndex + 1 ; i < nailsSelected.length ; i++) {
		p2 = nailsSelected[i];
		q2 = nailsSelected[i-1];
		if (doIntersect(p1, q1, p2, q2)) {
			return true;
		}
	}
	return false;
}

/*function getClosestDistances(nail, PlayerOneBands)*/

function checkCrossings(nailsSelected) {
	/* Assume that nailSelected's first and last nail are the same */
	
	if(nailsSelected.length < 4) {
		return false;
	}
	for(var i = 1 ; i < nailsSelected.length ; i++) {
		if (checkIfBandsIntersect(nailsSelected[i], nailsSelected[i - 1], nailsSelected, i) == true) {
			return true;
		}
	}
	return false;
}

function sameNails(nail1, nail2) {
	return (nail1[0] == nail2[0] && nail1[1] == nail2[1])
}

function checkConcave(nailsSelected) {
	if (nailsSelected.length < 4) {
		return false;
	}
	isPostive = false;
	for(var i = 2 ; i < nailsSelected.length ; i++) {
		p = nailsSelected[i-2];
		q = nailsSelected[i-1];
		r = nailsSelected[i];
		dx1 = q[0] - p[0];
		dy1 = q[1] - p[1];
		dx2 = r[0] - q[0];
		dy2 = r[1] - q[1];
		zcross = dx1*dy2 - dy1*dx2;
		if (zcross > 0 && i == 2) {
			isPostive = true;
		}
		if(isPostive && zcross < 0 && i != 2) {
			return true;
		}
		if(!isPostive && zcross > 0 && i != 2){
			return true;
		}
	}
	/* :Last nail is same as first. */
	p = nailsSelected[nailsSelected.length - 2];
	q = nailsSelected[0];
	r = nailsSelected[1];
	dx1 = q[0] - p[0];
	dy1 = q[1] - p[1];
	dx2 = r[0] - q[0];
	dy2 = r[1] - q[1];
	zcross = dx1*dy2 - dy1*dx2;
	if(isPostive && zcross < 0) {
		return true;
	}
	if(!isPostive && zcross > 0){
		return true;
	}
	return false;
}

function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
}

function endGame() {
	var winner = 0;
	var winnerNails = 0;
	if(playerOneNails.length > playerTwoNails.length) {
		winner = 1;	
		winnerNails = playerOneNails.length;
	}
	else if(playerTwoNails.length > playerOneNails.length) {
		winner = 2;
		winnerNails = playerTwoNails.length;
	}
	else {
		winner = 0;
	}

	if(winner == 0) {
		message.innerHTML = 
		"<div style=\"color:green;\">Game ended in a draw!</div>";
	} else {
		message.innerHTML = 
		"<div style=\"color:green;\">Game finished. Player " + winner 
		+ " is the winner!</div>";
	}

	var score = winnerNails;
	var url = '';
	var username = getCookie('username')
	if(winner != 0) {
		url = "../../dbman/saveScore.php?gamename=Rubberband&playername="+username+"&score=" + winnerNails;
	} else {
		url = "../../dbman/saveScore.php?gamename=Rubberband&playername="+username+"&score=TIE";
	}

	httpGetAsync(url, function () { });

	gameEnded = true;	
	currentTurn = 0;

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function print(nailsSelected) {
	for(var i = 0; i < nailsSelected.length; i++) {
	 	console.log(nailsSelected[i]);
	 }
}

/*-------------- MAIN -------------------------------------------------------*/

/*---Settings---*/
settings.onclick = function() {
    settingsPopup.style.display = "block";
}

settingsClose.onclick = function() {
    settingsPopup.style.display = "none";
}


/*---Help---*/
help.onclick = function() {
	helpPopup.style.display = "block";
}

helpClose.onclick = function() {
	helpPopup.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == settingsPopup) {
        settingsPopup.style.display = "none";
    }
    if(event.target == helpPopup) {
    	helpPopup.style.display = "none";
    }
}

/*---Start---*/
startButton.addEventListener('click', function(evt) {
	if(currentTurn != 0) {
		message.innerHTML = 
			"<div style=\"color:red;\">Game has already started!</div>";
        return;
	}

   	startGame();
}, false);

/*---Reset---*/
resetButton.addEventListener('click', function(evt) {
	if(gameEnded) {
		message.innerHTML = 
			"<div style=\"color:red;\">The game has ended. Please start a new game to play more</div>";
        return;
	}

	if(currentTurn == 0) {
		message.innerHTML = 
			"<div style=\"color:red;\">Game has not started!</div>";
        return;
	}

	context.clearRect(0, 0, canvas.width, canvas.height);
	startGame();
}, false);

/*---Draw---*/
drawButton.addEventListener('click', function(evt) {
	if(gameEnded) {
		message.innerHTML = 
			"<div style=\"color:red;\">The game has ended. Please start a new game to play more</div>";
        return;
	}

	if(currentTurn == 0) {
		message.innerHTML = 
			"<div style=\"color:red;\">Game has not started!</div>";
        return;
	}

	if(nailsSelected.length == 0) {
		message.innerHTML = 
			"<div style=\"color:red;\">No nails selected!</div>";
        return;
    }

    
	
	if(!sameNails(nailsSelected[0], nailsSelected[nailsSelected.length - 1])) {
		nailsSelected.push(nailsSelected[0]);
	}
	if(checkConcave(nailsSelected) || checkCrossings(nailsSelected)) {
		//deselectNails(nailsSelected, 'none');
		updateDisplay(playerOneBands, playerTwoBands);
		if(currentTurn == 1) {
			var bandsLeft = rubberBands - playerOneBands.length;
			message.innerHTML = 
			"<div style=\"color:black;\">Invalid selection: No crossing or concave shape allowed." 
			+ " Player 1's turn. You have " + bandsLeft +" bands left.</div>";
		} else {
			var bandsLeft = rubberBands - playerTwoBands.length;
			message.innerHTML = 
			"<div style=\"color:black;\">Invalid selection: No crossing or concave shape allowed."
			+ " Player 2's turn. You have " + bandsLeft + " bands left.</div>";
		}
		nailsSelected = [];
		return;
	}
	
	//elementsToDeselect = []
	//sameNailsSelectedError = false;
	if(anyElementAlreadyPresentBandList(nailsSelected, playerOneBands) ||
	anyElementAlreadyPresentBandList(nailsSelected, playerTwoBands)) {
		//deselectNails(nailsSelected, 'none');
		if(currentTurn == 1) {
			var bandsLeft = rubberBands - playerOneBands.length;
			message.innerHTML = 
			"<div style=\"color:black;\">Invalid selection: Few nails already selected." 
			+ " Player 1's turn. You have " + bandsLeft +" bands left.</div>";
		
		} else {
			var bandsLeft = rubberBands - playerTwoBands.length;
			message.innerHTML = 
			"<div style=\"color:black;\">Invalid selection: Few nails already selected."
			+ " Player 2's turn. You have " + bandsLeft + " bands left.</div>";
		}
		nailsSelected = [];
		updateDisplay(playerOneBands, playerTwoBands);
		return;
	}
	/*for(var i = 0; i < nailsSelected.length; i++) {
		nail = nailsSelected[i];
		if(isPresentBandList(nail, playerOneBands) || isPresentBandList(nail, playerTwoBands)) {
			sameNailsSelectedError = true;
			if(currentTurn == 1)
				message.innerHTML = 
				"<div style=\"color:black;\">Invalid selection: Few nails already selected. Player 1's turn...</div>";
			else
				message.innerHTML = 
				"<div style=\"color:black;\">Invalid selection: Few nails already selected. Player 2's turn...</div>";
			
		} else {
			elementsToDeselect.push(nail);
		}
	}
	
	if (sameNailsSelectedError) {
		updateDisplay(playerOneBands, playerTwoBands);
		//deselectNails(elementsToDeselect, 'none');
		return;
	}*/
	drawRubberBand(nailsSelected, currentTurn);
    
	
	if(currentTurn == 1)
    	playerOneBands.push(nailsSelected);
		//deselectNails(nailsSelected, 'red');
    else
		playerTwoBands.push(nailsSelected);
    	//deselectNails(nailsSelected, 'green');
	updateDisplay(playerOneBands, playerTwoBands);
	
	console.log("Player one nails:");
	print(playerOneNails);
	displayPlayerOneNails.innerHTML = 
		"<div><b>Player 1's nails: </b>" + playerOneNails.length + "</div>";
	displayPlayerTwoNails.innerHTML = 
		"<div><b>Player 2's nails: </b>" + playerTwoNails.length + "</div>";

    nailsSelected = [];

    if(currentTurn == 1) {
    	var bandsLeft = rubberBands - playerTwoBands.length;
    	currentTurn = 2;
    	message.innerHTML = 
			"<div style=\"color:black;\">Player 2's turn. You have " + bandsLeft 
			+ " bands left</div>";
    } else {

    	var bandsLeft = rubberBands - playerOneBands.length;

    	if(bandsLeft == 0) {
    		endGame();
    	} else {
	    	currentTurn = 1;
	    	message.innerHTML = 
				"<div style=\"color:black;\">Player 1's turn. You have " + bandsLeft 
				+ " bands left</div>";
    	}
    }

}, false);

/*---Selecting Nails---*/
canvas.addEventListener('click', function(evt) {
	if(gameEnded) {
		message.innerHTML = 
			"<div style=\"color:red;\">The game has ended. Please start a new game to play more</div>";
        return;
	}

	if(currentTurn == 0) {
		message.innerHTML = 
			"<div style=\"color:red;\">Game has not started!</div>";
        return;
	}

	if(nailsSelected.length == 4) {
		message.innerHTML = 
			"<div style=\"color:red;\">Cannot select more than 4 nails</div>";
        return;
	}

    var mousePosition = getMousePosition(evt);

    for(var i = 0 ; i < nails.length ; i++) {
    	if(mousePosition.x > Math.max(0, nails[i][0]) &&
    			mousePosition.x < Math.min(500, nails[i][0] + width)) {
    		if(mousePosition.y > Math.max(0, nails[i][1]) &&
    				mousePosition.y < Math.min(500, nails[i][1] + height)) {
    			nailsSelected.push(nails[i]);
    			selectNail(nails[i]);
    		}
    	}
    }

}, false);

/*---Reselect---*/
reselectButton.addEventListener('click', function(evt) {
	if(gameEnded) {
		message.innerHTML = 
			"<div style=\"color:red;\">The game has ended. Please start a new game to play more</div>";
        return;
	}

	if(currentTurn == 0) {
		message.innerHTML = 
			"<div style=\"color:red;\">Game has not started!</div>";
        return;
	}

	if(nailsSelected.length == maxNailsSelected) {
		message.innerHTML = 
			"<div style=\"color:red;\">No nails selected!</div>";
        return;
    }

    deselectNails(nailsSelected, 'none');
    nailsSelected = [];
}, false);
