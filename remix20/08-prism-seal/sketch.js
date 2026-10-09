var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
function setup() {
	createCanvas(1112, 834);
	rectMode(CENTER);
	colorMode(HSB,360,100,100,1);angleMode(DEGREES);background("#f4eee4");
	//loop();
}

function draw() {
	translate(width / 2, height / 2);
	stroke(220, 100, 100, 0.7);
	
	// how many slices of cake
	// change this!
	var pieces = [6,12,24][R.mode%3];
	
	if(R.pressed||!R.touched)for(let a=0;a<360;a+=360/pieces)my_shapes(a);
	
}


function my_shapes(angle) {
	
	push();
	rotate(angle);
	
	// distance
	var d = dist(mouseX, mouseY, width/2, height/2);
	fill(d, 100, 100, 0.5);
	stroke(360 - d%360, 50, 100, 0.8);
	
	circle(mouseX - width / 2, mouseY - height / 2, min(R.amount*100/max(d,12),60));
	
	pop();
	
}

function mousePressed(){
  save('pix.jpg');
}



// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{R.amount=14;for(let k=0;k<130;k++){mouseX=width/2+cos(k*3)*width*.22;mouseY=height*.48+sin(k*3)*width*.22;push();originalDraw();pop();}};
R.frame=()=>{if(R.pressed&&R.held>20){R.x+=sin(frameCount*.08)*.8;R.y+=cos(frameCount*.08)*.8;mouseX=R.x;mouseY=R.y;}};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="slices")R.mode++;if(a==="size")R.amount=+v;if(a==="paper"){R.palette++;background(R.palette%2?"#100f21":"#f4eee4");}if(a==="clear")background(R.palette%2?"#100f21":"#f4eee4");};


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
