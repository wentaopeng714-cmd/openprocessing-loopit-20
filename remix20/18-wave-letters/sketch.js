var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
let textToWrite="slow days";
let frequency=.003;

//auto start variables
let centerX, centerY, startX, step, amplitude;

function setup() {
	createCanvas(windowWidth, windowHeight);
	centerX = windowWidth/2;
	centerY = windowHeight/2;
	textFont("Georgia");textSize(min(64,width*.14));
	
	step = 0;
	startX = centerX - textWidth(textToWrite) / 2;
}

function getY(x){
	return centerY + noise(step, x * frequency) * amplitude;
}

function draw() {
	background("#f4dfb8");
  
	//for calculating the noise in getY function
	step += 0.01;
	centerY=lerp(centerY,R.mode%2?height*.6:mouseY+80,.035);amplitude=-(100+abs(mouseX-width/2)*.6);
	
	//draw liquid
	fill(R.palette%2?"#405c50":"#a44936");
	beginShape();
	vertex(0, height);
	for(let x = 0; x < width; x += 20){
		vertex(x, getY(x));
	}
	vertex(width, height);
	endShape(CLOSE);
	
	//draw text
	fill(R.palette%2?"#405c50":"#a44936");
	let x = startX;
	for (var i = 0; i < textToWrite.length; i++) {
		let charWidth = textWidth(textToWrite.charAt(i));
		//calculate angle
		let prevX = x - 2;
		let prevY = getY(prevX);
		let y = getY(x);
		let angle = atan2(y - prevY, x - prevX);
		
		push();
			//apply angle
			translate(x+charWidth/2, y);
			rotate(angle);
			translate(-(x+charWidth/2), -y);
		
			//draw
			text(textToWrite.charAt(i), x, y);
		pop();
		x += charWidth;
	}//for
}

function mouseMoved(){
	startX = mouseX - textWidth(textToWrite) / 2;
}
	
	
	

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{};
R.down=()=>{};
R.move=()=>{startX=R.x-textWidth(textToWrite)/2;};
R.up=()=>{};
R.action=(a,v)=>{if(a==="palette")R.palette++;if(a==="float")R.mode++;if(a==="texture")frequency=+v;if(a==="word"){textToWrite=v.slice(0,14)||"breathe";startX=width/2-textWidth(textToWrite)/2;}};


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

R.resize=(ox,oy)=>{centerX=width/2;centerY=height*.55;textSize(min(64,width*.14));startX=centerX-textWidth(textToWrite)/2;};
