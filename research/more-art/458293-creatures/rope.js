// Uses a series of dynamic objects but displays them as a single line.
function Rope(x, y, a, count) {
  
  this.a = a;
  this.objs = [];
  
  var startX = x+cos(radians(a));
  var startY = y+sin(radians(a));
  this.objs.push(new Spring(startX, startY, 1));

  for (var i = 0; i < count; i++) {
    this.objs.push(new Pendulum(this.a, startX, startY+i*15, this.objs[this.objs.length-1]))
  }
  
  this.display = function() {
    noFill();
    stroke(0);
    strokeWeight(0.2);
    
    beginShape();
    curveVertex(this.objs[0].pos.x, this.objs[0].pos.y);
    
    for (var i = 0; i < this.objs.length; i++) {
      this.objs[i].move();
      
      if (debugMode) {
      	this.objs[i].display();
      } else {
        curveVertex(this.objs[i].pos.x, this.objs[i].pos.y);
      }
    }
    
    curveVertex(this.objs[this.objs.length-1].pos.x, this.objs[this.objs.length-1].pos.y);
    endShape();
  }
}