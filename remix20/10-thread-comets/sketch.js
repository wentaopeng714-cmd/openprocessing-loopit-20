var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: main.js
/*
Lines Brush

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
 
Controls:
	- Move the mouse to spawn particles.
	- Click to change colors.
*/

var particleLinesPerFrame = 3;
var particlesPerFrame = 2;

var colorScheme = [];
var particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
	newColorScheme();
}

function draw() {
	blendMode(BLEND);
	background(0);
	blendMode(SCREEN);
	
	let lastPos = new p5.Vector(pmouseX, pmouseY);
	let pos = new p5.Vector(mouseX, mouseY);
	
	// Calculate this frame's velocity.
	let vel = new p5.Vector(pos.x, pos.y);
	vel.sub(lastPos);
	
	// Spawn sparks.
	for (let i = 0; i < particlesPerFrame; i++) {
		if(R.pressed||!R.touched)particles.push(new Spark(pos.x,pos.y,vel.x,vel.y));
	}
	
	// Spawn particles lines.
	vel.normalize();
	for (let i = 0; i < particleLinesPerFrame; i++) {
		if(R.pressed||!R.touched)particles.push(new ParticleLine(pos.x,pos.y,vel.x,vel.y));
	}
	
	// Move, draw, and kill all particles.
	for (let i = particles.length - 1; i > -1; i--) {
		particles[i].move();
		particles[i].draw();
		
		if (particles[i].vel.mag() < 0.1) {
			particles.splice(i, 1);
		}
	}
}

function mouseClicked() {
	newColorScheme();
}

function newColorScheme() {
	colorMode(HSB, 255);
	
	colorScheme = [];
	let mainHue = random(255);
	let colorCount = 5;
	
	for (let i = 0; i < colorCount; i++) {
		colorScheme.push(
			color(
				constrain(mainHue + random(-20, 20), 0, 255), 
				map(i, 0, colorCount - 1, 255, 0), 
				255));
	}
	
	colorMode(RGB, 255);
}

// Original tab: particleLines.js
function ParticleLine(x, y, vx, vy) {
	this.startPos = new p5.Vector(x, y);
	this.pos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
	this.vel.mult(random(10));
	this.vel.rotate(radians(random(-25, 25)));
	this.mass = random(1, 30);
	this.airDrag = random(0.92, 0.98);
	this.colorIndex = int(random(colorScheme.length));
	
	this.move = function() {
		this.vel.mult(this.airDrag);
		this.pos.add(this.vel);
	}
	
	this.draw = function() {
		let mass=min(28,this.mass*this.vel.mag()*.24);
		let c = colorScheme[this.colorIndex];
		drawingContext.shadowColor = color(red(c), green(c), blue(c), 255 * this.vel.mag());
		drawingContext.shadowBlur = min(mass,9);

		stroke(red(c),green(c),blue(c),100);
		strokeWeight(mass);
		line(this.pos.x, this.pos.y, this.startPos.x, this.startPos.y);
	}
}

// Original tab: spark.js
function Spark(x, y, vx, vy) {
	this.pos = new p5.Vector(x, y);
	this.lastPos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
	this.vel.rotate(radians(random(-30, 30)));
	this.airDrag = random(0.8, 0.9);
	
	this.move = function() {
		this.lastPos.set(this.pos.x, this.pos.y);
		this.vel.mult(this.airDrag);
		this.pos.add(this.vel);
	}
	
	this.draw = function() {
		stroke(255 * this.vel.mag() * 0.2);
		strokeWeight(2);
		line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y);
	}
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{if(R.pressed&&R.held>20){R.px=R.x+cos(frameCount*.3)*8;R.py=R.y+sin(frameCount*.3)*8;pmouseX=R.px;pmouseY=R.py;}if(particles.length>420)particles.splice(0,particles.length-420);};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="palette")newColorScheme();if(a==="density")particleLinesPerFrame=+v;if(a==="burst")for(let k=0;k<100;k++){let d=p5.Vector.random2D().mult(12);particles.push(new Spark(width/2,height*.48,d.x,d.y));}};


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
