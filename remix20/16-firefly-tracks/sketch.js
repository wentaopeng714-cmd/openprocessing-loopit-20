var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: bob.js
function Bob(x, y, path) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
	this.path = path;
	this.direction = 1;
  this.vertIndex = 0;
	this.variance = random(0.9, 1.1);
  this.drag = random(0.98, 0.99);
	this.hue = (globalHue + random(-40, 40)) % 255;
	this.bright = random(255);
	this.mass = random(3,14);
	
  this.move = function() {
		// If its velocity didn't exceed the threshold then seek its target.
		let target = this.path.vertices[this.vertIndex];
		let targetDist = dist(this.pos.x, this.pos.y, target.x, target.y);

		let proximityMult = 1;

		// Slow it down the closer it gets to its target.
		let distThresh = 16;
		if (targetDist < distThresh) {
			//proximityMult = targetDist / distThresh;
			
			if ((this.direction == 1 && this.vertIndex == this.path.vertices.length - 1) || 
				  (this.direction == -1 && this.vertIndex == 0)) {
				this.direction *= -1;
			}
			this.vertIndex += this.direction;
		}

		// Add some friction so it can eventually settle.
		this.vel.mult(this.drag);

		// Seek its target.
		if (targetDist > 1) {
			let steer = new p5.Vector(target.x, target.y);
			steer.sub(this.pos);
			steer.normalize();
			steer.mult(.1*this.variance*proximityMult*R.rate);
			this.acc.add(steer);
		}

		// Move it.
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}
	
}

// Original tab: path.js
function Path() {
	
	this.vertices = [];
	
	let count = 6;
	for (let i = 0; i < count; i++) {
		let x = map(i, 0, count, width / 4, width - width / 4);
		let y = random(100, height - 100);
		this.vertices.push(new p5.Vector(x, y))
	}
	
}

// Original tab: sketch.js
/*
Steering path following

Particles follow a path by seeking out its vertices one by one.

Controls:
	- Click to reset to new values.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var mainPath;
var bobs = [];
var globalHue;


function setup() {
	createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 255);
	
	reset();
}


function reset() {
	globalHue = random(255);
	
	mainPath = new Path();
	
	bobs.splice(0, bobs.length);
	
	for (let i = 0; i < 900; i++) {
		let rot = p5.Vector.random2D();
		rot.mult(random(250));
		
		let x = mainPath.vertices[0].x + rot.x;
		let y = mainPath.vertices[0].y + rot.y;
		
		bobs.push(new Bob(x, y, mainPath));
	}
}


function mouseClicked() {
	reset();
}


function draw() {
	background(10);
	
	for (let i = 0; i < mainPath.vertices.length; i++) {
		let v = mainPath.vertices[i];
		
		if (i < mainPath.vertices.length - 1) {
			let v2 = mainPath.vertices[i + 1];
			stroke(R.mode%2?10:55);
			strokeWeight(0.5);
			line(v.x, v.y, v2.x, v2.y);
		}
		
		stroke(R.mode%2?10:55);
		strokeWeight(5);
		point(v.x, v.y);
	}
	
	for (let i = 0; i < bobs.length; i++) {
		let b = bobs[i];
		b.move();
		
		stroke(b.hue, b.bright, 255, 70);
		strokeWeight(b.mass);
		point(b.pos.x, b.pos.y);
	}
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{};
R.down=()=>{R.route=[createVector(R.x,R.y)];};
R.move=()=>{if(R.route&&dist(R.x,R.y,R.route[R.route.length-1].x,R.route[R.route.length-1].y)>15)R.route.push(createVector(R.x,R.y));};
R.up=()=>{if(R.route?.length>1){mainPath.vertices=R.route;bobs.forEach(b=>{b.vertIndex=0;b.direction=1;});}R.route=null;};
R.action=(a,v)=>{if(a==="seed")reset();if(a==="guide")R.mode++;if(a==="palette"){globalHue=random(255);bobs.forEach(b=>b.hue=(globalHue+random(-25,25))%255);}if(a==="speed")R.rate=+v;};


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

R.resize=(ox,oy)=>{mainPath.vertices.forEach(p=>{p.x=p.x/ox*width;p.y=p.y/oy*height});bobs.forEach(b=>{b.pos.x=b.pos.x/ox*width;b.pos.y=b.pos.y/oy*height});};
