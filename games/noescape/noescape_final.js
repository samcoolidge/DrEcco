//eliminate scroll using arrows. found here
//http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
window.addEventListener("keydown", function(e) {
	// space and arrow keys
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}, false);
var call_keydown;
var w_locations = play_game(3,5);
console.log(w_locations);
$('.diff').click(function(){
	$('#state .result').text("Playing.");
	$('#savescore').css("display","none");
	window.removeEventListener("keydown",call_keydown,false);
	var level = parseInt($(this).text());
	if (level == 5){
		$("#warning").css("opacity","1");

	}
	else{
		$("#warning").css("opacity","0");
	}
	w_locations = play_game(level,5);
});
$("#submitscore").click(function(){
	var scr = $('#formscore').attr("value");
	var plname = $('#playername').attr("value");
	var gname = $('#gamename').attr("value");
	console.log("saving",scr,plname,gname);
	$.get( "dbman/saveScore.php",{
		gamename: "No Escape", playername: plname, score: scr
	},
	function(){
	}
	).done(function() 
	{
		console.log("Success saving");
	}).fail(function() {
		console.log("Score save error");
	});
})
$('#restart').click(function(){
	$('#state .result').text("Playing.");
	$('#savescore').css("display","none");
	window.removeEventListener("keydown",call_keydown,false);
	restart_last_game(5,w_locations);
});
$('#savescore').click(function(){
	var curscore = $('#score .result').text();
	$('#formscore').attr("value",curscore);
	$('#popup').css("display","block");
	$('#popup').animate({
		opacity:1,
	},1000,function(){
		//animation complete
	});
});
$('#popup #exiter').click(function(){
	$('#popup').animate({
		opacity:0,
	},1000,function(){
		//animation complete
		$('#formscore').attr("value",0);
		$('#popup').css("display","none");
	});
});

//get all relevant variables from the canvas
function restart_last_game(phase_number,wall_locations){
	var canvas = document.getElementById("game");
	var w = canvas.offsetWidth;
	var h = canvas.offsetHeight;
	var player_size = 7;
	var start_x = Math.floor((w/player_size)/2) * player_size;
	var start_y = Math.floor((h/player_size)/2) * player_size;
	//initialize player information
	var player = {
		x: 				start_x,
		y: 				start_y,
		pixel_size: 	player_size,
		score: 			-1,
		init_phases: 	phase_number,
		phases: 		phase_number,
		max: 			w
	}
	//get the context of the canvas
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,w,h); //make sure canvas is empty
	//store legal vertical coordinates
	var legal_heights = [];
	var i = 0;
	while(i < h){
		legal_heights.push(i);
		i += player.pixel_size;
	}
	//store legal horizontal coordinates
	var legal_widths = [];
	var i = 0;
	while(i < w){
		legal_widths.push(i);
		i += player.pixel_size;
	}
	//initialize function for keydown so game can be played
	call_keydown = function(event){keyDown(event,ctx,player,wall_locations);}
	//connect the function to pressing a key in the window
	window.addEventListener("keydown",call_keydown,false);
	//set the color for the walls to a dark gray
	ctx.fillStyle = "#111";
	arrayToWallNoShift(wall_locations,ctx,player.pixel_size);

	ctx.fillStyle = "white";
	makePerimeterWhite(ctx,player.pixel_size,w,h);
	//make sure walls will be dark gray when finalizing them
	ctx.fillStyle = "#111";
	//place the player in the center and make the player red
	ctx.fillStyle = "red";
	
	makeMove(ctx,player,player.max,0,0,wall_locations);
}
function play_game(difficulty,phase_number){
	var canvas = document.getElementById("game");
	var w = canvas.offsetWidth;
	var h = canvas.offsetHeight;
	var player_size = 7;
	difficulty += 1;
	var start_x = Math.floor((w/player_size)/2) * player_size;
	var start_y = Math.floor((h/player_size)/2) * player_size;
	//initialize player information
	var player = {
		x: 				start_x,
		y: 				start_y,
		pixel_size: 	player_size,
		score: 			-1,
		init_phases: 	phase_number,
		phases: 		phase_number,
		max: 			w
	}
	//get the context of the canvas
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,w,h); //make sure canvas is empty
	//store legal vertical coordinates
	var legal_heights = [];
	var i = 0;
	while(i < h){
		legal_heights.push(i);
		i += player.pixel_size;
	}
	//store legal horizontal coordinates
	var legal_widths = [];
	var i = 0;
	while(i < w){
		legal_widths.push(i);
		i += player.pixel_size;
	}
	//initialize function for keydown so game can be played
	var wall_locations = []; //initialize storage of wall locations
	call_keydown = function(event){keyDown(event,ctx,player,wall_locations);}
	//connect the function to pressing a key in the window
	window.addEventListener("keydown",call_keydown,false);
	//set the color for the walls to a dark gray
	ctx.fillStyle = "#111";
	
	//generate a random maze 
	mazeArr = newMaze(Math.floor((w/player.pixel_size)/3) + 1,Math.floor((h/player.pixel_size)/3) + 1,player);
	//convert the generated maze into walls in the canvas
	console.log(wall_locations.length);
	arrayToWall(mazeArr,ctx,player.pixel_size,legal_widths,legal_heights,player,wall_locations);
	//close extra openings
	//quickClose(wall_locations,player.pixel_size,player,0.75);
	console.log(wall_locations.length);
	for (var i = 0; i < difficulty; i++){
		console.log(wall_locations.length);
		quickClose(wall_locations,player.pixel_size,player,0.9);
	}
	//clear and recreate canvas
	ctx.clearRect(0,0,w,h);
	console.log(wall_locations.length);
	arrayToWallNoShift(wall_locations,ctx,player.pixel_size);
	console.log(wall_locations.length);
	//close the maze so there is no escape
	console.log(wall_locations.length);
	makePerimeterWalls(ctx,player.pixel_size,w,h,wall_locations);
	console.log(wall_locations.length);
	//make sure outer part of canvas is white
	ctx.fillStyle = "white";
	makePerimeterWhite(ctx,player.pixel_size,w,h);
	//make sure walls will be dark gray when finalizing them
	ctx.fillStyle = "#111";
	//place the player in the center and make the player red
	ctx.fillStyle = "red";
	
	makeMove(ctx,player,player.max,0,0,wall_locations);
	return wall_locations;
}

