var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: branch.js
// A branch's position is always relative to its parent.
function Branch(length, angle, level) {
	this.vel = 0;
	this.acc = 0
	this.level = level;
	this.angle = angle;
	this.restAngle = angle;
	this.length = length;
	this.children = [];
	this.leaves = [];
	count++;
	this.index = count;
	
	// Adds a new branch as a child.
	this.newBranch = function(angle, mult) {
		let newBranch = new Branch(this.length * mult, angle, this.level + 1)
		this.children.push(newBranch);
    return newBranch;
	}
	
	// Adds a new velocity to its acceleration.
	this.applyForce = function(force) {
    this.acc += force;
	}
	
	// Simulates its new angle.
	this.move = function() {
		// Add some weak wind so there's subtle motion when it's idle.
		let windMult = map(this.level, 0, maxLevel, 0.1, 1) * random(0.75, 1.25);
		let wind = noise((frameCount + this.index) * 0.005) * windMult;
		this.applyForce(wind);
		
		// Always have the angle chasing back to its rest pose.
		// This is what causes the branches to bounce.
		let angleThresh = 10;
		let spring = new p5.Vector(this.restAngle, 0);
		let distance = dist(this.angle, 0, this.restAngle, 0);
		let force = map(min(distance, angleThresh), 0, angleThresh, 0, branchForce);
		
		spring.sub(new p5.Vector(this.angle, 0));
		spring.normalize();
		spring.mult(force);
		this.applyForce(spring.x);
		
		// Slow down velocity with air drag.
		this.vel *= 0.95;
		
		// Add acceleration to velocity, and then to the angle.
		this.vel += this.acc;
		this.angle += this.vel;
		this.angle = constrain(this.angle, this.restAngle - 45, this.restAngle + 45);  // Limit how far its angle can bend, otherwise it could spin!
		this.acc = 0;
	}
}

// Original tab: main.js
/*
T-Virus

Recursively creates `branches` that uses dynamics to drive their angles.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/


var maxLevel = 4; // The amount of nested branches it will subdivide to. More is slower!
var branchForce = 0.5; // The branch's resistance against the mouse. A lower value will make it feel sluggish, while a bigger value will make it spring-like.
var rootBranches = [];
var debug = false;
var count = 0;


function setup() {
	createCanvas(windowWidth, windowHeight);
  generateNewTree();
}


function draw() {
  background("#f0e5d7");
	
	push();
		translate(width / 2, height / 2);
		for (let i = 0; i < rootBranches.length; i++) {
			treeIterator(rootBranches[i],0,0,0);
		}
	
		stroke("#a34c3d");
		strokeWeight(10);
		point(0, 0);
	pop();
	
	fill(255);
	noStroke();
	
	void(
	"".concat(
		"Click to change to a new shape.\n",
		"Middle-click to toggle debug mode.\n",
		"Move the mouse over to interact with it.\n",
		"\n",
		"Debug mode: ", debug), 
	50, 50);
}


function mousePressed() {
	if (mouseButton == CENTER) {
		debug = !debug;
	} else {
		generateNewTree();
	}
}

// Original tab: utils.js
// Takes a branch and spawns new children branches that will come from it.
// This is a recursive function that makes up the tree's structure.
function subDivide(branch) {
  let newBranches = [];
  let newBranchCount = int(random(1, 4));
  let minLength = 0.7;
  let maxLength = 0.85;
  
	// The angles will change depending on how many new branches will be created.
	// This will allow the tree to have more natural looking angles than being random.
  if (newBranchCount == 2) {
		newBranches.push(branch.newBranch(random(-45.0, -10.0), random(minLength, maxLength)));
		newBranches.push(branch.newBranch(random(10.0, 45.0), random(minLength, maxLength)));
	} else if (newBranchCount == 3) {
		newBranches.push(branch.newBranch(random(-45.0, -15.0), random(minLength, maxLength)));
		newBranches.push(branch.newBranch(random(-10.0, 10.0), random(minLength, maxLength)));
		newBranches.push(branch.newBranch(random(15.0, 45.0), random(minLength, maxLength)));
	} else {
		newBranches.push(branch.newBranch(random(-45.0, 45.0), random(minLength, maxLength)));
  }
	
	// If the new branches haven't reach the max level yet then spawn new branches from them.
  for (let i = 0; i < newBranches.length; i++) {
    if (newBranches[i].level < maxLevel) {
      subDivide(newBranches[i]);
    }
  }
}


// Creates a new tree. The first branch is always vertical in the scene's center.
function generateNewTree() {
	rootBranches = [];
	for (let a = 0; a < 360; a+=12) {
		let newBranch = new Branch(random(min(width,height)*.035,min(width,height)*.12), a, 0)
		rootBranches.push(newBranch);
		subDivide(newBranch);
	}
}


// A recursive function to display the tree.
// It uses `push` and `pop` so that we don't have to deal with actual positions.
// Instead we only care about a branch's length and angle so that we can position them relatively.
function treeIterator(branch, worldX, worldY, worldA) {
	// Even though `push` and `pop` will help *display* the tree, we still need a means to interact with it.
	// So to interact with the mouse, we must keep track of the current branch's world position/rotation.
	worldA += branch.angle;
	
	let vec = new p5.Vector(branch.length, 0);
	vec.rotate(radians(worldA));
	
	worldX += vec.x;
	worldY += vec.y;
	
	push();
		stroke(lerpColor(color(R.palette%2?"#164e46":"#863529"),color("#d9a685"),branch.level/(maxLevel+1)));
		strokeWeight(maxLevel - branch.level + 1);
		
		// Push the branch if it's within distance of the mouse.
		let d = dist(mouseX, mouseY, worldX + width / 2, worldY + height / 2);
		let distThresh = 300;
		if (d < distThresh) {
			let force = map(d, 0, distThresh, 1.5, 0);  // Closer branches will be pushed more.
			
			// Reverse angle depending on mouse position.
			if (mouseX > worldX + width / 2) {
				force *= -1;
			}

			// Lower branches have greater resistance.
			force *= map(branch.level, 0, maxLevel, 0.2, 1);
			branch.applyForce(force);
			
			// While we're here, we can visualize if this branch is being pushed.
			if (debug) {
				stroke(255, 0, 0);
			}
		}
	
		// Simulate branch.
		branch.move();
	
		rotate(radians(branch.angle));
		
		// Draw branch.
		line(0, 0, branch.length, 0);
	
		if (debug) {
			// Draw debug points.
			if (d < 200) {
				stroke(0, 255, 0);
				strokeWeight(5);
				point(0, 0);
			}
		}
	
		translate(branch.length, 0);
		
		// Continue iterating to children branches, and pass world values.
		for (let i = 0; i < branch.children.length; i++) {
			treeIterator(branch.children[i], worldX, worldY, worldA);
		}
	pop();
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="seed")generateNewTree();if(a==="palette")R.palette++;if(a==="spring")branchForce=+v;};


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

R.resize=(ox,oy)=>{generateNewTree();};
