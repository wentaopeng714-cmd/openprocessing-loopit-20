/*
Dynamic ropes 2

The ropes are defined by a series of points which are simulated using verlet integration.

Controls:
	- Move the mouse over the ropes to interact with them.
  - Use the on-screen controls to effect the sim.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var timesteps = 20;
var rigidBodies = [];


function setup() {
	createCanvas(windowWidth, windowHeight);
	
	thicknessSlider = new Slider("Line thickness", 0.1, 2, 0.5, 0.1, 100, 100);
	resolutionSlider = new Slider("Resolution", 0, 1, 0.75, 0.05, 100, thicknessSlider.pos().y+60);
	repulsionSizeSlider = new Slider("Repulsion size", 50, 150, 100, 25, 100, resolutionSlider.pos().y+60);
	gravitySlider = new Slider("Gravity", 0.01, 0.5, 0.2, 0.01, 100, repulsionSizeSlider.pos().y+60);
	airDragSlider = new Slider("Air drag", 0.95, 1, 0.995, 0.005, 100, gravitySlider.pos().y+60);
	massSlider = new Slider("Mass", 0.5, 3, 2, 0.5, 100, airDragSlider.pos().y+60);
	
 	resetScene();
}


function resetScene() {
	rigidBodies = [];
	
	let xCount = 40;
	let yCount = 20;
	
	for (i = 0; i < xCount; i++) {
		let rb = new RigidBody();

		for (j = 0; j < yCount; j++) {
			// Get position and add a new point.
			let x = map(i, 0, xCount, width/2 - 150, width/2 + 150);
			let y = map(j, 0, yCount, 100, 400);
			let newPoint = rb.addPoint(x, y);

			// Snap the first point, otherwise connect points with segments.
			if (rb.points.length == 1) {
				newPoint.snap = true;
			} else {
				rb.addSegment(rb.points[rb.points.length-2], newPoint);
			}
		}

		rigidBodies.push(rb);
	}
}


function draw() {
  background(200);
  
	for (let i = 0; i < rigidBodies.length; i++) {
		// Sim a line.
		rigidBodies[i].sim();
		
		// Draw a line.
		if (i < rigidBodies.length-1) {
			noFill();
			stroke(0);
			strokeWeight(thicknessSlider.value());
			
			// Draw many 'fake' lines that follow between the current and next lines, which are part of the sim.
			// This will increase its volume to look fuller without extra calculations.
			let resolution = map(resolutionSlider.value(), 0, 1, 1, 0.05);
			
			for (let weight = 0.0; weight < 1.0; weight+=resolution) {
				beginShape();
				for (let j = 0; j < rigidBodies[i].points.length; j++) {
					let x = lerp(rigidBodies[i].points[j].pos.x, rigidBodies[i+1].points[j].pos.x, weight);
					let y = lerp(rigidBodies[i].points[j].pos.y, rigidBodies[i+1].points[j].pos.y, weight);
					vertex(x, y);
				}
				endShape();				
			}
		}
	}
	
	// Draw mouse area.
	stroke(0, 50);
	strokeWeight(repulsionSizeSlider.value()*2);
	point(mouseX, mouseY);
	
	// Display sliders.
	thicknessSlider.display();
	resolutionSlider.display();
	repulsionSizeSlider.display();
	gravitySlider.display();
	airDragSlider.display();
	massSlider.display();
}


function keyPressed() {
 	resetScene();
}