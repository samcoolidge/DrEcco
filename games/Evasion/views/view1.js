$(document).ready(function(){
  //input functions
  $("#gameModeInput").change(function() {
    $("#HunterNameInput").val("");
    $("#PreyNameInput").val("");
    if($("#gameModeInput option:selected").val() == "CvH") $("#HunterNameInput").val("COM");
    if($("#gameModeInput option:selected").val() == "HvC") $("#PreyNameInput").val("COM");
  });
  $("input[name='WallCoolDown']").click(function() {
    var tmp = this.value;
    $("#wallCoolDownerror").hide();
    if(tmp == "Fast") $("#wallCoolDownInput").val("10");
    else if(tmp == "Medium") $("#wallCoolDownInput").val("25");
    else if(tmp == "Slow") $("#wallCoolDownInput").val("50");
    else $("#wallCoolDownerror").show();

  });
  $("#wallCoolDownInput").bind('keyup mouseup', function () {
    console.log("changed");
    $("input[name='WallCoolDown'][value='Custom']").prop("checked", true);
    $("#wallCoolDownerror").hide();
    if($("#wallCoolDownInput").val() < 1 || $("#wallCoolDownInput").val() > 100) 
      $("#wallCoolDownerror").show(); 
  });
  $("#wallNumInput").bind('keyup mouseup', function () {
    console.log("wall number changed");
    $("#wallnumbererror").hide();
    if($("#wallNumInput").val() < 2 || $("#wallNumInput").val() > 9) 
      $("#wallnumbererror").show();
  });
  $('#gameScore').val(-1);
});

//init hover
$(document).ready(function(){
  $('[data-toggle="popover"]').popover();
});

//init canvas
$(document).ready(function(){
  $("#time").val(0);
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 303, 303);

  ctx.translate(0.5, 0.5);

  ctx.lineCap = "square";

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(301, 0);
  ctx.lineTo(301, 301);
  ctx.lineTo(0, 301);
  ctx.lineTo(0, 0);
  ctx.stroke();
  color = randomColor({
    luminosity: 'bright',
    count: 10
  });
});

var checkData = function(){
  var wallCoolDownValid = ! ($("#wallCoolDownInput").val() < 1 || $("#wallCoolDownInput").val() > 100);
  var wallNumValid = ! ($("#wallNumInput").val() < 2 || $("#wallNumInput").val() > 9);
  if(wallCoolDownValid && wallNumValid){
    $("#Setting").modal("hide");
    gameStart();
  }
  else{
    alert("Please check inputs");
  }
}

