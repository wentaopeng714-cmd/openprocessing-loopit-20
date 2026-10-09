function Circle(x, y, diam, h) {
  this.pos = new p5.Vector(x, y);
  this.diam = diam;
  this.sizeRate = random(0.25, 1);
  this.hue = h;
}