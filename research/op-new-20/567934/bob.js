function Bob(x, y, path) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
	this.path = path;
	this.direction = 1;
  this.vertIndex = 0;
	this.variance = random(0.9, 1.1);
  this.drag = random(0.98, 0.99);
	this.hue = (globalHue + random(-40, 40)) % 255;
	this.bright = random(255);
	this.mass = random(40);
	
  this.move = function() {
		// If its velocity didn't exceed the threshold then seek its target.
		let target = this.path.vertices[this.vertIndex];
		let targetDist = dist(this.pos.x, this.pos.y, target.x, target.y);

		let proximityMult = 1;

		// Slow it down the closer it gets to its target.
		let distThresh = 50;
		if (targetDist < distThresh) {
			//proximityMult = targetDist / distThresh;
			
			if ((this.direction == 1 && this.vertIndex == this.path.vertices.length - 1) || 
				  (this.direction == -1 && this.vertIndex == 0)) {
				this.direction *= -1;
			}
			this.vertIndex += this.direction;
		}

		// Add some friction so it can eventually settle.
		this.vel.mult(this.drag);

		// Seek its target.
		if (targetDist > 1) {
			let steer = new p5.Vector(target.x, target.y);
			steer.sub(this.pos);
			steer.normalize();
			steer.mult(0.05 * this.variance * proximityMult);
			this.acc.add(steer);
		}

		// Move it.
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}
	
}