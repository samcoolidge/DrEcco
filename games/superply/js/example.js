var table = 10;            // Unit of table
var operator = 'multiplication'; // Type of calculation
var i = 1;                 // Set counter to 1
var msg = '';       
var turnBlue=true;       // Message
var x = new Array(table);
for (var i = 0; i < table; i++) {
  x[i] = new Array(table);
  for (var j = 0; j < table; j++){
     x[i][j] = -1;
  }
}
var winnerIsBlue=false;
var resultIsgameOver=false;
var statusHint = false;
var currentHint = "";
var currentHintType = 0;
var value1=0, value2=0;

var modal1 = document.getElementById('myModal1');
var modal2 = document.getElementById('myModal2');
var modal3 = document.getElementById('myModal3');

var blueName = "";
var redName = "";
 
var grid = getNewGrid(); 

var rulesOpen = false;
var visited = new Array(table);
for (var i = 0; i < table; i++) {
   visited[i] = new Array(table);
   for (var j = 0; j < table; j++){
     visited[i][j] = 0;
   }
}

function getNewGrid() {

    var newgrid = clickableGrid(table,table,function(el,row,col,i){
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);
    statusHint = satisfiesHint(row-1,col-1);
    console.log("statusHint:",statusHint);
    
	if(turnBlue){
		if(statusHint){
		  el.className='blueclicked';
		  x[row-1][col-1]=0;
		  resultIsgameOver=isGameOver();
		  if(resultIsgameOver){
			winnerIsBlue=true;
			console.log("Game Over Blue Wins!");
			//hint.innerHTML= "Game Over Blue Wins!";
			modal2.style.display = "block";
			document.getElementById('playerWinner').innerHTML = blueName + " Wins!!"
			sendResults();
		  }
		  else {
		    currentHint = generateHint();
		    hint.innerHTML= currentHint;
		    console.log("currentHintType:",currentHintType);
            console.log("currentHint:",currentHint);
            console.log("value1:",value1); 
            console.log("value2:",value2);
          }  
		}  
		if(statusHint) {
		   document.getElementById("imageBlue").src="images/b1.png";
		}
		else {
		   document.getElementById("imageBlue").src="images/b2.png";
		}
		setTimeout(function(){changeBlue()},1000);
		hint.style.color = "#FF0000";
		turnBlue=false;
	}
	else{
		if(statusHint){
		  el.className='redclicked';
		  x[row-1][col-1]=1;
		  resultIsgameOver=isGameOver();
		  if(resultIsgameOver){
			winnerIsBlue=false;
			console.log("Game Over Red Wins!");
			//hint.innerHTML= "Game Over Red Wins!";
			modal2.style.display = "block";	
			document.getElementById('playerWinner').innerHTML = redName + " Wins!!"
			sendResults();
		  }
		  else {
		    currentHint = generateHint();
		    hint.innerHTML= currentHint;
		    console.log("currentHintType:",currentHintType);
            console.log("currentHint:",currentHint);
            console.log("value1:",value1); 
            console.log("value2:",value2);
          }  
		} 
		if(statusHint) {
		   document.getElementById("imageRed").src="images/r1.png";
		}
		else {
		   document.getElementById("imageRed").src="images/r2.png";
		}
		setTimeout(function(){changeRed()},1000); 
		hint.style.color = "#0000FF";
		turnBlue=true;
	}
});
  return newgrid; 
}
//window.onload =
var el = document.getElementById('blackboard');
//el.innerHTML=grid;
el.appendChild(grid);
el.className='blueclicked';

var hint=getHint();
var elHint= document.getElementById('hint');
elHint.appendChild(hint);

function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r=0;r<=rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<=cols;++c){
		var cell = tr.appendChild(document.createElement('td'));
		cell.className='columnContainer';
			if(c==0 ){
			if(r!=0)
				cell.innerHTML = r;
				
			}
			else if(r==0){
				if(c!= 0)
				cell.innerHTML = c;
				
			}
            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}

function changeRed(){
   document.getElementById("imageRed").src="images/blank.png";
   document.getElementById("imageBlue").src="images/b3.png";
}

function changeBlue(){
   document.getElementById("imageRed").src="images/r3.png";
   document.getElementById("imageBlue").src="images/blank.png";
}

function isGameOver(){
	if(turnBlue){
		return isThereAHorizontalPath();
	}else{
		return isThereAVerticalPath();
	}
}

// red 1 -> vertical, blue 0 -> horizontal, empty -1s

