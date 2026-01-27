var spaceWidth = document.getElementById("spacecanvas").width;
var spaceHeight = document.getElementById("spacecanvas").height;
var ctx = document.getElementById("spacecanvas").getContext(`2d`);
var spacecanvas = document.getElementById("spacecanvas");
var kills = 0, alive = true, lives = 3;
var gameStarted = false, gameSpeed = 1000/30;
var timer = 0;


var ship = { //Object ship which contains all attributes of the ship
	x:245,
	y: 525,
	w: 100,
	h: 100,
	speedBullet: 15,

	draw: function() {
		if(ship.x > 550) {
			ship.x = 550;
		}
		if(ship.y > 550) {
			ship.y = 550;
		}
		if(ship.x < 50) {
			ship.x = 50
		}
		if(ship.y < 50) {
			ship.y = 50
		}

		ctx.drawImage(shipImage,ship.x,ship.y,ship.w,ship.h) //Used to draw our ship on the canvas with required coordinates along with height and width
	},
}

function clearCanvas() {
	ctx.clearRect(0,0,spaceWidth,spaceHeight);
}

function init() {
	enemyImage = new Image()
	shipImage = new Image();
	bulletImage = new Image();
	shipImage.src = "img/spacecat.png";
	enemyImage.src = "img/spaceinvader.png";
	bulletImage.src = "img/laser.png";

	spacecanvas.addEventListener('click',gameStart, false);

	addEnemies();
	gameLoop();
}

function gameStart() {
	gameStarted = true;
	spacecanvas.removeEventListener('click',gameStart,false);
}

///////////////////////////////////////////////////

var enemyList = [];
enemyTotal = 5;

function enemy(x,y,speed) {
	this.x = x,
	this.y = y,
	this.w = 50,
	this.h = 50,
	this.speed = speed,
	this.count = 0, //To measure the cycle from left to right

	this.draw = function() {
		ctx.drawImage(enemyImage,this.x,this.y,this.w,this.h);
	}
}

function addEnemies() {
	//Setting an initial x and y
	var temp_x = 50,temp_y = -25,speed = 5;
	for(var i=0; i<enemyTotal; i++) {
		var e = new enemy(temp_x,temp_y,speed)
		enemyList.push(e);
		temp_x += 110;
	}
}

function drawEnemies() {
	for(var i=0;i<enemyTotal;i++) {
		enemyList[i].draw();
	}
}

function moveEnemies() {
	for(var i = 0;i < enemyList.length; i++) {
		if(enemyList[i].y < spaceHeight) {
				enemyList[i].y += Math.abs(5);				
		}
		else if(enemyList[i].y > spaceHeight - 1) {
			enemyList[i].y = -40;
		} 
	}
}

///////////////////////////////////////

var bulletTotal = 5;
bulletList = [];

function bullet(x,y,speed) {
	this.x = x;
	this.y = y;
	this.w = 5;
	this.h = 10,
	this.state = "active"
	this.speed = speed;
	
	this.draw = function() {
		ctx.drawImage(bulletImage,this.x,this.y,this.w,this.h)
	}
}

function drawBullet() {
	for(var i=0;i<bulletList.length;i++) {
		bulletList[i].draw();
	}
}

function moveBullet() {
	for(var i=0; i<bulletList.length;i++) {
		if(bulletList[i].y > -11) {
			bulletList[i].y -= bulletList[i].speed
		}
		else if(bulletList[i].y < -10) {
			bulletList.splice(i,1);
		}
	}
}

//////////////////////////////////////////////

function collisionBullet() {
	var check = false;
	for(var i=0; i<bulletList.length;i++) {
		for(var j=0;j<enemyList.length;j++){
			if(bulletList[i].y <= (enemyList[j].y + enemyList[j].h) && bulletList[i].x >= enemyList[j].x && bulletList[i].x <= (enemyList[j].x + enemyList[j].w)) {
				check = true;
				enemyList.splice(j,1);
				kills += 1;
				var e = new enemy((Math.random() * 500) + 50, -25,5);
				enemyList.push(e);
			}
		}
		if(check == true) {
			bulletList.splice(i,1);
			check = false;
		}
	}
}

