/*
Particle sandbox

Controls:
	- Move the mouse around the interact with the particles.
	- Mouse click to reset the scene.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var bobCount = 5000;
var bobs = [];
var globalHue;


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	reset();
}


function draw() {
	for (let i = 0; i < bobs.length; i++) {
		let b = bobs[i];
		b.move();
		
		stroke(b.hue, b.bright, 255, b.vel.mag() * 10);
		point(b.pos.x, b.pos.y);
	}
}


function mouseClicked() {
	reset();
}


function reset() {
	globalHue = random(255);
	
	bobs.splice(0, bobs.length);
	
	for (let i = 0; i < bobCount; i++) {
		bobs.push(new Bob(random(width), random(height)));
	}
	
	background(10);
	
	// Make sure mouse doesn't immediately effect particles.
	mouseX = -9999;
	mouseY = -9999;
}