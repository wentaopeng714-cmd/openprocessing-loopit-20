var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: bob.js
function Bob(x, y) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
	this.vel.mult(random(0.1));
  this.acc = new p5.Vector(0, 0);
  this.drag = random(0.98, 0.99);
	this.hue = (globalHue + random(-40, 40)) % 255;
	this.bright = random(255);
	
  this.move = function() {
		// Add some air drag so it can eventually settle.
		this.vel.mult(this.drag);

    // Push it away from the mouse.
    let mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    let mouseThresh = R.amount;
    
    if (mouseDist < mouseThresh) {
      let push = new p5.Vector(this.pos.x, this.pos.y);
      push.sub(new p5.Vector(mouseX, mouseY));
      push.normalize();
      push.mult((mouseThresh-mouseDist)*.01*R.sign);
      this.acc.add(push);
    }
		
		// Move it.
		this.vel.add(this.acc);
		this.vel.limit(6);
		this.pos.add(this.vel);
		this.acc.mult(0);
		
		// Keep in bounds.
		if (this.pos.x < 0) {
			this.pos.x = 0;
			this.vel.x *= -1;
		} else if (this.pos.x > width) {
			this.pos.x = width;
			this.vel.x *= -1;
		}
		
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.vel.y *= -1;
		} else if (this.pos.y > height) {
			this.pos.y = height;
			this.vel.y *= -1;
		}
	}
	
}

// Original tab: sketch.js
/*
Particle sandbox

Controls:
	- Move the mouse around the interact with the particles.
	- Mouse click to reset the scene.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var bobCount = 1800;
var bobs = [];
var globalHue;


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	reset();
}


function draw() {
	for (let i = 0; i < bobs.length; i++) {
		let b = bobs[i];
		b.move();
		
		stroke(b.hue, b.bright, 255, max(35,b.vel.mag()*35));
		point(b.pos.x, b.pos.y);
	}
}


function mouseClicked() {
	reset();
}


function reset() {
	globalHue = random(255);
	
	bobs.splice(0, bobs.length);
	
	for (let i = 0; i < bobCount; i++) {
		bobs.push(new Bob(random(width), random(height)));
	}
	
	background(10);
	
	// Make sure mouse doesn't immediately effect particles.
	mouseX = -9999;
	mouseY = -9999;
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{R.amount=140;globalHue=105;reset();for(let j=0;j<100;j++){mouseX=width/2+sin(j*.1)*90;mouseY=height/2+cos(j*.1)*90;originalDraw();}};
R.frame=()=>{if(R.pressed&&R.held>25)R.sign=-1;};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{if(abs(R.x-R.px)+abs(R.y-R.py)>4)bobs.forEach(b=>{if(dist(b.pos.x,b.pos.y,R.x,R.y)<R.amount)b.vel.add((R.x-R.px)*.12,(R.y-R.py)*.12)});};
R.action=(a,v)=>{if(a==="force")R.sign*=-1;if(a==="reach")R.amount=+v;if(a==="seed")reset();if(a==="burst")bobs.forEach(b=>b.vel=p5.Vector.random2D().mult(random(3,6)));};


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
