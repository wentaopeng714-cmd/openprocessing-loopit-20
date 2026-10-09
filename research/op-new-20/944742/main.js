/*
Colorful smoke

A simple smoke effect.

jasonlabbe3d.com
twitter.com/russetPotato
*/

var particles = [];
var maxAge = 40;
var globalHue = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	textAlign(CENTER);
	textSize(20);
}

function draw() {
	blendMode(BLEND);
  background(0);
  blendMode(SCREEN);
	
	let vector = new p5.Vector(pmouseX, pmouseY);
	vector.sub(mouseX, mouseY);
	if (vector.mag() > 3) {
		particles.push(new Particle(mouseX, mouseY));
	} else {
		globalHue = random(255);
	}
	
	for (let i = particles.length -1; i > -1; i--) {
		if (i == particles.length - 1) {
			continue;
		}
		
		stroke(0, map(particles[i].age, 0, maxAge, 0, 255));  // tail=transparent, head=opaque
		strokeWeight(map(particles[i].age, 0, maxAge, 160, 10) * particles[i].sizeVariance);  // tail=bigger, head=smaller
		drawingContext.shadowColor = color(particles[i].hue, 100, 200);
		drawingContext.shadowBlur = map(particles[i].age, 0, maxAge, 60 * particles[i].sizeVariance, 1);  // tail=larger blur, head=smaller blur
		let offset = (1 - (particles[i].age / float(maxAge))) * 50  * particles[i].offsetVariance;  // have it rise the longer it's alive
		
		line(
			particles[i].pos.x, particles[i].pos.y - offset, 
			particles[i + 1].pos.x, particles[i + 1].pos.y - offset);
		
		particles[i].age -= 0.5;
		if (particles[i].age <= 0) {
			particles.splice(i, 1);
		}
	}
	
	drawingContext.shadowBlur = 0;
	fill(255);
	text("Move the mouse around", width / 2, 40);
}