/*
Steering path following

Particles follow a path by seeking out its vertices one by one.

Controls:
	- Click to reset to new values.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var mainPath;
var bobs = [];
var globalHue;


function setup() {
	createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 255);
	
	reset();
}


function reset() {
	globalHue = random(255);
	
	mainPath = new Path();
	
	bobs.splice(0, bobs.length);
	
	for (let i = 0; i < 2000; i++) {
		let rot = p5.Vector.random2D();
		rot.mult(random(250));
		
		let x = mainPath.vertices[0].x + rot.x;
		let y = mainPath.vertices[0].y + rot.y;
		
		bobs.push(new Bob(x, y, mainPath));
	}
}


function mouseClicked() {
	reset();
}


function draw() {
	background(10);
	
	for (let i = 0; i < mainPath.vertices.length; i++) {
		let v = mainPath.vertices[i];
		
		if (i < mainPath.vertices.length - 1) {
			let v2 = mainPath.vertices[i + 1];
			stroke(30);
			strokeWeight(0.5);
			line(v.x, v.y, v2.x, v2.y);
		}
		
		stroke(30);
		strokeWeight(5);
		point(v.x, v.y);
	}
	
	for (let i = 0; i < bobs.length; i++) {
		let b = bobs[i];
		b.move();
		
		stroke(b.hue, b.bright, 255, 10);
		strokeWeight(b.mass);
		point(b.pos.x, b.pos.y);
	}
}