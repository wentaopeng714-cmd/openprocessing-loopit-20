function Bob(x, y) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
	this.vel.mult(random(0.1));
  this.acc = new p5.Vector(0, 0);
  this.drag = random(0.98, 0.99);
	this.hue = (globalHue + random(-40, 40)) % 255;
	this.bright = random(255);
	
  this.move = function() {
		// Add some air drag so it can eventually settle.
		this.vel.mult(this.drag);

    // Push it away from the mouse.
    let mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    let mouseThresh = 200;
    
    if (mouseDist < mouseThresh) {
      let push = new p5.Vector(this.pos.x, this.pos.y);
      push.sub(new p5.Vector(mouseX, mouseY));
      push.normalize();
      push.mult((mouseThresh - mouseDist) * 0.01);
      this.acc.add(push);
    }
		
		// Move it.
		this.vel.add(this.acc);
		this.vel.limit(6);
		this.pos.add(this.vel);
		this.acc.mult(0);
		
		// Keep in bounds.
		if (this.pos.x < 0) {
			this.pos.x = 0;
			this.vel.x *= -1;
		} else if (this.pos.x > width) {
			this.pos.x = width;
			this.vel.x *= -1;
		}
		
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.vel.y *= -1;
		} else if (this.pos.y > height) {
			this.pos.y = height;
			this.vel.y *= -1;
		}
	}
	
}