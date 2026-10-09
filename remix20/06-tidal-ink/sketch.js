var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
let pos, colors;
let moveSpeed = .6;
const moveScale = 800;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background("#162a25");
	noStroke();
	
	colors = [color("#77c39c"), color("#2f5e36"), color("#55aba5"), color("#2d7063"), color("#3f6829"), color("#44a872"), color("#215964"), color("#cdedae")];
	pos = [];
	for(let i = 0; i < 500; i++){
		pos.push({
			x:random(width),
			y:random(height),
			c:colors[floor(random(colors.length))]
		});
	}
}

function draw() {
	for(let i = 0; i < pos.length; i++){
		with(pos[i]){
			let angle=noise(x/moveScale,y/moveScale)*TWO_PI*moveScale;if(R.pressed&&dist(x,y,mouseX,mouseY)<120)angle+=atan2(y-mouseY,x-mouseX)+HALF_PI;//I never understood why end by multiplying by moveScale
			x += cos(angle) * moveSpeed;
			y += sin(angle) * moveSpeed;
			fill(c);
			ellipse(x, y, 2, 2);
			if(x > width || x < 0 || y > height || y < 0 || random(1) < 0.001 ){
				x = random(width);
				y = random(height);
			}
		}
	}
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{for(let j=0;j<180;j++)originalDraw();};
R.frame=()=>{};
R.down=()=>{};
R.move=()=>{if(R.mode%2){fill("#162a25");circle(R.x,R.y,64);}else{for(let k=0;k<8;k++)pos.push({x:R.x+random(-30,30),y:R.y+random(-30,30),c:random(colors)});if(pos.length>1600)pos.splice(0,8);}};
R.up=()=>{};
R.action=(a,v)=>{if(a==="speed")moveSpeed=+v;if(a==="erase")R.mode++;if(a==="clear")background("#162a25");if(a==="palette"){R.palette++;colors=(R.palette%2?["#ff784f","#e8ae66","#f6e8c8","#bf3d4e"]:["#77c39c","#55aba5","#cdedae"]).map(c=>color(c));pos.forEach(p=>p.c=random(colors));}};


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
