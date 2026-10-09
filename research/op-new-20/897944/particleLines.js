function ParticleLine(x, y, vx, vy) {
	this.startPos = new p5.Vector(x, y);
	this.pos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
	this.vel.mult(random(10));
	this.vel.rotate(radians(random(-25, 25)));
	this.mass = random(1, 30);
	this.airDrag = random(0.92, 0.98);
	this.colorIndex = int(random(colorScheme.length));
	
	this.move = function() {
		this.vel.mult(this.airDrag);
		this.pos.add(this.vel);
	}
	
	this.draw = function() {
		let mass = this.mass * this.vel.mag() * 0.6;
		let c = colorScheme[this.colorIndex];
		drawingContext.shadowColor = color(red(c), green(c), blue(c), 255 * this.vel.mag());
		drawingContext.shadowBlur = mass;

		stroke(0);
		strokeWeight(mass);
		line(this.pos.x, this.pos.y, this.startPos.x, this.startPos.y);
	}
}