function collisionShip() {
	var ship_xw = ship.x + ship.w, ship_yh = ship.y + ship.h;
	for(var i=0; i<enemyList.length; i++) {
		if(ship.x > enemyList[i].x && ship.x < (enemyList[i].x + enemyList[i].w) && ship.y > enemyList[i].y && ship.y < (enemyList[i].y + enemyList[i].h)) {
			checkLives();
			//console.log("1");
		}
		if (ship_xw < enemyList[i].x + enemyList[i].w && ship_xw > enemyList[i].x && ship.y > enemyList[i].y && ship.y < enemyList[i].y + enemyList[i].h) {
      		checkLives();
      		//console.log("2");
    	}
    	if (ship_yh > enemyList[i].y && ship_yh < enemyList[i].y + enemyList[i].h && ship.x > enemyList[i].x && ship.x < enemyList[i].x + enemyList[i].w) {
      		checkLives();
      		//console.log("3");
    	}
    	if (ship_yh > enemyList[i].y && ship_yh < enemyList[i].y + enemyList[i].h && ship_xw < enemyList[i].x + enemyList[i].w && ship_xw > enemyList[i].x) {
      		checkLives();
      		//console.log("4");
    	}
 	}
}

/////////////////////////////////////////////////////

function displayScore() {
	ctx.font = 'bold 15px Orbitron';
	ctx.fillStyle = '#fff'
	ctx.fillText("kills: ",490, 30);
	ctx.fillText(kills, 550, 30);
	ctx.fillText('Lives:', 10, 30);
	ctx.fillText(lives, 68, 30);
	
	if (!gameStarted) {
  		ctx.font = 'bold 25px Orbitron';
  		ctx.fillText('Generic Space Shooter', spaceWidth/2-150,spaceHeight/2);
  		ctx.font = 'bold 20px Orbitron';
  		ctx.fillText('Click to Play', spaceWidth/2-56, spaceHeight/2+30);
  		ctx.fillText('Use arrow keys to move', spaceWidth/2-125, spaceHeight/2+60);
  		ctx.fillText('Use the spacebar key to shoot', spaceWidth/2-150,spaceHeight/2+90);
	}

	if (!alive) {
  		ctx.fillText('Game Over!',245,spaceHeight/2);
  		ctx.fillText('Click anywhere to play again',spaceWidth/2-110,spaceHeight/2+25);
  		spacecanvas.addEventListener('click',gameRestart,false);
	}
}

function checkLives() {
	lives-=1;
	if(lives > 0) {
		reset();
	}
	else if(lives == 0) {
		alive = false;
	}
}

function reset() {
	ship.x = 245;
	ship.y = 525;
	enemyList = [];
	addEnemies();
}

function gameRestart() {
	ship.x = 245;
	ship.y = 525;
	kills = 0;
	lives = 3;
	enemyList = [];
	alive = true;
	addEnemies();
	spacecanvas.removeEventListener('click',gameRestart,false);
}

document.onkeydown = function(event) {
	if (event.keyCode == 37) {  //Left arrow key pressed
		ship.x = ship.x-20;
	}
	else if (event.keyCode == 38) { //Up arrow key
		ship.y = ship.y-20;
	}
	else if (event.keyCode == 39) { //Right arrow key
		ship.x = ship.x+20;
	}
	else if (event.keyCode == 40) { //Down arrow key
		ship.y = ship.y+20;
	}
	else if (event.keyCode == 32 && bulletList.length <= bulletTotal) { //Space pressed 
		var b = new bullet(ship.x+25,ship.y-10,ship.speedBullet)
		bulletList.push(b);	
	}
}
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function gameLoop() {
	clearCanvas();
	if (alive && lives > 0 && gameStarted) {
		collisionBullet();
		collisionShip();
		moveEnemies();
		moveBullet();
		drawEnemies();
		ship.draw();
		drawBullet();
		displayScore();
		timer = timer + 1;
		if(timer % 100 == 0) {
			gameSpeed = gameSpeed - 1/3;
		}
		//console.log(ship.x + " " + ship.y);
	}
	displayScore();
	game = setTimeout(gameLoop,gameSpeed);
}

window.onload = init;