//function that closes open paths in the maze at a random threshold
function quickClose(wall_locations,wall_width,player,random_threshold){
	var hold = [];
	console.log("test");
	for (var i = 0; i<wall_locations.length; i++){
		var jump_flag = Math.random(); //flag to ignore random locations
		if (jump_flag < random_threshold){
			continue;
		}
		var curloc = wall_locations[i];
		var x_loc = curloc[0];
		var y_loc = curloc[1];
		var left = [x_loc - wall_width,y_loc];
		var doubleleft = [x_loc - 2 * wall_width,y_loc];
		var top = [x_loc,y_loc - wall_width];
		var doubletop = [x_loc,y_loc - 2*wall_width];
		var right = [x_loc + wall_width,y_loc];
		var doubleright = [x_loc + 2*wall_width,y_loc];
		var bottom = [x_loc,y_loc + wall_width];
		var doublebottom = [x_loc,y_loc + 2*wall_width];
		if (checkIn(doubleleft,wall_locations) >= 0 && checkIn(left,wall_locations) < 0){
			hold.push(left);
		}
		if (checkIn(doubleright,wall_locations) >= 0 && checkIn(right,wall_locations) < 0){
			hold.push(right);
		}
		if (checkIn(doubletop,wall_locations) >= 0 && checkIn(top,wall_locations) < 0){
			hold.push(top);
		}
		if (checkIn(doublebottom,wall_locations) >= 0 && checkIn(bottom,wall_locations) < 0){
			hold.push(bottom);
		}
	}
	for (var i = 0; i<hold.length; i++){
		x = hold[i][0];
		y = hold[i][1];
		if (x == 0 || x == player.max - wall_width || y == 0 || y == player.max - wall_width){
			continue; //don't add values that are 
		}
		if ((x - wall_width * 2 == player.x && y - wall_width * 2 == player.y) ||
			(x - wall_width * 3 == player.x && y - wall_width * 2 == player.y) ||
			(x - wall_width * 3 == player.x && y - wall_width * 3 == player.y) ||
			(x - wall_width * 2 == player.x && y - wall_width * 3 == player.y) ||
			(x - wall_width * 1 == player.x && y - wall_width * 2 == player.y) ||
			(x - wall_width * 2 == player.x && y - wall_width * 1 == player.y) ||
			(x - wall_width * 1 == player.x && y - wall_width * 1 == player.y) ||
			(x - wall_width * 1 == player.x && y - wall_width * 3 == player.y) ||
			(x - wall_width * 3 == player.x && y - wall_width * 1 == player.y) 
			)
		{
			continue; //make sure not surrounding starting point
		}
		wall_locations.push(hold[i]);
	}
}