function isThereAHorizontalPath(){
    for (var i = 0; i < table; i++) {
      for (var j = 0; j < table; j++){
        visited[i][j] = 0;
      }
    }
    var ans = false;
    for(var i=0;i<table;i++) {
       if(x[i][0] == 0 && visited[i][0] == 0) {
         visited[i][0] = 1;
         ans = DFSHorizontal(i,0);
         if(ans){ 
            return ans;
         }
       }
    }
    return ans;
}

function DFSHorizontal (i,j) {
   if(j == (table-1))
      return true;
   var ans = false;
   // i, j+1 & i, j-1
   if(x[i][j+1] == 0 && visited[i][j+1] == 0) {
     visited[i][j+1] = 1; 
     ans = DFSHorizontal(i,j+1);
     if(ans) return ans;
   }
   if(j-1 >= 0 && x[i][j-1] == 0 && visited[i][j-1] == 0) {
     visited[i][j-1] = 1; 
     ans = DFSHorizontal(i,j-1);
     if(ans) return ans;
   }
   // i+1, j+1 & i+1 , j & i+1, j-1
   if(i+1 < table) {
     if(x[i+1][j+1] == 0 && visited[i+1][j+1] == 0) {
       visited[i+1][j+1] = 1;
       ans = DFSHorizontal(i+1,j+1);
       if(ans) return ans;
     }
     if(x[i+1][j] == 0 && visited[i+1][j] == 0) {
       visited[i+1][j] = 1;
       ans = DFSHorizontal(i+1,j);
       if(ans) return ans;
     }
     if(j-1 >= 0 && x[i+1][j-1] == 0 && visited[i+1][j-1] == 0) {
       visited[i+1][j-1] = 1;
       ans = DFSHorizontal(i+1,j-1);
       if(ans) return ans;
     }  
   }  
   // i-1, j+1 & i-1, j & i-1, j-1    
   if(i-1 >= 0){
     if(x[i-1][j+1] == 0 && visited[i-1][j+1] == 0) {
       visited[i-1][j+1] = 1;
       ans = DFSHorizontal(i-1,j+1);
       if(ans) return ans; 
     } 
     if(x[i-1][j] == 0 && visited[i-1][j] == 0) {
       visited[i-1][j] = 1;
       ans = DFSHorizontal(i-1,j);
       if(ans) return ans; 
     }  
     if(j-1 >= 0 && x[i-1][j-1] == 0 && visited[i-1][j-1] == 0) {
       visited[i-1][j-1] = 1;
       ans = DFSHorizontal(i-1,j-1); 
     }  
   }
   return ans;
}

function isThereAVerticalPath(){
    for (var i = 0; i < table; i++) {
      for (var j = 0; j < table; j++){
        visited[i][j] = 0;
      }
    }
    var ans = false;
    for(var i=0;i<table;i++) {
       if(x[0][i] == 1 && visited[0][i] == 0) {
         visited[0][i] = 1;
         ans = DFSVertical(0,i);
         if(ans){ 
            return ans;
         }
       }
    }
    return ans;
}

function DFSVertical (i,j) {
   if(i == (table-1))
      return true;
   var ans = false;
   // i+1, j & i-1, j
   if(x[i+1][j] == 1 && visited[i+1][j] == 0) {
     visited[i+1][j] = 1;
     ans = DFSVertical(i+1,j);
     if(ans) return ans;  
   }
   if(i-1 >=0 && x[i-1][j] == 1 && visited[i-1][j] == 0) {
     visited[i-1][j] = 1;
     ans = DFSVertical(i-1,j);
     if(ans) return ans;
   }
   // i+1, j+1 & i, j+1 & i-1, j+1
   if(j+1 < table){ 
     if(x[i+1][j+1] == 1 && visited[i+1][j+1] == 0) {
       visited[i+1][j+1] = 1;
       ans = DFSVertical(i+1,j+1);
       if(ans) return ans;
     }
     if(x[i][j+1] == 1 && visited[i][j+1] == 0) {
       visited[i][j+1] = 1;
       ans = DFSVertical(i,j+1);
       if(ans) return ans;
     }
     if(i-1 >=0 && x[i-1][j+1] == 1 && visited[i-1][j+1] == 0) {
       visited[i-1][j+1] = 1;
       ans = DFSVertical(i-1,j+1);
       if(ans) return ans;
     }
   } 
   // i+1, j-1 & i, j-1 & i-1, j-1      
   if(j-1 >= 0){ 
     if(x[i+1][j-1] == 1 && visited[i+1][j-1] == 0) {
       visited[i+1][j-1] = 1;
       ans = DFSVertical(i+1,j-1);
       if(ans) return ans;
     }
     if(x[i][j-1] == 1 && visited[i][j-1] == 0) {
       visited[i][j-1] = 1;
       ans = DFSVertical(i,j-1);
       if(ans) return ans;
     }
     if(i-1 >=0 && x[i-1][j-1] == 1 && visited[i-1][j-1] == 0) {
       visited[i-1][j-1] = 1;
       ans = DFSVertical(i-1,j-1);
     }
   }
   return ans;
}

