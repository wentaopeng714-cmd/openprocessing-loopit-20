/*
Lines Brush

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
 
Controls:
	- Move the mouse to spawn particles.
	- Click to change colors.
*/

var particleLinesPerFrame = 3;
var particlesPerFrame = 2;

var colorScheme = [];
var particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
	newColorScheme();
}

function draw() {
	blendMode(BLEND);
	background(0);
	blendMode(SCREEN);
	
	let lastPos = new p5.Vector(pmouseX, pmouseY);
	let pos = new p5.Vector(mouseX, mouseY);
	
	// Calculate this frame's velocity.
	let vel = new p5.Vector(pos.x, pos.y);
	vel.sub(lastPos);
	
	// Spawn sparks.
	for (let i = 0; i < particlesPerFrame; i++) {
		particles.push(new Spark(pos.x, pos.y, vel.x, vel.y));
	}
	
	// Spawn particles lines.
	vel.normalize();
	for (let i = 0; i < particleLinesPerFrame; i++) {
		particles.push(new ParticleLine(pos.x, pos.y, vel.x, vel.y));
	}
	
	// Move, draw, and kill all particles.
	for (let i = particles.length - 1; i > -1; i--) {
		particles[i].move();
		particles[i].draw();
		
		if (particles[i].vel.mag() < 0.1) {
			particles.splice(i, 1);
		}
	}
}

function mouseClicked() {
	newColorScheme();
}

function newColorScheme() {
	colorMode(HSB, 255);
	
	colorScheme = [];
	let mainHue = random(255);
	let colorCount = 5;
	
	for (let i = 0; i < colorCount; i++) {
		colorScheme.push(
			color(
				constrain(mainHue + random(-20, 20), 0, 255), 
				map(i, 0, colorCount - 1, 255, 0), 
				255));
	}
	
	colorMode(RGB, 255);
}