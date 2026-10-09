var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/624792

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//code for #genuary day 4 - Small areas of symmetry
//https://genuary2021.github.io/prompts#jan4

var prevPos = {}
var pos = {}
var dir = 1
var radius = 1
var angle = 0

function setup() {
	createCanvas(600, 600);
	background("#f4f0df");
	
	pos = {x: width/2, y: height/2}
	prevPos = {x: pos.x, y: pos.y}
}

function draw() {
	if(random() < 0.1) dir *= -1
	if(random() < 0.1) radius = random(1, 5)
	
	angle += 1/radius*dir*R.rate
	
	pos.x += cos(angle) * radius
	pos.y += sin(angle) * radius
	
	for(let rot = 0; rot < TWO_PI; rot += TWO_PI/[6,10,16][R.mode%3]){
		push()
			translate(R.cx,R.cy)
			rotate(rot)
			translate(-R.cx,-R.cy)
			stroke(R.palette%2?"#b4523f":"#276154");strokeWeight(.8);line(prevPos.x,prevPos.y,pos.x,pos.y)
		pop()
	}
	
	prevPos.x = pos.x
	prevPos.y = pos.y
	
	if(pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height){
		dir *= -1
		angle += PI * dir
	}
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{R.cx=width/2;R.cy=height*.48;pos={x:R.cx+30,y:R.cy};prevPos={...pos};R.rate=2;for(let k=0;k<1800;k++)originalDraw();};
R.frame=()=>{};
R.down=()=>{R.cx=R.x;R.cy=R.y;pos={x:R.x+20,y:R.y};prevPos={...pos};};
R.move=()=>{R.cx=R.x;R.cy=R.y;};
R.up=()=>{};
R.action=(a,v)=>{if(a==="folds")R.mode++;if(a==="palette")R.palette++;if(a==="clear")background("#f4f0df");if(a==="growth")R.rate=+v;};


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

R.resize=(ox,oy)=>{R.cx=width/2;R.cy=height*.48;pos={x:R.cx+30,y:R.cy};prevPos={...pos};background("#f4f0df");};
