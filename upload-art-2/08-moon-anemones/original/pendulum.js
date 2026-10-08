// Attaches to another object and acts as a bouncy pendulum.
function Pendulum(a, x, y, parent) {
  
  this.a = a;
  this.chaos = random(0.5, 1.5);
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.mass = 2;
  this.parent = parent;
  
  this.restLength = p5.Vector.dist(this.pos, this.parent.pos);
  
  this.move = function() {
    var frizz = map(frizzSlider.value(), 0, 1, 1, this.chaos);
    
    // Push down with gravity.
    var gravity = new p5.Vector(cos(radians(this.a)), sin(radians(this.a)));
    gravity.mult(gravitySlider.value());
    gravity.mult(frizz);
    gravity.div(this.mass);
    this.acc.add(gravity);
    
    // Add air-drag.
    this.vel.mult(1-airDragSlider.value());
    this.vel.limit(5);
    
    // Move it.
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Adjust its spring.
    var currentLength = p5.Vector.dist(this.pos, this.parent.pos);
    
    var spring = new p5.Vector(this.pos.x, this.pos.y);
    spring.sub(this.parent.pos);
    spring.normalize();
    
    var stretchLength = currentLength-this.restLength;
    spring.mult(-elasticitySlider.value()*stretchLength);
    spring.div(this.mass);
    this.acc.add(spring);
  }
  
  this.display = function() {
    if (this.parent != null) {
      strokeWeight(0.5);
      stroke(255, 0, 0);
      line(this.parent.pos.x, this.parent.pos.y, this.pos.x, this.pos.y);
    }
    
    strokeWeight(3);
    stroke(0, 255, 0);
    point(this.pos.x, this.pos.y);
  }
}