function makePerimeterWhite(ctx,wall_width,w,h){
	var i;
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,wall_width,h);
	i = 0
	while(i < h){
		i += wall_width
	}
	ctx.fillRect(0,0,w,wall_width);
	i = 0
	while(i < w){
		i += wall_width
	}
	ctx.fillRect(w-wall_width,0,wall_width,h);
	i = 0
	while(i < h){
		i += wall_width
	}
	ctx.fillRect(0,h-wall_width,w,wall_width);
	i = 0
	while(i < w){
		i += wall_width
	}
	ctx.fillStyle = "333";
}

//function that checks if a 2-element array is inside another array
//used to check if player is trying to move on top of a wall
function checkIn(item,array){
	for(var i = 0; i < array.length; i++) {
		if(array[i][0] == item[0] && array[i][1] == item[1]){
			return i;
		}
		}
		return -1;
}

//function that determines score, whether game is over, and new locations.
function makeMove(ctx,player,max,x_vec,y_vec,wall_locations){
	if(player.phases < 0){ //if player is out of moves they lose. Disconnect the keyboard functions
		window.removeEventListener("keydown",call_keydown,false);
		$('#state .result').text("Over. Used too many phases. You lose!");
		$('#score .result').text("Loser");
		ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
	}else if ( //if the player escapes, set the score and disconnect keyboard functions as game is over
		player.x <= 0 || 
		player.x >= player.max - player.pixel_size||
		player.y <= 0 ||
		player.y >= player.max - player.pixel_size
	){
		window.removeEventListener("keydown",call_keydown,false);
		$('#state .result').text("Over. You win!");
		$('#savescore').css("display","inline");
		$('#score .result').text(player.score);
		ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
	}else{ 
		if (checkIn([player.x,player.y],wall_locations) >= 0){ //if they try and move to a wall
			player.phases -= 1; //phase through
			if(player.phases < 0){ //if they are out of phases, they lose. disconnect keyboard functions.
				window.removeEventListener("keydown",call_keydown,false);
				$('#state .result').text("Over. Used too many phases. You lose!");
				$('#score .result').text("Loser");
				ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
			}
			player.x += x_vec * player.pixel_size; //jump over wall
			player.y += y_vec * player.pixel_size; //jump over wall
			if (checkIn([player.x,player.y],wall_locations) >= 0){ //if jumped location is a wall, then instead don't move
				player.phases += 1;
				player.x -= 2 * x_vec * player.pixel_size; //move back to original location
				player.y -= 2 * y_vec * player.pixel_size; //move back to original location
				player.score -= 1 + (player.init_phases - player.phases)/4;;
			}
			if ( 
				player.x <= 0 || 
				player.x >= player.max - player.pixel_size||
				player.y <= 0 ||
				player.y >= player.max - player.pixel_size
			){ //if they jumped into the winning position. They win and return score and disconnect keyboard functions
				player.score += 1 + (player.init_phases - player.phases)/4;
				window.removeEventListener("keydown",call_keydown,false);
				$('#state .result').text("Over. You win!");
				$('#savescore').css("display","inline");
				$('#score .result').text(player.score);
				$('#phases .result').text(player.init_phases - player.phases);
				ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
			}else if(player.phases == 0){ //if now they run out of phases, they lose. disconnect keyboard functions
				player.score += 1 + (player.init_phases - player.phases)/4;
				window.removeEventListener("keydown",call_keydown,false);
				$('#state .result').text("Over. You can no longer escape. You lose!");
				$('#score .result').text("Loser");
				$('#phases .result').text(player.init_phases - player.phases);
				ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
			}
			else{ //now they jumped over into a normal location and we just update the score
				ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
				//ctx.strokeRect(player.x + 1,player.y + 1,player.pixel_size - 2,player.pixel_size - 2);
				player.score += 1 + (player.init_phases - player.phases)/4;
				$('#score .result').text(player.score);
				$('#phases .result').text(player.init_phases - player.phases);
			}
		}
		else{//they made a normal move
			if (player.phases == 0){//check if they are out of phases and hence cannot escape ever. They lose, and disconnect keyboard functions
				player.score += 1 + (player.init_phases - player.phases)/4;
				window.removeEventListener("keydown",call_keydown,false);
				$('#state .result').text("Over. You can no longer escape. You lose!");
				$('#score .result').text("Loser");
				$('#phases .result').text(player.init_phases - player.phases);
				ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
			}
			else{//they can still play the game, so update score and let everything go normally
				ctx.fillRect(player.x,player.y,player.pixel_size,player.pixel_size);
				player.score += 1 + (player.init_phases - player.phases)/4;
				$('#score .result').text(player.score);
				$('#phases .result').text(player.init_phases - player.phases);
			}
		}
	}
}

