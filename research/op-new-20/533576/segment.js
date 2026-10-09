function Segment(point1, point2) {
	
  this.point1 = point1;
  this.point2 = point2;
  this.restLength = point1.pos.dist(point2.pos);
  
  this.sim = function() {
		// Get the delta of its original rest length.
   	let currentLength = this.point1.pos.dist(this.point2.pos);
   	let lengthDifference = this.restLength - currentLength;
   	
		// Get the percentage amount needed to offset the points back to its rest length.
		// Dividing with a higher number will make the segments stretchy, but they also feel more stable.
		let offsetPercent = (lengthDifference / currentLength) / 10.0;
   
		// Get the vector that the points need to travel against.
   	let direction = this.point2.pos.copy();
   	direction.sub(this.point1.pos);
   	direction.mult(offsetPercent);
   	
		// Move both points unless they are snapped.
   	if (!this.point1.snap) {
     	this.point1.pos.sub(direction);
   	}
   	
   	if (!this.point2.snap) {
     	this.point2.pos.add(direction);
   	}
  }
}