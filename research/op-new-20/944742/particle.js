function Particle(x, y) {
	this.pos = new p5.Vector(x, y);
	this.age = maxAge;
	this.offsetVariance = random(0.5, 3);
	this.sizeVariance = random(0.5, 1.5);
	this.hue = globalHue;
}