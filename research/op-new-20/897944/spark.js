function Spark(x, y, vx, vy) {
	this.pos = new p5.Vector(x, y);
	this.lastPos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
	this.vel.rotate(radians(random(-30, 30)));
	this.airDrag = random(0.8, 0.9);
	
	this.move = function() {
		this.lastPos.set(this.pos.x, this.pos.y);
		this.vel.mult(this.airDrag);
		this.pos.add(this.vel);
	}
	
	this.draw = function() {
		stroke(255 * this.vel.mag() * 0.2);
		strokeWeight(2);
		line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y);
	}
}