var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
const PHI = (1 + Math.sqrt(5))/2; //golden ratio
let balls = [];
let gra;

function setup()
{
  createCanvas(windowWidth, windowHeight);
	/*
	gra = createGraphics(width, height);
  gra.noStroke();
  for (let i = 0; i < 300000; i++) {
    let x = random(width);
    let y = random(height);
    let s = noise(x*0.01, y*0.01)*2;
    gra.fill(40,40);
    gra.rect(x, y, s, s);
	}
	*/
	colorMode(HSB, 100);
	drawingContext.shadowBlur = 10;
	drawingContext.shadowColor = color(0, 10);
}


function draw()
{
  //background("#0C0024");
	background("#fff7f0");
  for (let i = balls.length - 1; i >= 0; i--)
  {
    const b = balls[i];
    b.move();
    b.display();
    if (b.isDead())  balls.splice(i,1);    
  }
  balls.push (new Ball(10, frameCount*PHI*TWO_PI)); 
	//image(gra,0,0);
}

///////////////////////


class Ball
{
  constructor(diam_, _angle)
  {
    this.center = createVector(R.x,R.y); 
    this.dir = createVector(cos(_angle), sin(_angle));
		this.pos = this.center.copy().add(this.dir.mult(1));
    this.diam = diam_;
		this.col=color(R.palette%2?95+random(-5,5):map(this.dir.heading(),-PI,PI,0,100),R.palette%2?45:80,95);
  }
  
  move()
  {
		this.pos.add(p5.Vector.mult(this.dir,R.rate));
		const d = dist(this.pos.x,this.pos.y, this.center.x,this.center.y);
		const s = min(width,height);
		
		if(d > s*0.4)this.diam = map(d,s*0.4,s*0.45,s*0.04,0,true);
		else if(d > s*0.3)this.diam = map(d,s*0.3,s*0.4,s*0.023,s*0.042,true);
		else this.diam = map(d,0,s*0.1,0,s*0.021,true);
  }
   
  display()
  {
		noStroke();
		fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.diam, this.diam);
  }
  
  isDead()
  {
    if (dist(this.pos.x,this.pos.y, this.center.x,this.center.y) > min(width,height)) return true;
    else return false;
  }
	
}



// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{if(R.pressed&&R.held>12)balls.push(new Ball(10,frameCount*PHI*TWO_PI+PI));if(balls.length>1200)balls.splice(0,balls.length-1200);};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="palette")R.palette++;if(a==="speed")R.rate=+v;if(a==="centre"){R.x=width/2;R.y=height*.48;R.touched=true;}};


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
