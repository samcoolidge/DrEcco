function HorizantalWall(y, x1, x2, id){
	this.id = id;
	this.type = 0;
	this.y = parseInt(y);
	this.x1 = parseInt(x1);
	this.x2 = parseInt(x2);
	this.occupies = function(p){
		return p.y == this.y && p.x >= this.x1 && p.x <= this.x2;
	}
	this.toString = function(){
		return "Horizantal Wall at " + y + " from " + x1 + " to " + x2;
	}
	this.nw = false;//for hunter use
} 

function VerticalWall(x, y1, y2, id){
	this.id = id;
	this.type = 1;
	this.x = parseInt(x);
	this.y1 = parseInt(y1);
	this.y2 = parseInt(y2);
	this.occupies = function(p){
		return p.x == this.x && p.y >= this.y1 && p.y <= this.y2;
	}
	this.toString = function(){
    	return "Vertical Wall at " + x + " from " + y1 + " to " + y2;
    }
    this.nw = false;//for hunter use
} 

function Point(x, y){
	this.x = parseInt(x);
	this.y = parseInt(y);

	this.equals = function(p){
		return this.x == p.x && this.y == p.y;
	}
}

function game(wallNum, wallCoolDown, isCom){
	this.ticknum = 0;
	this.maxWalls = parseInt(wallNum);
	this.wallPlacementDelay = parseInt(wallCoolDown);
	this.wallTimer = 0;
	this.hunterPos = new Point(0, 0);
	this.prevhunterPos = new Point(0, 0);
	this.hunterXVel = 1;
	this.hunterYVel = 1;
	this.preyPos = new Point(230, 200);
	this.preyXVel = 0;
	this.preyYVel = 0;
	this.walls = {};
	this.isCom = isCom;
	this.state = function(){
		var s =  "ticknum = " + this.ticknum 
				+ ", wallTimer = " + this.wallTimer
				+ ", hunterPos = " + this.hunterPos.x + ", " + this.hunterPos.y
				+ ", hunterXVel = " + this.hunterXVel
				+ ", hunterYVel = " + this.hunterYVel
				+ "\npreyPos = " + this.preyPos.x + ", " + this.preyPos.y
				+ ", preyXVel = " + this.preyXVel
				+ ", preyYVel = " + this.preyYVel
				+ "\nwalls:" ;
		for(w in this.walls){
			s = s + "\n\t" + this.walls[w].toString();
		
		}
		return s;
	}

	this.isOccupied = function(p) {
	    if(p.x < 0 || p.x >= 300 || p.y < 0 || p.y >= 300){
	      return true;
	    }
	    for(wall in this.walls){
		    if(this.walls[wall].occupies(p)){
		        return true;
		    }
	    }
	    return false;
	}

	this.addWall = function(wall){
	    if(this.wallTimer <= 0){
	    	for(var i = 1; i <= this.maxWalls; i++){
	    		if(!(i in this.walls)){
	    			wall.id = i;
	    			this.walls[i] = wall;
	    			this.wallTimer = this.wallPlacementDelay;
	    			appendText("Add a " + wall.toString());
	    			appendWall(i);
	    			return true;
	    		}
	    	}
	    	if(!this.isCom) appendText("Max Wall Reached Please Deleted a Wall");
	    }
	    else{
	    	if(!this.isCom) appendText("Too Soon to Build Another Wall! Pls wait " + this.wallTimer);
	    }
    	return false;
	}

	this.removeWall = function(i){
		var tmpwalls = {};
		for(w in this.walls){
			if(w != i) tmpwalls[w] = this.walls[w];
			if(w == i){
				$("#wall_" + i).remove();
				appendText("Deleted Wall id " + w);
			}
		}
		this.walls = tmpwalls;
	}

	this.buildWall = function(type){
		if(type == 0){//horizontal
			var greater = new Point(this.prevhunterPos.x, this.prevhunterPos.y);
			var lesser = new Point(this.prevhunterPos.x, this.prevhunterPos.y);
			while(!this.isOccupied(greater)){
				if(greater.equals(this.hunterPos) || greater.equals(this.preyPos))
					return false
				greater.x++;
			}
			while(!this.isOccupied(lesser)){
				if(lesser.equals(this.hunterPos) || lesser.equals(this.preyPos))
					return false
				lesser.x--;
			}
			return this.addWall(new HorizantalWall(this.hunterPos.y, lesser.x + 1, greater.x - 1));
		}
		if(type == 1){//vertical
			var greater = new Point(this.prevhunterPos.x, this.prevhunterPos.y);
			var lesser = new Point(this.prevhunterPos.x, this.prevhunterPos.y);
			while(!this.isOccupied(greater)){
				if(greater.equals(this.hunterPos) || greater.equals(this.preyPos))
					return false
				greater.y++;
			}
			while(!this.isOccupied(lesser)){
				if(lesser.equals(this.hunterPos) || lesser.equals(this.preyPos))
					return false
				lesser.y--;
			}
			return this.addWall(new VerticalWall(this.hunterPos.x, lesser.y + 1, greater.y - 1));
		}
		return false;
	}

	this.canPreyMove = function(){
	    return (this.ticknum % 2) != 0;
	}

	this.captured = function(){
		if(dis(this.hunterPos, this.preyPos) < 4.0){
			var points = pointsBetween(this.hunterPos, this.preyPos);
			for(pt in points){
			    if(this.isOccupied(pt)){
			        return false;
			    }
		    }
		    appendText("Captured!!\nGame End!\nTime: "+this.ticknum);
		    return true;
		}
		return false;
	}

	this.move = function(){
		var tmpXVel = this.hunterXVel;
		var tmpYVel = this.hunterYVel;

	    var target = pointadd(this.hunterPos, tmpXVel, tmpYVel);
	    if(!this.isOccupied(target)){
			this.hunterPos = target;
	    } 
	    else {
	    	if(tmpXVel == 0 || tmpYVel == 0){
	    		if(tmpXVel == 0)
	    			this.hunterYVel = -tmpYVel;
	    		else
	    			this.hunterXVel = -tmpXVel;
	    	}
	    	else{
	    		var oneRight = this.isOccupied(pointadd(this.hunterPos, tmpXVel, 0));
	    		var oneUp = this.isOccupied(pointadd(this.hunterPos, 0, tmpYVel));
	    		if(oneRight && oneUp){
	    			this.hunterXVel = -tmpXVel;
	    			this.hunterYVel = -tmpYVel;
	    		}
	    		else if(oneRight){
	    			this.hunterXVel = -tmpXVel;
	    			this.hunterPos.y = target.y;
	    		}
	    		else if(oneUp){
	    			this.hunterYVel = -tmpYVel;
	    			this.hunterPos.x = target.x;
	    		}
	    		else{
	    			var twoUpOneRight = this.isOccupied(pointadd(this.hunterPos, tmpXVel, tmpYVel * 2));
	    			var oneUpTwoRight = this.isOccupied(pointadd(this.hunterPos, tmpXVel * 2, tmpYVel));
	    			if((twoUpOneRight && oneUpTwoRight) || (!twoUpOneRight && ! oneUpTwoRight)){
	    				this.hunterXVel = -tmpXVel;
	    				this.hunterYVel = -tmpYVel;
	    			}
	    			else if(twoUpOneRight){
	    				this.hunterXVel = -tmpXVel;
	    				this.hunterPos.y = target.y;
	    			}
	    			else{
	    				this.hunterYVel = -tmpYVel;
	    				this.hunterPos.x = target.x;
	    			}
	    		}
	    	}
    	}
    }

    this.tick = function(wallAction, wallDetele, preyXMove, preyYMove){
    	console.log("wallAction = " , wallAction, "wallDetele = " , wallDetele, "preyXMove = " , preyXMove, "preyYMove = " , preyYMove);
    	this.removeWall(wallDetele);
    	this.prevhunterPos = new Point(this.hunterPos.x, this.hunterPos.y);
    	this.move();
    	this.buildWall(wallAction);
    	if(this.canPreyMove()){
    		this.preyXVel = preyXMove;
    		this.preyYVel = preyYMove;
    		// console.log("isOccupied = ", this.isOccupied(this.preyPos.x + preyXMove, this.preyPos.y + preyYMove));
    		if(!this.isOccupied(new Point(this.preyPos.x + preyXMove, this.preyPos.y + preyYMove))){
    			this.preyPos = new Point(this.preyPos.x + preyXMove, this.preyPos.y + preyYMove);
    		}
    	}
    	this.ticknum++;
    	if(this.wallTimer > 0) this.wallTimer = this.wallTimer - 1;
    	return this.captured();
    }
}

