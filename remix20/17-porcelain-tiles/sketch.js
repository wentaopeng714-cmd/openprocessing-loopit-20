var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: mySketch
/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/744884

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//Original inspiration
//https://twitter.com/AidaInma/status/1161205965305393154

const radius = 55;
const altitude = Math.sqrt(3)/2 * radius;
let hexagons, hexagonPattern, rotations;
let changed = -1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	let hexagonMask = createGraphics(radius*2, radius*2);
	hexagonMask.beginShape();
	for(let a = 0; a < TWO_PI; a+=TWO_PI/6){
		let x = sin(a) * radius + radius;
		let y = cos(a) * radius + radius;
		hexagonMask.vertex(x, y);
	}
	hexagonMask.endShape();
	
	let hexagonLines = createGraphics(radius*2, radius*2);
	hexagonLines.noFill();hexagonLines.stroke("#254e67");
	hexagonLines.strokeWeight(20);
	hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
	hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
	hexagonLines.ellipse(radius + altitude, radius + radius * 1.5, radius * 3, radius * 3);
	hexagonLines.strokeWeight(16);
	hexagonLines.stroke("#faf3e4");
	hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
	hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
	hexagonLines.ellipse(radius + altitude, radius + radius * 1.5, radius * 3, radius * 3);
	
	hexagonPattern = createGraphics(radius*2, radius*2);
	hexagonPattern.image(hexagonMask, 0, 0);
	hexagonPattern.drawingContext.globalCompositeOperation="source-in";
	hexagonPattern.image(hexagonLines, 0, 0);
	
	rotations = [];
	hexagons = [];
	for(let x = - radius; x < width; x += altitude * 2){
		let rowCount = 0;
		for(let y = - radius; y < height; y += radius * 1.5){
			hexagons.push({
				x: x + (rowCount%2==0 ? 0 : altitude),
				y: y,
				rotation: 0
			});
			rotations.push(TWO_PI / 6 * floor(random(6)));
			rowCount++;
		}
	}
}

function draw() {
	background("#faf3e4");
	hexagons.forEach((hexagon, index) => {
		hexagon.rotation += (rotations[index] - hexagon.rotation) * 0.09; 
		push();
			translate(hexagon.x + radius, hexagon.y + radius);
			rotate(hexagon.rotation);
			translate(- (hexagon.x + radius), - (hexagon.y + radius));
			image(hexagonPattern, hexagon.x, hexagon.y);
		pop();
	});
}

function findClosest(){
	let closest = 0;
	let closestDistance = 9999;
	hexagons.forEach((hexagon, index) => {
		let d = dist(mouseX, mouseY, hexagon.x + radius, hexagon.y + radius);
		if(d < closestDistance) {
			closestDistance = d;
			closest = index;
		}
	});
	return closest;
}

function mousePressed() {
	changed = findClosest();
	rotations[changed] += TWO_PI/6;
}

function mouseMoved() {
	let tempChanged = findClosest();
	if(changed != tempChanged){
		changed = tempChanged;
		rotations[changed] += TWO_PI/6;
	}
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{};
R.frame=()=>{};
R.down=()=>{changed=findClosest();rotations[changed]+=TWO_PI/6;};
R.move=()=>{let j=findClosest();if(j!==changed){changed=j;rotations[j]+=TWO_PI/6;}};
R.up=()=>{};
R.action=(a,v)=>{if(a==="wave")rotations=rotations.map(r=>r+TWO_PI/6);if(a==="shuffle")rotations=rotations.map(()=>TWO_PI/6*floor(random(6)));if(a==="palette"){R.palette++;document.querySelector("canvas").style.filter=R.palette%2?"sepia(.7) hue-rotate(320deg)":"none";}};


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

R.resize=(ox,oy)=>{hexagons=[];rotations=[];for(let x=-radius;x<width;x+=altitude*2){let row=0;for(let y=-radius;y<height;y+=radius*1.5){hexagons.push({x:x+(row%2?altitude:0),y,rotation:0});rotations.push(TWO_PI/6*floor(random(6)));row++;}}};
