var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: point.js
function Point(x, y) {
	
  this.oldPos = new p5.Vector(x, y);
  this.pos = new p5.Vector(x, y);
  this.forces = new p5.Vector();
  this.snap = false;
  
  this.applyForce = function(force) {
		force.mult(massSlider.value());
    this.forces.add(force);
  }
  
  this.sim = function() {
		// Snapped points don't need to sim.
    if (this.snap) {
			return;
		}
		
		// Add gravity.
		let gravity = new p5.Vector(0, gravitySlider.value());
		this.applyForce(gravity);

		// Use mouse as a repulsion body to push the point away.
		let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
		if (d < repulsionSizeSlider.value()) {
			let repulse = this.pos.copy();
			repulse.sub(new p5.Vector(mouseX, mouseY));
			repulse.normalize();
			//repulse.mult(0.5);
			this.applyForce(repulse);
		}

		// Get the new velocity.
		let velocity = this.pos.copy();
		velocity.sub(this.oldPos);
		velocity.add(this.forces);
		
		// Add air drag so it can settle.
		velocity.mult(airDragSlider.value());

		// Limiting the velocity helps keep it stable.
		velocity.limit(15);

		// Move the point.
		this.oldPos.set(this.pos);
		this.pos.add(velocity);
		this.forces.mult(0);
  }
}

// Original tab: rigidBody.js
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

// Original tab: segment.js
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

// Original tab: sketch.js
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

var timesteps = 10;
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
	
	let xCount = 24;
	let yCount = 18;
	
	for (i = 0; i < xCount; i++) {
		let rb = new RigidBody();

		for (j = 0; j < yCount; j++) {
			// Get position and add a new point.
			let x = map(i, 0, xCount, width*.15,width*.85);
			let y = map(j, 0, yCount, height*.23,height*.62);
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
  background("#e9e0d4");
  
	for (let i = 0; i < rigidBodies.length; i++) {
		// Sim a line.
		rigidBodies[i].sim();
		
		// Draw a line.
		if (i < rigidBodies.length-1) {
			noFill();
			stroke(R.palette%2?"#34474e":"#79564a");
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
	strokeWeight(0);
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

// Original tab: slider.js
// Displays the slider's label and value.
function Slider(label, minValue, maxValue, defaultValue, steps, posx, posy) {
  
  this.label = label;
  this.slider = createSlider(minValue, maxValue, defaultValue, steps);
  this.slider.position(posx, posy);
  
  this.display = function() {
    var sliderPos = this.slider.position();
    
    noStroke();
    fill(0);
    textSize(15);
    text(this.label, sliderPos.x, sliderPos.y-10);

    fill(255, 0, 0);
    text(this.slider.value(), sliderPos.x+this.slider.width+10, sliderPos.y+10);
  }
  
  this.pos = function() {
    return this.slider.position();
  }
  
  this.value = function() {
    return this.slider.value();
  }
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{[thicknessSlider,resolutionSlider,repulsionSizeSlider,gravitySlider,airDragSlider,massSlider].forEach(s=>s.display=()=>{});gravitySlider.slider.value(.15);resolutionSlider.slider.value(.55);};
R.frame=()=>{if(R.pressed&&R.mode%2){let best=null,bd=1e9;rigidBodies.forEach(rb=>rb.points.forEach(p=>{let d=dist(p.pos.x,p.pos.y,R.x,R.y);if(!p.snap&&d<bd){best=p;bd=d}}));if(!R.grabbed&&bd<65)R.grabbed=best;if(R.grabbed){R.grabbed.pos.set(R.x,R.y);R.grabbed.oldPos.set(R.x,R.y);}}};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{R.grabbed=null;};
R.action=(a,v)=>{if(a==="grab")R.mode++;if(a==="palette")R.palette++;if(a==="seed")resetScene();if(a==="weight")gravitySlider.slider.value(+v);};


const originalSetup=setup,originalDraw=draw;
setup=function(){pixelDensity(1);const cc=window.createCanvas;window.createCanvas=(w,h,...args)=>cc(windowWidth,windowHeight,...args);originalSetup();window.createCanvas=cc;R.x=width*.5;R.y=height*.48;R.px=R.x;R.py=R.y;R.init();
 const c=document.querySelector('canvas');c.setAttribute('aria-label','Interactive artwork');c.style.touchAction='none';
 document.querySelectorAll('body > input,body > button').forEach(e=>e.hidden=true);
 const sync=e=>{const b=c.getBoundingClientRect();R.x=(e.clientX-b.left)*width/b.width;R.y=(e.clientY-b.top)*height/b.height;mouseX=R.x;mouseY=R.y;pmouseX=R.px;pmouseY=R.py;};
 c.addEventListener('pointerdown',e=>{e.preventDefault();if(R.pointer!=null)return;R.pointer=e.pointerId;c.setPointerCapture?.(e.pointerId);sync(e);R.pressed=true;R.touched=true;R.held=0;R.px=R.x;R.py=R.y;mouseIsPressed=true;R.down();});
 c.addEventListener('pointermove',e=>{if(R.pointer!=null&&e.pointerId!==R.pointer)return;sync(e);R.touched=true;if(R.pressed)R.move();});
 const end=e=>{if(R.pointer!=null&&e.pointerId!==R.pointer)return;R.pressed=false;R.pointer=null;mouseIsPressed=false;R.up();};
 c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);c.addEventListener('lostpointercapture',end);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){R.pressed=false;R.pointer=null;mouseIsPressed=false;R.up();}});
 document.querySelectorAll('button[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='quiet'){document.body.classList.toggle('quiet');b.textContent=document.body.classList.contains('quiet')?'Show UI':'Hide UI';return;}if(a==='pause'){R.paused=!R.paused;b.textContent=R.paused?'Resume':'Pause';return;}R.action(a);if(b.dataset.toggle!==undefined){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');}});
 document.querySelectorAll('input[data-action]').forEach(i=>{i.addEventListener('input',()=>{R.action(i.dataset.action,i.value);const o=i.parentNode.querySelector('output');if(o)o.textContent=i.value;});});
};
draw=function(){if(R.paused)return;if(!R.touched){R.x=width*(.5+.22*Math.sin(frameCount*.013));R.y=height*(.48+.13*Math.cos(frameCount*.019));}mouseX=R.x;mouseY=R.y;pmouseX=R.px;pmouseY=R.py;mouseIsPressed=R.pressed;if(R.pressed)R.held++;R.frame();originalDraw();R.px=R.x;R.py=R.y;};
// Pointer Events own input; prevent p5 synthesised clicks from resetting the artwork.
mousePressed=()=>false;mouseReleased=()=>false;mouseClicked=()=>false;mouseMoved=()=>false;mouseDragged=()=>false;touchStarted=()=>false;touchMoved=()=>false;touchEnded=()=>false;keyPressed=()=>false;
windowResized=function(){const ox=width,oy=height;resizeCanvas(windowWidth,windowHeight);R.x=R.x/ox*width;R.y=R.y/oy*height;R.px=R.x;R.py=R.y;R.resize?.(ox,oy);};

R.resize=(ox,oy)=>{resetScene();};
