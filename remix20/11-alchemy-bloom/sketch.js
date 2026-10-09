var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
/*
Alchemist's brush

Spawns puffs of smoke that would make Harry Potter proud.

Controls:
	- Click and drag to create particles.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var particles = [];
var globalHue = 200;
var inverse = false;

function Particle(x, y) {
  
  this.pos = new p5.Vector(x, y);
  this.life = 1.0;
  this.lifeRate = random(0.005, 0.02);
  this.angle = map(cos(radians(frameCount*5)), -1, 1, -180, 180);
  this.hue = globalHue;
  this.maxScale = max(0.25, abs(sin(radians(frameCount*5))*1.5));
  this.rotateRate = random(-200, 200);
  this.maxOffset = random(50,300)*R.amount;
  
  this.display = function() {
    var offset = map(this.life, 1, 0, 0, this.maxOffset); // Pushes out along x axis.
    
    // Scales from particle's origin pivot.
    var s;
    if (inverse) {
      s = map(this.life, 1, 0, 0, this.maxScale);
    } else {
      s = map(this.life, 1, 0, this.maxScale, 0);
    }
    
    var t = map(this.life, 1, 0, 0, 1); // Represents the time of the particle's life.
    
    var opacity = map(this.life, 1, 0, 255, 0);
    
    strokeWeight(5);
    stroke(color(this.hue, 255, 200, opacity*0.5)); // Show stroke slightly darker.
    fill(color(this.hue, 255, 255, opacity*0.8));
    
    push();
    
    // Creates a spiral motion.
    translate(this.pos.x, this.pos.y);
    rotate(radians(this.angle+t*this.rotateRate));
    scale(s);
    
    ellipse(offset, 0, 20, 20);
    
    pop();
    
    this.life -= this.lifeRate;
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  colorMode(HSB, 255);
  
  textAlign(CENTER);
  textSize(14);
  
  background(0);
}


function mousePressed() {
  globalHue = random(0, 255);
}


function mouseDragged() {
  for (var i = 0; i < 5; i ++) {
  	particles.push(new Particle(mouseX, mouseY));
  }
  
  globalHue += 0.1;
  if (globalHue > 255) {
    globalHue = 0;
  }
}


function keyPressed() {
  inverse = ! inverse;
}


function draw() {
  noStroke();
  fill(0, 100);
  rect(0, 0, width*2, height*2);
  
  for (var i = particles.length-1; i > -1; i--) {
    particles[i].display();
    
    if (particles[i].life < 0) {
      particles.splice(i, 1);
    }
  }
  
  noStroke();
  fill(255);
  // Instructions moved into HTML.
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{R.amount=.8;};
R.frame=()=>{if(R.pressed||!R.touched){for(let k=0;k<3;k++)particles.push(new Particle(mouseX,mouseY));globalHue=(globalHue+.15)%255;}};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="inverse")inverse=!inverse;if(a==="palette")globalHue=random(255);if(a==="scale")R.amount=+v;if(a==="clear"){particles=[];background(0);}};


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