//function that makes walls around the perimeter of the maze so there is no escape
function makePerimeterWalls(ctx,wall_width,w,h,wall_locations){
	var i;
	ctx.fillRect(wall_width,wall_width,wall_width,h-wall_width);
	i = wall_width
	while(i < h){
		wall_locations.push([wall_width,i-wall_width]);
		i += wall_width
	}
	ctx.fillRect(wall_width,wall_width,w-wall_width*2,wall_width);
	i = wall_width
	while(i < w){
		wall_locations.push([i+wall_width,wall_width]);
		i += wall_width
	}
	ctx.fillRect(w-wall_width * 2,wall_width,wall_width,h-wall_width);
	i = wall_width
	while(i < h){
		wall_locations.push([w-wall_width*2,i + wall_width]);
		i += wall_width
	}
	ctx.fillRect(wall_width,h-wall_width*2,w-wall_width,wall_width);
	i = wall_width
	while(i < w){
		wall_locations.push([i,h-wall_width*2]);
		i += wall_width
	}
}
//function that takes a binary array with wall positions as 1 and fills in the canvas
function arrayToWall(array,ctx,wall_width,lw,lh,player,wall_locations){
	for(var i = 0; i < array.length; i++){
		var row = array[i];
		for(var j = 0; j < row.length; j++){
			var col = row[j];
			if (col == 1){
				var x = lw[i];
				var y = lh[j];
				//make sure initial position is not surrounded by walls
				if ((x - wall_width * 2 == player.x && y - wall_width * 2 == player.y) ||
					(x - wall_width * 3 == player.x && y - wall_width * 2 == player.y) ||
					(x - wall_width * 3 == player.x && y - wall_width * 3 == player.y) ||
					(x - wall_width * 2 == player.x && y - wall_width * 3 == player.y) ||
					(x - wall_width * 1 == player.x && y - wall_width * 2 == player.y) ||
					(x - wall_width * 2 == player.x && y - wall_width * 1 == player.y) ||
					(x - wall_width * 1 == player.x && y - wall_width * 1 == player.y) ||
					(x - wall_width * 1 == player.x && y - wall_width * 3 == player.y) ||
					(x - wall_width * 3 == player.x && y - wall_width * 1 == player.y) 
					)
				{
					continue;
				}
				//note that for some debugging reason, we had to shift the walls
				ctx.fillRect(x-wall_width * 2,y-wall_width*2,wall_width,wall_width);
				wall_locations.push([x-wall_width * 2,y-wall_width*2]);
			}
		}
	}
}
//function that takes a binary array and converts it to pixel blocks on the canvas
function arrayToWallNoShift(array,ctx,wall_width){
	for(var i = 0; i < array.length; i++){
		var val = array[i];
		ctx.fillRect(val[0],val[1],wall_width,wall_width);
	}
}

//function that clears where the player was on the canvas
function clearCurrent(ctx,player){
	ctx.clearRect(player.x,player.y,player.pixel_size,player.pixel_size);
}

