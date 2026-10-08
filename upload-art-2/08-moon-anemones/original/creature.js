function Creature(x, y) {
  
  this.fOffset = random(10000);
  this.pos = new p5.Vector(x, y);
  this.dir = new p5.Vector(1, 1);
  this.ropes = [];
  
  for (var a = 0; a < 360; a+=4) {
    var newRope = new Rope(x, y, a, 6);
    this.ropes.push(newRope);
  }
}