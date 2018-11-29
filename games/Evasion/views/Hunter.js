var addWall = function(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos) {
	
	if(hunterXVel == 0)
		return 0;
	var xDis = hunterXPos - preyXPos; // +: right, -: left
	if(xDis * hunterXVel >= 0)
		return 0;
	if(Math.abs(xDis) >= 2 && Math.abs(xDis) <= 4)
		return 2;
	if(hunterYVel == 0)
		return 0;
	var yDis = hunterYPos - preyYPos; //+: under, -: above
	if(yDis * hunterYVel >= 0)
		return 0;
	if(Math.abs(yDis) >= 2 && Math.abs(yDis) <= 4)
		return 1;
	return 0;
}


var removeWall = function(hunterXPos, hunterYPos, walls) {
	var num_left = 0;
	var num_right = 0;

	for(w in walls){
		var wall = walls[w];
		if(wall.type == 1)  {
			if(wall.x - hunterXPos > 0)
				num_right = num_right + 1;
			
			if(wall.x - hunterXPos < 0)
				num_left = num_left + 1;
		}
	}
	console.log(num_left, num_right);
	if(num_left > 1) {
		var max = 0;
		var toDelete = 0;
		for(w in walls){
			var wall = walls[w];
				if(wall.type == 1)  {
					var dist1 = wall.x - hunterXPos;
					if(dist1 < 0 && Math.abs(dist1) > max) {
						max = Math.abs(dist1);
						toDelete = w;
					}
				}
		}
		return toDelete;
	} else if(num_right > 1) {
		var max = 0;
		var toDelete = 0;
		for(w in walls){
			var wall = walls[w];
				if(wall.type == 1)  {
					var dist1 = wall.x - hunterXPos;
					if(dist1 > 0 && Math.abs(dist1) > max) {
						max = Math.abs(dist1);
						toDelete = w;
					}
				}
		}
		return toDelete;
	}

	return -1;
}

var removeHWall = function(hunterXPos, hunterYPos, walls) {
	var num_left = 0;
	var num_right = 0;

	for(w in walls){
		var wall = walls[w];
		if(wall.type == 0)  {
			if(wall.y - hunterYPos > 0)
				num_right++; 
			
			if(wall.y - hunterYPos < 0)
				num_left++; 
		}
	}
	console.log(num_left, num_right);
	if(num_left > 1) {
		var max = 0;
		var toDelete = 0;
		for(w in walls){
			var wall = walls[w];
				if(wall.type == 0)  {
					var dist1 = wall.y - hunterYPos;
					if(dist1 < 0 && Math.abs(dist1) > max) {
						max = Math.abs(dist1);
						toDelete = w;
					}
				}
		}
		return toDelete;
	} else if(num_right > 1) {
		var max = 0;
		var toDelete = 0;
		for(w in walls){
			var wall = walls[w];
				if(wall.type == 0)  {
					var dist1 = wall.y - hunterYPos;
					if(dist1 > 0 && Math.abs(dist1) > max) {
						max = Math.abs(dist1);
						toDelete = w;
					}
				}
		}
		return toDelete;
	}
	return -1;
}



var HunterAction = function(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos, currentWallTimer, walls, maxWalls){
	if(currentWallTimer > 0) {
		addWallType = 0;
		toDeleteWallIndex = removeWall(hunterXPos, hunterYPos, walls);
		
		if(toDeleteWallIndex <= 0)
			toDeleteWallIndex = removeHWall(hunterXPos, hunterYPos, walls);
	} 
	else {
		addWallType = addWall(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos);
		// if(addWallType == 1)
		// 	walls[10] = new HorizantalWall(hunterYPos, 0, 300, 10);
		// else if (addWallType == 2)
		// 	walls[10] = new VerticalWall(hunterXPos, 0, 300, 10);
		toDeleteWallIndex = removeWall(hunterXPos, hunterYPos, walls);
		
		if(toDeleteWallIndex <= 0)
			toDeleteWallIndex = removeHWall(hunterXPos, hunterYPos, walls);

	}
	return [addWallType - 1, toDeleteWallIndex]
}