function getHint(){
   var textBox = document.createElement('myText');
   textBox.className="textBox";
   textBox.innerHTML= generateHint();
   return textBox;
}

function generateHint() {
  // pick an empty location and generate appropriate hint. 
  // Hint may apply to more than one locations though so have to check what to do then
  var emptyCellValues = new Array(table*table);
  var index = 0;
  for (var i = 0; i < table; i++) {
     for(var j = 0; j< table; j++) {
        if(x[i][j] == -1) {
           emptyCellValues[index] = (i+1)*(j+1);
           index ++;
        }
     }
  }
  var randomEmptyCell = Math.floor(Math.random() * index);
  var num = emptyCellValues[randomEmptyCell];
  
  // hint type 0 : odd/even
  // hint type 1 : between x and y inclusive
  // hint type 2 : contains digit x
  // hint type 3 : less than x
  // hint type 4 : greater than x
  
  var hintType = Math.floor(Math.random() * 5);
  if((num <=75 && hintType == 4) || (num >=25 && hintType == 3)) {
      hintType = 1;
  }
  
  var upper, lower, sNum, digitLoc;
  var h = "";
  switch(hintType)
  {
     case 0 : if(num%2 == 0){
                 h = "Product is even";
                 value1 = 0;
              }
              else {
                 h = "Product is odd";
                 value1 = 1;
              }
              value2 = 0;
              break;
     case 1 : upper = Math.floor(Math.random() * 13);
			  lower = Math.floor(Math.random() * 13);
			  upper = upper + num; lower = num - lower;
			  if(lower < 0) lower = 0;
			  if((upper-lower) <= 1) {
				upper += 2;
			  }
			  h = "Product is between " + lower + " and " +upper +", inclusive";
			  value1 = lower; value2 = upper;
				/*var count=getCountWhereHintIsSatisfied(hintType,value1,value2);
				console.log(hintType,count);
				if(count > 0 && count <= 10){
						break;
				}
				*/
              break;
     case 2 : sNum = num.toString();
              digitLoc = Math.floor(Math.random() * sNum.length); 
              contains = sNum.charAt(digitLoc);
              value1 = contains; value2 = 0; 
              h = "Product contains the digit "+contains;
              break;
     case 3 : upper = Math.floor(Math.random() * 13);
              upper = upper + num + 1;
              h = "Product is less than " + upper;
              value1 = upper; value2 = 0;
              break;
     case 4 : lower = Math.floor(Math.random() * 13);
              lower = num - lower - 1;
              if(lower < 0) lower = 0;
              h = "Product is greater than " + lower;
              value1 = lower; value2 = 0;
              break;    
  }
  
  currentHintType = hintType;
  console.log("generated Hint has Type:",currentHintType);
  return h;    
}

function satisfiesHint(row, col) {
   console.log("checking if",i,j); 
   console.log(" satisfies Hint Type:",currentHintType);
   if(x[row][col] != -1) {
      return false;
   }   
   var num = (row+1)*(col+1);
   var result = false;
   switch(currentHintType)
   {
      case 0 : if(num%2 == 0 && value1 == 0)
                   result = true;
               else if(num%2 != 0 && value1 == 1)
                   result = true;
               break;
      case 1 : if(num >= value1 && num <= value2)  
                   result = true;
               break;    
      case 2 : var sNum = num.toString();
               for(var i=0; i<sNum.length; i++){
                  if(parseInt(sNum.charAt(i)) == value1){
                       result = true;
                       break;
                  }     
               }    
               break;
      case 3 : if(num < value1)
                   result = true; 
               break;
      case 4 : if(num > value1)
                   result = true;
               break;                              
                                 
   }
   return result;
}

function clickStartGame() {
    clickRestartGame();
    modal1.style.display = "block";
}

