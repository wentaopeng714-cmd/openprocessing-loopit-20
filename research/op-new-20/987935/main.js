/*
Repulsion

jasonlabbe3d.com
twitter.com/russetPotato
*/

var count = 500;
var spacing = 6;
var repulsionRadius = 100;
var particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	
	for (let i = 0; i < count; i++) {
		let angle = i * 137.5;
		let r = spacing * sqrt(i);
		let x = r * cos(radians(angle)) + width / 2;
		let y = r * sin(radians(angle)) + height / 2;
		let distToCenter = dist(x, y, width / 2, height / 2);
		let s = 255 - distToCenter * 1.25;
		let b = 150 + distToCenter * 1;
		
		particles.push(new Particle(
			random(width), -200, 
			x, y, 
			0.5,
			s, b));
	}
} 

function draw() {
  background(50);
	
	for (let i = 0; i < particles.length; i++) {
		particles[i].move();
		particles[i].display();
	}
	
	stroke(0, 50);
	strokeWeight(repulsionRadius * 2);
	point(mouseX, mouseY);
}