//function to bind arrow keys and WASD to proper movement
function keyDown(e,ctx,player,wall_locations){
	if (e.keyCode == 83 || e.keyCode == 40){ //up
		clearCurrent(ctx,player);
		player.y += player.pixel_size;
		makeMove(ctx,player,player.max,0,1,wall_locations);
	}
	if (e.keyCode == 87 || e.keyCode == 38){ //down
		clearCurrent(ctx,player);
		player.y -= player.pixel_size;
		makeMove(ctx,player,player.max,0,-1,wall_locations);
	}
	if (e.keyCode == 65 || e.keyCode == 37){ //left
		clearCurrent(ctx,player);
		player.x -= player.pixel_size;
		makeMove(ctx,player,player.max,-1,0,wall_locations);
	}
	if (e.keyCode == 68 || e.keyCode == 39){ //right
		clearCurrent(ctx,player);
		player.x += player.pixel_size;
		makeMove(ctx,player,player.max,1,0,wall_locations);
	}
}
//function modified from https://github.com/dstromberg2/maze-generator/blob/master/mazegenerator.js
function newMaze(x, y,player) {
	// Establish variables and starting grid
	var totalCells = x*y;
	var cells = new Array();
	var unvis = new Array();
	for (var i = 0; i < y; i++) {
		cells[i] = new Array();
		unvis[i] = new Array();
		for (var j = 0; j < x; j++) {
			cells[i][j] = [0,0,0,0];
			unvis[i][j] = true;
		}
	}
	
	// Set a random position to start from
	var currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
	var path = [currentCell];
	unvis[currentCell[0]][currentCell[1]] = false;
	var visited = 1;
	
	// Loop through all available cell positions
	while (visited < totalCells) {
		// Determine neighboring cells
		var pot = [[currentCell[0]-1, currentCell[1], 0, 2],
				[currentCell[0], currentCell[1]+1, 1, 3],
				[currentCell[0]+1, currentCell[1], 2, 0],
				[currentCell[0], currentCell[1]-1, 3, 1]];
		var neighbors = new Array();
		
		// Determine if each neighboring cell is in game grid, and whether it has already been checked
		for (var l = 0; l < 4; l++) {
			if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
		}
		
		// If at least one active neighboring cell has been found
		if (neighbors.length) {
			// Choose one of the neighbors at random
			next = neighbors[Math.floor(Math.random()*neighbors.length)];
			
			// Remove the wall between the current cell and the chosen neighboring cell
			cells[currentCell[0]][currentCell[1]][next[2]] = 1;
			cells[next[0]][next[1]][next[3]] = 1;
			
			// Mark the neighbor as visited, and set it as the current cell
			unvis[next[0]][next[1]] = false;
			visited++;
			currentCell = [next[0], next[1]];
			path.push(currentCell);
		}
		// Otherwise go back up a step and keep going
		else {
			currentCell = path.pop();
		}
	}
	var maze = [];
	//convert the borders to wall pixels
	console.log(cells);
	for (var i=0; i<cells.length * 3; i++){
		line = [];
		for (var j=0; j<cells[0].length * 3; j++){
			line.push(0);
		}
		maze.push(line);
	}
	for (var i=0; i<cells.length; i++){
		for (var j=0; j<cells[i].length; j++){
			if (i == 0 || i == cells.length - 1){
				cells[i][j] = 1;
			}
			else if (j == 0 || j == cells[i].length - 1){
				cells[i][j] = 1;
			}
			else{
				//convert the borders to wall pixels
				for (var item = 0; item<cells[i][j].length; item ++){
					var x_loc = i*3 + 2;
					var y_loc = j*3 + 2;
					if (cells[i][j][item] == 1){
						switch(item){
							case 0:
								maze[x_loc][y_loc-1] = 1;
								maze[x_loc-1][y_loc-1] = 1;
								break;
							case 1:
								maze[x_loc+1][y_loc] = 1;
								maze[x_loc+1][y_loc-1] = 1;
								break;
							case 2: 
								maze[x_loc][y_loc+1] = 1;
								maze[x_loc+1][y_loc+1] = 1;
								break;
							case 3:
								maze[x_loc-1][y_loc] = 1;
								maze[x_loc-1][y_loc+1] = 1;
								break;
							default:
								break;
						}
					}
				}
			}
		}

	}
	return maze;
}
 
	