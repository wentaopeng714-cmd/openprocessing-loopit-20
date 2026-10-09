function Point(x, y) {
	
  this.oldPos = new p5.Vector(x, y);
  this.pos = new p5.Vector(x, y);
  this.forces = new p5.Vector();
  this.snap = false;
  
  this.applyForce = function(force) {
		force.mult(massSlider.value());
    this.forces.add(force);
  }
  
  this.sim = function() {
		// Snapped points don't need to sim.
    if (this.snap) {
			return;
		}
		
		// Add gravity.
		let gravity = new p5.Vector(0, gravitySlider.value());
		this.applyForce(gravity);

		// Use mouse as a repulsion body to push the point away.
		let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
		if (d < repulsionSizeSlider.value()) {
			let repulse = this.pos.copy();
			repulse.sub(new p5.Vector(mouseX, mouseY));
			repulse.normalize();
			//repulse.mult(0.5);
			this.applyForce(repulse);
		}

		// Get the new velocity.
		let velocity = this.pos.copy();
		velocity.sub(this.oldPos);
		velocity.add(this.forces);
		
		// Add air drag so it can settle.
		velocity.mult(airDragSlider.value());

		// Limiting the velocity helps keep it stable.
		velocity.limit(15);

		// Move the point.
		this.oldPos.set(this.pos);
		this.pos.add(velocity);
		this.forces.mult(0);
  }
}