var gameStart = function(){
  $("#gameMode").text($("#gameModeInput").val());
  $("#HunterName").text($("#HunterNameInput").val());
  $("#PreyName").text($("#PreyNameInput").val());
  $("#wallNum").text($("#wallNumInput").val());
  $("#wallCoolDown").text($("#wallCoolDownInput").val());
  $("#easyMove").text($("#easyMoveInput").prop("checked") ? "On" : "Off");
  if($("#gameModeInput").val() == "HvH")
    $('#textArea').val("Welcome " + $("#HunterNameInput").val() + ", " + $("#PreyNameInput").val());
  if($("#gameModeInput").val() == "CvH")
    $('#textArea').val("Welcome " + $("#PreyNameInput").val());
  if($("#gameModeInput").val() == "HvC")
    $('#textArea').val("Welcome " + $("#HunterNameInput").val());
  appendText("Game Start!");
  $('#wallArea').empty();
  var gameMode = $("#gameModeInput").val();
  var HunterName = $("#HunterNameInput").val();
  var PreyName = $("#PreyNameInput").val();
  var wallNum = $("#wallNumInput").val();
  var wallCoolDown = $("#wallCoolDownInput").val();
  var easyMove = $("#easyMoveInput").prop("checked");
  var leftpress = false;
  var rightpress = false;
  var uppress = false;
  var downpress = false;
  var wallAction = -1;
  wallDelete = -1;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  $("#gameEnd").val("false");
  var tick = 0;
  var Game = new game(wallNum, wallCoolDown, gameMode == "CvH");
  var buildWall = false;
  $(document).keydown(function(e) {
    leftpress = false;
    rightpress = false;
    uppress = false;
    downpress = false;
        if(e.which == 37) // left
          leftpress = true;
        else if(e.which == 38) // up
          uppress = true;
        else if(e.which == 39) // right
          rightpress = true;
        else if(e.which == 40) // down
          downpress = true;
        
        else if(e.which == 72) //H
          wallAction = 0;
        else if(e.which == 86) //V
          wallAction = 1;
        else if(e.which == 49) //1
          wallDelete = 1;
        else if(e.which == 50) //1
          wallDelete = 2;
        else if(e.which == 51) //1
          wallDelete = 3;
        else if(e.which == 52) //1
          wallDelete = 4;
        else if(e.which == 53) //1
          wallDelete = 5;
        else if(e.which == 54) //1
          wallDelete = 6;
        else if(e.which == 55) //1
          wallDelete = 7;
        else if(e.which == 56) //1
          wallDelete = 8;
        else if(e.which == 57) //1
          wallDelete = 9;

        else return; // exit this handler for other keys
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
  var drawInterval = setInterval(function(){
    console.log($("#gameEnd").val());
    if($("#gameEnd").val() == "false"){
      var hunterXPos = Game.hunterPos.x;
      var hunterYPos = Game.hunterPos.y;
      var hunterXVel = Game.hunterXVel;
      var hunterYVel = Game.hunterYVel;
      var preyXPos = Game.preyPos.x;
      var preyYPos = Game.preyPos.y;
      
      var PreyXMove = 0;
      var PreyYMove = 0;

      if(gameMode == "HvH"){
        if(leftpress) PreyXMove = -1;
        if(rightpress) PreyXMove = 1;
        if(uppress) PreyYMove = -1;
        if(downpress) PreyYMove = 1;
        var closemove = PreyCloseMove(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos, 12);
        if(easyMove && closemove[0] == 1){
          console.log("close move overwrited!");
          PreyXMove = closemove[1];
          PreyYMove = closemove[2];
        }
      }
      if(gameMode == "CvH"){
        if(leftpress) PreyXMove = -1;
        if(rightpress) PreyXMove = 1;
        if(uppress) PreyYMove = -1;
        if(downpress) PreyYMove = 1;
        var hunterAction = HunterAction(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos, Game.WallTimer, Game.walls, wallNum);
        console.log(hunterAction);
        wallAction = hunterAction[0];
        wallDelete = hunterAction[1];

        var closemove = PreyCloseMove(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos, 12);
        if(easyMove && closemove[0] == 1){
          console.log("close move overwrited!");
          PreyXMove = closemove[1];
          PreyYMove = closemove[2];
        }
      }
      if(gameMode == "HvC"){
        var move = PreyMove(true, hunterXPos, hunterYPos, preyXPos, preyYPos);
        PreyXMove = move[0];
        PreyYMove = move[1];
        var closemove = PreyCloseMove(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos, 12);
        if(closemove[0] == 1){
          console.log("close move overwrited!");
          PreyXMove = closemove[1];
          PreyYMove = closemove[2];
        }
      }
      
      var gameEnd = Game.tick(wallAction, wallDelete, PreyXMove, PreyYMove);
      wallAction = -1;
      wallDelete = -1;
      console.log(Game.state());
      //clear board
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 303, 303);

      ctx.translate(0.5, 0.5);

      ctx.lineCap = "square";

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(301, 0);
      ctx.lineTo(301, 301);
      ctx.lineTo(0, 301);
      ctx.lineTo(0, 0);
      ctx.stroke();

      //draw hunter
      ctx.fillStyle = "red";
      ctx.fillRect(Game.hunterPos.x, Game.hunterPos.y, 3, 3);
      //draw prey
      ctx.fillStyle = "green";
      ctx.fillRect(Game.preyPos.x, Game.preyPos.y, 3, 3);
      //draw wall
      for(w in Game.walls){
        var wall = Game.walls[w];
        if(wall.type == 0){
          ctx.strokeStyle = color[w];
          ctx.beginPath();
          ctx.moveTo(wall.x1, wall.y);
          ctx.lineTo(wall.x2, wall.y);
          ctx.stroke();
        }
        else if(wall.type == 1){
          ctx.strokeStyle = color[w];
          ctx.beginPath();
          ctx.moveTo(wall.x, wall.y1);
          ctx.lineTo(wall.x, wall.y2);
          ctx.stroke();
        }
      }
      ctx.translate(-0.5, -0.5);
      if(gameEnd) gameEnd = "end";
      $("#gameEnd").val(gameEnd);
    }else{
      $("#gameScore").val(Game.ticknum);
      clearInterval(drawInterval);
    }
  }, 1000/60);

  console.log("End!");

}

var drawCanvas = function(ctx, text){
  var text = text.split(" ");
  var data = text.map(function (string) {
    return parseInt(string)
  });

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 303, 303);

  ctx.translate(0.5, 0.5);

  ctx.lineCap = "square";

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(301, 0);
  ctx.lineTo(301, 301);
  ctx.lineTo(0, 301);
  ctx.lineTo(0, 0);
  ctx.stroke();

  ctx.fillStyle = "red";
  ctx.fillRect(data[0] + 1, data[1] + 1, 1, 1);

  ctx.fillStyle = "green";
  ctx.fillRect(data[2] + 1, data[3] + 1, 1, 1);

  for (var i = 0; i < data[4]; i++) {
    var type = data[5 + i * 4];
    if (type == 0) {
      var y = data[5 + i * 4 + 1] + 1;
      var x0 = data[5 + i * 4 + 2] + 1;
      var x1 = data[5 + i * 4 + 3] + 1;

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
    } else if (type == 1) {
      var x = data[5 + i * 4 + 1] + 1;
      var y0 = data[5 + i * 4 + 2] + 1;
      var y1 = data[5 + i * 4 + 3] + 1;

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, y1);
      ctx.stroke();
    }
  }

  ctx.translate(-0.5, -0.5);
}

var appendText = function(text){
  $('#textArea').val($('#textArea').val() + "\n" + text);
  $('#textArea').scrollTop($('#textArea')[0].scrollHeight);
}

var wallClicked = function(id){
  console.log("clicked!", id);
  wallDelete = id;
}

var save = function() {
  if ($('#gameScore').val() != -1) {
      $.get('../../../dbman/saveScore.php', {gamename:'Evasion', playername:'H/P', score:$('#gameScore').val()});
      appendText("score saved");
  }
};

