var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
var allParticles = [];
var jCount = 28;


function Particle(a, j, c) {
  this.c = c;
  this.a = a;
  this.j = j;
  this.x = 0;
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //colorMode(HSB, 255);
  noStroke();
  
  var i = 0;
  
  for (var j = 0; j < jCount; j++) {
    for (var a = 0; a < 360; a += 6) {
      let c;
      
      if (i % 4 == 0) {
        c = color(0, 255, 255);
      } else if (i % 2 == 0) {
        c = color(255, 0, 255);
      } else {
        c = color(255, 255, 0);
      }
      
      allParticles.push(new Particle(a, j, c));
      i++;
    }
  }
}


function draw() {
  background(0);
  
  translate(width/2,height*.48);rotate(R.ink);
  
  for (var i = 0; i < allParticles.length; i++) {
    var p = allParticles[i];
    
    push();
    
    var invert = 1;
    if (p.j % 2 == 0) {
      invert = -1;
    }
    
    rotate(radians(p.a+p.x)*invert);
    translate(map(p.j, 0, jCount, min(width,height)*.43, 5), 0);
    
    fill(p.c);
    
    var s = map(p.j, 0, jCount, 10, 1);
    if(R.mode%2)circle(0,0,s);else rect(0,0,s,s);
    
    var shift = map(p.j, 0, jCount, 0.5, 0.05);
    p.x += max(0,sin(p.j+frameCount*.05*R.rate)*shift)*R.sign;
    
    pop();
  }
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{};
R.down=()=>{};
R.move=()=>{R.ink+=(R.x-R.px)*.008;};
R.up=()=>{};
R.action=(a,v)=>{if(a==="reverse")R.sign*=-1;if(a==="marks")R.mode++;if(a==="tempo")R.rate=+v;};


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
