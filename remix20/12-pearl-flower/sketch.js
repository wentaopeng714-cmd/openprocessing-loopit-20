var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: main.js
/*
Repulsion

jasonlabbe3d.com
twitter.com/russetPotato
*/

var count = 500;
var spacing = 6;
var repulsionRadius = 100;
var particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	
	for (let i = 0; i < count; i++) {
		let angle = i * 137.5;
		let r = spacing * sqrt(i);
		let x = r * cos(radians(angle)) + width / 2;
		let y = r * sin(radians(angle)) + height / 2;
		let distToCenter = dist(x, y, width / 2, height / 2);
		let s = 255 - distToCenter * 1.25;
		let b = 150 + distToCenter * 1;
		
		particles.push(new Particle(
			random(width), -200, 
			x, y, 
			0.5,
			s, b));
	}
} 

function draw() {
  background("#ecf1eb");
	
	for (let i = 0; i < particles.length; i++) {
		particles[i].move();
		particles[i].display();
	}
	
	stroke(0, 50);
	strokeWeight(0);
	point(mouseX, mouseY);
}

// Original tab: particle.js
function Particle(x, y, targetX, targetY, maxForce, s, b) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
	this.target = new p5.Vector(targetX, targetY);
  this.maxForce = maxForce * random(0.8, 1.2);
	this.sat = s;
	this.bright = b;
  
  this.move = function() {
    let distThreshold = 20;
    
    let steer = new p5.Vector(this.target.x, this.target.y);
    let distance = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
		if (distance > 0.5) {
			steer.sub(this.pos);
			steer.normalize();
			steer.mult(map(min(distance, distThreshold), 0, distThreshold, 0, this.maxForce));
			this.acc.add(steer);
		}
    
		let mouseDistance = dist(this.pos.x, this.pos.y, mouseX, mouseY);
		if (mouseDistance < repulsionRadius) {
			let repulse = new p5.Vector(this.pos.x, this.pos.y);
			repulse.sub(mouseX, mouseY);
			repulse.mult(map(mouseDistance, 100, 0, 0, 0.5));
			this.acc.add(repulse);
		}
		
    this.vel.mult(0.95);
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.display = function() {
    strokeWeight(1);
    stroke(135,40,120,35);
    line(this.target.x, this.target.y, this.pos.x, this.pos.y);
    
    strokeWeight(6);
    stroke(R.palette%2?235:135,min(this.sat,110),min(this.bright,180));
    point(this.pos.x, this.pos.y);
  }
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{if(R.pressed&&R.held>25){particles.forEach((p,i)=>{let a=radians(i*137.5),r=spacing*sqrt(i);p.target.set(lerp(p.target.x,R.x+r*cos(a),.04),lerp(p.target.y,R.y+r*sin(a),.04));});}};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="burst")particles.forEach(p=>p.vel=p5.Vector.random2D().mult(18));if(a==="palette")R.palette++;if(a==="reach")repulsionRadius=+v;};


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

R.resize=(ox,oy)=>{particles.forEach((p,i)=>{let a=radians(i*137.5),r=spacing*sqrt(i);p.target.set(width/2+r*cos(a),height/2+r*sin(a));});};
