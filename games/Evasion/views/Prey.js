
var PreyMove = function(phase, hunterXPos, hunterYPos, preyXPos, preyYPos){
	var xpos;
	var ypos;
	if(!phase){
		xpos = -1;
		ypos = -1;
	}
	else{
		if(preyXPos > hunterXPos)
			xpos = -1;
		else 
			xpos = 1;
		if(preyYPos > hunterYPos) 
			ypos = -1;
		else 
			ypos = 1;
	}
	return [xpos, ypos];
}

var PreyCloseMove = function(hunterXPos, hunterYPos, hunterXVel, hunterYVel, preyXPos, preyYPos, CloseMove){
	if(dis4(preyXPos, preyYPos, hunterXPos, hunterYPos) < CloseMove){
		if(hunterXVel == 1 && hunterYVel == -1){
			if(preyXPos > hunterXPos && preyYPos < hunterYPos){
				if(Math.abs(preyXPos - hunterXPos) < Math.abs(hunterYPos - preyYPos)){
					xpos = -1;
					ypos = -1;
				}
				else{
					xpos = 1;
					ypos = 1;
				}
			}
			else{
				xpos = -1;
				ypos = 1;
			}
		}
		else if(hunterXVel == 1 && hunterYVel == 1){
			if(preyXPos > hunterXPos && preyYPos > hunterYPos){
				if(Math.abs(preyXPos - hunterXPos) < Math.abs(hunterYPos - preyYPos)){
					xpos = -1;
					ypos = 1;
				}
				else{
					xpos = 1;
					ypos = -1;
				}
			}
			else{
				xpos = -1;
				ypos = -1;
			}
		}
		else if(hunterXVel == -1 && hunterYVel == 1){
			if(preyXPos < hunterXPos && preyYPos > hunterYPos){
				if(Math.abs(preyXPos - hunterXPos) > Math.abs(hunterYPos - preyYPos)){
					xpos = -1;
					ypos = -1;
				}
				else{
					xpos = 1;
					ypos = 1;
				}
			}
			else{
				xpos = 1;
				ypos = -1;
			}
		}
		else if(hunterXVel == -1 && hunterYVel == -1){
			if(preyXPos < hunterXPos && preyYPos < hunterYPos){
				if(Math.abs(preyXPos - hunterXPos) > Math.abs(hunterYPos - preyYPos)){
					xpos = -1;
					ypos = 1;
				}
				else{
					xpos = 1;
					ypos = -1;
				}
			}
			else{
				xpos = 1;
				ypos = 1;
			}
		}
		return [1, xpos, ypos];
	}
	else{
		return [0];
	}
}

var dis4 = function(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}