var pointadd = function(p, dx, dy){
	return new Point(p.x + dx, p.y + dy);
}

var dis = function(p1, p2){
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

var pointsBetween = function(p0, p1){

	var x0 = p0.x;
	var x1 = p1.x;
	var y0 = p0.y;
	var y1 = p1.y;

	var points = [];

	var steep = Math.abs(y1-y0) > Math.abs(x1-x0);

	if(steep){
		var tx0 = x0;
		x0 = y0;
		y0 = tx0;

		var tx1 = x1;
		x1 = y1;
		y1 = tx1;
	}
	if(x0 > x1){
		var tx0 = x0;
		x0 = x1;
		x1 = tx0;

		var ty0 = y0;
		y0 = y1;
		y1 = ty0;
	}

	var deltax = x1-x0;
	var deltay = Math.abs(y1-y0);
	var error = deltax / 2;
	var y = y0;
	var ystep;
	if(y0 < y1){
		ystep = 1;
	} else {
		ystep = -1;
	}

	for(var x = x0; x <= x1; x++){
		if(steep){
			points.push(new Point(y,x));
		} else {
			points.push(new Point(x,y));
		}
		error -= deltay;
		if(error < 0){
			y += ystep;
			error += deltax;
		}
	}
	return points;
}

var appendWall = function(id){
	$("#wallArea").append('<li class="list-group-item" onclick="wallClicked(' + id + ')" id = "wall_' + id + 
		'" style="background-color:' + color[id]
		+ '; font-weight:bold; font-size:1.5em">' + id + '</li>');
}

// var saveScore = function(){
//     // if($("#gameEnd").val() != "end")
//     var pName = $("#saveName").val == "" ? pName : $("#saveName").val;
//     score = $("#gameScore").val;
//     alert(pName + score);
//     $.get("../../dbman/saveScore.php", {
//         gamename: Evasion,
//         playername: pName,
//         score: score
//     }).done(function(){
//         alert("Save score successed!");
//     }).fail(function(){
//         alert("Save score failed!");
//     });
// }


// var Game = new game(5, 2);
// // console.log(Game.addWall(new VerticalWall(3, 0, 300)));

// for(var i = 0; i < 5; i++){
// 	console.log(Game.wallTimer);
// 	console.log(Game.buildWall(1));
// 	console.log(Game.move());
// 	console.log(Game.hunterPos);
// 	console.log(Game.hunterPos);
// 	Game.wallTimer = Game.wallTimer - 1;
// 	// console.log(Game.captured());
// }

// console.log(Game.walls);
// console.log(Game.state());

// console.log(Game.isOccupied(new Point(100 ,5)));
// console.log(Game.isOccupied(new Point(99 ,5)));
// console.log(pointsBetween(new Point(0,0), new Point(3, 3)));



