function Particle(x, y, tx, ty) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.target = new p5.Vector(tx, ty);
  this.activate = false;
  this.fallVariance = random(0.75, 1.25);
  this.pColor = color(255);
  this.pSize = 1;
  
  this.move = function() {
    if (!this.activate) {
      if (this.vel.mag() > velThreshold) {
        // Activates if its velocity exceeds the threshold.
        this.activate = true;

        // Spawn a few more particles in place for a nice effect.
        for (let i = 0; i < splitCount; i++) {
          let p = new Particle(this.pos.x, this.pos.y, this.target.x, this.target.y);
          
          p.activate = true;
          p.vel.set(this.vel.x, this.vel.y);
          p.vel.mult(random(0.9, 1.1));
          p.vel.rotate(radians(random(-25, 25)));
          p.acc.set(this.acc.x, this.acc.y);
          p.pSize = random(0.25, 3);

          // Keep the last particle white.
          if (i < splitCount-1) {
            p.pColor = color(h, 255, 255);
          }

          particles.push(p);

          // Increase hue for the next particle.
          h+=0.1;
          if (h > maxh) {
            h = minh;
          }
        }
      } else {
        // If its velocity didn't exceed the threshold then seek its target.
        let targetDist = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);

        let proximityMult = 1;

        // Slow it down the closer it gets to its target.
        let distThresh = 50;
        if (targetDist < distThresh) {
          proximityMult = targetDist/distThresh;
        }

        // Add some friction so it can eventually settle.
        this.vel.mult(0.99);

        // Seek its target.
        if (targetDist > 1) {
          let steer = new p5.Vector(this.target.x, this.target.y);
          steer.sub(this.pos);
          steer.normalize();
          steer.mult(0.05*proximityMult);
          this.acc.add(steer);
        }
      }
    } else { 
      // If it's activated, simply apply gravity.
      this.acc.add(new p5.Vector(0, 0.2*this.fallVariance));
    }
    
    // Push it away from the mouse.
    let mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    let mouseThresh = 100;
    
    if (mouseDist < mouseThresh) {
      let push = new p5.Vector(this.pos.x, this.pos.y);
      push.sub(new p5.Vector(mouseX, mouseY));
      push.normalize();
      push.mult((mouseThresh-mouseDist)*0.0025);
      this.acc.add(push);
    }
    
    // Move it.
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}