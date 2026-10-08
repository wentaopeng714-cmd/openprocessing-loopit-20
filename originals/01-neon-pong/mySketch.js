let playerX = 200;
let robotX = 200;
let ballX = 200;
let ballY = 200;
let speedx = 0;
let speedy = 3;
let playerpoints = 0;
let robotpoints = 0;

function setup() {
	createCanvas(400, 400);
	background(100);
	frameRate(1000);
	speedx = random(-1,1);
}

function draw() {
	keyPressed();
	background("black");
	fill("white");
	stroke("white");
	textSize(30);
	circle( ballX, ballY, 20);
		circle( ballX - 1 * speedx, ballY - 1 * speedy, 18);
		circle( ballX - 1.5 * speedx, ballY - 1.5 * speedy, 15);
		circle( ballX - 2 * speedx, ballY - 2 * speedy, 13);
		circle( ballX - 3 * speedx, ballY - 3 * speedy, 10);
		circle( ballX - 4 * speedx, ballY - 4 * speedy, 8);
		circle( ballX - 4.5 * speedx, ballY - 4.5 * speedy, 5);
	rect( playerX - 25, 375, 50, 10);
	rect( robotX - 25, 25, 50, 10);
	text( playerpoints, 45, 45);
	text( robotpoints, 345, 45);
	line(1,1,1,399);
	line(399,1,399,399);
	line(1,1,399,1);
	line(1,399,399,399)
	if ((ballY > 360) && (ballY < 365) && (ballX < (playerX + 40)) && (ballX > (playerX - 40))) {
		speedy = (speedy * -1);
		speedx = (ballX - playerX) / 5;
	}
	if ((ballY < 40) && (ballY > 35) && (ballX < (robotX + 40)) && (ballX > (robotX - 40))) {
		speedy = (speedy * -1);
		speedx = (ballX - robotX) / 5;
	}
	if (ballX < 20 || ballX > 380) {
		speedx = (speedx * -1);
	}
	if (ballY > 380) {
		robotpoints = robotpoints + 1;
		speedx = random(-3,3);
		speedy = 3;
		ballX = 200;
		ballY = 50;
	}
	if (ballY < 20) {
		playerpoints = playerpoints + 1;
		speedx = random(-3,3);
		speedy = -3;
		ballX = 200;
		ballY = 350;
	}
	if (robotX > 25 && robotX > ballX + 20) {
		robotX = robotX - 3
	}
	if (robotX < 375 && robotX < ballX - 20) {
		robotX = robotX + 3
	}
	if (robotpoints === 5) {
		text("YOU LOSE!", 125, 200);
		speedx = 0;
		speedy = 0;
		robotX = 200;
		playerX = 200;
	}
	if (playerpoints === 5) {
		text("YOU WIN!", 125, 200);
		speedx = 0;
		speedy = 0;
		robotX = 200;
		playerX = 200;
	}
	if (playerX > 25) {
		if (mouseX < playerX) {
	   	playerX = playerX - 10;
		}
	}
	if (playerX < 375) {
		if (mouseX > playerX) {
	   	playerX = playerX + 10;
		}
	}
	ballX = ballX + speedx;
	ballY = ballY + speedy;
}

function keyPressed() {
if (key === 'r') {
   playerX = 200;
	robotX = 200;
	ballX = 200;
	ballY = 200;
	speedx = 0;
	speedy = 3;
	playerpoints = 0;
	robotpoints = 0;
	}
}