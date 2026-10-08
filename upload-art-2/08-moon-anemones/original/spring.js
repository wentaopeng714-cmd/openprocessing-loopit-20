// Seeks after a target and creates a spring effect.
function Spring(x, y, maxForce) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.target = new p5.Vector(x, y);
  this.maxForce = maxForce;
  
  this.move = function() {
    var distThreshold = 20;
    
    // Move towards the target.
    var push = new p5.Vector(this.target.x, this.target.y);
    var distance = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    var force = map(min(distance, distThreshold), 0, distThreshold, 0, this.maxForce);
    push.sub(this.pos);
    push.normalize();
    push.mult(force);
    this.acc.add(push);
    
    // Add air-drag.
    this.vel.mult(1-airDragSlider.value());
    
    // Move it.
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.display = function() {
    strokeWeight(5);
    stroke(0, 255, 0);
    point(this.pos.x, this.pos.y);
  }
}