function clickRestartGame() {
    turnBlue=true;       // Message
    for (var i = 0; i < table; i++) {
      for (var j = 0; j < table; j++){
        x[i][j] = -1;
      }
    }
    winnerIsBlue=false;
    resultIsgameOver=false;
    statusHint = false;
    value1=0; value2=0;

    rulesOpen = false; 
     
    while(grid.hasChildNodes() ){
      grid.removeChild(grid.lastChild);
    }
    grid = getNewGrid();
	setTurnBlue();
	el.removeChild(el.firstChild);
    el.appendChild(grid);
    el.className='blueclicked';
    
    currentHint = generateHint();
	hint.innerHTML= currentHint;
}
function setTurnBlue(){
	hint.style.color = "#0000FF";
	turnBlue=true;
	changeRed();
}
function confirmGameDetails() {
    blueName = document.getElementById("BP").value;
    redName = document.getElementById("RP").value;
    var blueBox = document.createElement('blueText');
	var horizontalPathImage= document.createElement('bluePathImage');
	var verticalPathImage= document.createElement('redPathImage');
    var redBox = document.createElement('redText');
	horizontalPathImage.className="bluepathImage";
	verticalPathImage.className="redpathImage";
    blueBox.className="blueBox";
    redBox.className="redBox"; 
    blueBox.innerHTML = blueName;
    redBox.innerHTML = redName;
    var BN = document.getElementById('blueName');
    var RN = document.getElementById('redName');
    while(BN.hasChildNodes())
      BN.removeChild(BN.lastChild);
    while(RN.hasChildNodes())  
      RN.removeChild(RN.lastChild);
    BN.appendChild(blueBox);
    RN.appendChild(redBox);
	BN.appendChild(horizontalPathImage);
    RN.appendChild(verticalPathImage);
    modal1.style.display = "none";
	setTurnBlue();
}

function clickRulesClose() {
	modal3.style.display = "none";
}

function modalClose() {
    if (location.hash == '#myModal1') {
        location.hash = '';
    }
	modal1.style.display = "none";	
	confirmGameDetails();
	setTurnBlue();
}

// Handle ESC key (key code 27)
document.addEventListener('keyup', function(e) {
    if (e.keyCode == 27) {
	confirmGameDetails();
        modalClose();
    }
});

// Handle Enter key (key code 13)
document.addEventListener('keyup', function(e) {
    if (e.keyCode == 13) {
        confirmGameDetails();
    }
});

// Handle click on the modal container
modal1.addEventListener('click', modalClose, false);

// Prevent event bubbling if click occurred within modal content body
modal1.children[0].addEventListener('click', function(e) {
    e.stopPropagation();
	
}, false);

function clickClose() {
	/*if (location.hash == '#myModal2') {
		clickRestartGame();
		modal2.style.display = "none";
	}
	
	modal3.style.display = "none";*/
	if(!rulesOpen) {
	   	clickRestartGame();
		modal2.style.display = "none";
	}
	else {
	    rulesOpen = false; 
	    modal3.style.display = "none";
	}
}

// Handle click on the modal container
modal3.addEventListener('click', clickRulesClose, false);

// Prevent event bubbling if click occurred within modal content body
modal3.children[0].addEventListener('click', function(e) {
    e.stopPropagation();
}, false);


/*function getCountWhereHintIsSatisfied(hintType,v1,v2){
var index=0;
	for (var i = 0; i < table; i++) {
     for(var j = 0; j< table; j++) {
        if(x[i][j] == -1) {
			var num = (i+1)*(j+1);
           switch(hintType)
		   {
			  case 1 : if(num >= v1 && num <= v2)
							index++;
					   break;    
			  case 2 : var sNum = num.toString();
					   for(var i=0; i<sNum.length; i++){
						  if(parseInt(sNum.charAt(i)) == v1){
							   index++;
							   break;
						  }     
					   }    
					   break;
			  case 3 : if(num < v1)
						   index++;
					   break;
			  case 4 : if(num > v1)
						   index++;
					   break;                              
										 
		   }          
        }
     }
  }
  return index;
}*/

function displayRules(){
   modal3.style.display = "block";
   rulesOpen = true;
}

function sendResults(){

var url="";
	if(winnerIsBlue){
		url= "../../dbman/saveScore.php?"+"gamename=superply&playername="+blueName+"&score=Win";
	}else{
		url="../../dbman/saveScore.php?"+"gamename=superply&playername="+redName+"&score=Win";
	}
	httpGetAsync(url, function(){});
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}