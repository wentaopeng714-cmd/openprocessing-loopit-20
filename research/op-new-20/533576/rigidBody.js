function RigidBody() {
	
	this.points = [];
	this.segments = [];
	
	this.addPoint = function(x, y) {
		let newPoint = new Point(x, y);
		this.points.push(newPoint);
		return newPoint;
	}
	
	this.addSegment = function(point1, point2) {
		let newSegment = new Segment(point1, point2);
		this.segments.push(newSegment);
		return newSegment;
	}
	
	// Sim its points.
	this.sim = function() {
		for (let i = 0; i < this.points.length; i++) { 
			this.points[i].sim();
		}
		
		// Sim its segments.
		// The higher the timesteps, the more stable it will be.
		// Higher timesteps help maintain its shape, but at the cost of speed and making it feel stiff.
		for (let ts = 0; ts < timesteps; ts++) {
			for (let i = 0; i < this.segments.length; i++) { 
				this.segments[i].sim();
			}
		}
	}
}