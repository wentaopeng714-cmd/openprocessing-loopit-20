// Particle Plotter, Vamoss, based on Felix Auer's differential equations.
// Source https://openprocessing.org/sketch/751983 · CC BY-SA 3.0.
// Added: paper/pigment rendering, deliberate fields, lasting ink, gesture brush and undo.
let blobs=[],colors,variation=11,xScale,yScale,centerX,centerY;
let pigment='coral',undoFrames=[],emitted=0;
const palettes={coral:['#ad4a37','#e87752','#b99857','#537f79','#343a36'],ink:['#122e34','#315a68','#669097','#b58459','#202925']};
function setup(){
 const c=createCanvas(Math.min(1000,window.innerWidth),Math.min(1100,window.innerHeight));c.parent('canvas-container');pixelDensity(1);frameRate(60);
 xScale=width/18;yScale=xScale;centerX=width/2;centerY=height/2;
 colors=palettes[pigment].map(x=>color(x));clearPaper();Studio.attach(c.elt,width,height);
 Studio.onDown=p=>{saveUndo();const ox=centerX,oy=centerY;centerX=p.x;centerY=p.y;for(const b of blobs){b.x+=(ox-centerX)/xScale;b.y+=(oy-centerY)/yScale;}emit(p,70);Studio.hint('The pigment keeps unfolding. Hold your brush to grow a new rosette.');};
 Studio.onMove=p=>emit(p,Math.min(30,10+Math.hypot(p.dx,p.dy)));
 Studio.onTool=name=>{if(name==='undo'){if(undoFrames.length){drawingContext.putImageData(undoFrames.pop(),0,0);blobs=[];}return}
 if(palettes[name]){pigment=name;colors=palettes[name].map(x=>color(x));Studio.select('palette',name)}else{variation={petal:11,orbit:7,tide:3}[name]??11;Studio.select('field',name);Studio.hint('New strokes follow the '+name+' field. Earlier ink stays on the paper.');}};
 Studio.onReset=()=>{saveUndo();blobs=[];clearPaper()};
 // A small initial hand-painted composition, never a replacement for input.
 for(let k=0;k<8;k++){const a=k/8*TWO_PI;emit({x:width*.5+cos(a)*width*.13,y:height*.46+sin(a)*width*.13,dx:0,dy:0,pressure:.3},80);}
}
function clearPaper(){background('#eae6dc');const ctx=drawingContext;ctx.save();ctx.fillStyle='#334036';ctx.globalAlpha=.045;for(let i=0;i<width*height/85;i++)ctx.fillRect(Math.random()*width,Math.random()*height,.7,.7);ctx.restore();}
function saveUndo(){if(undoFrames.length>=5)undoFrames.shift();undoFrames.push(drawingContext.getImageData(0,0,width,height));}
function emit(p,count){
 const speed=Math.hypot(p.dx,p.dy),spread=Math.max(3,Math.min(width*.14,55+speed));
 for(let i=0;i<count;i++){const a=random(TWO_PI),r=random(spread),x=p.x+cos(a)*r,y=p.y+sin(a)*r;blobs.push({x:getXPos(x),y:getYPos(y),xSpeed:0,ySpeed:0,size:random(.25,.9)*(1+speed*.005),lastX:x,lastY:y,color:colors[(emitted++)%colors.length],direction:random(.3,1)*(random()>.5?1:-1),life:random(140,360)});}
 if(blobs.length>2200)blobs.splice(0,blobs.length-2200);
}
function draw(){
 if(Studio.paused||Studio.suspended)return;
 for(const p of Studio.hands.values())emit(p,12);
 const length=blobs.length;
	var stepsize = Math.min(deltaTime,35)*0.003;
	for(var i = length-1; i >= 0; i--){
		let blob = blobs[i];

		var x = blob.x;
		var y = blob.y;

		var k1x = getSlopeX(x,y);
		var k1y = getSlopeY(x,y);

		var k2x = getSlopeX(x + blob.direction * stepsize * k1x, y + blob.direction * stepsize * k1y);
		var k2y = getSlopeY(x + blob.direction * stepsize * k1x, y + blob.direction * stepsize * k1y);

		var k3x = getSlopeX(x + blob.direction * stepsize * k2x, y + blob.direction * stepsize * k2y);
		var k3y = getSlopeY(x + blob.direction * stepsize * k2x, y + blob.direction * stepsize * k2y);

		var k4x = getSlopeX(x + blob.direction * 2*stepsize * k3x, y + blob.direction * 2*stepsize * k3y);
		var k4y = getSlopeY(x + blob.direction * 2*stepsize * k3x, y + blob.direction * 2*stepsize * k3y);

		blob.xSpeed = blob.direction * stepsize/3*(k1x+2*k2x+2*k3x+k4x);
		blob.ySpeed = blob.direction * stepsize/3*(k1y+2*k2y+2*k3y+k4y);
		
		blob.x += blob.xSpeed;
		blob.y += blob.ySpeed;
		
		x = getXPrint(blob.x);
		y = getYPrint(blob.y);
		stroke(blob.color);
		strokeWeight(blob.size * Math.min(1,blob.life/90));
		if(Math.hypot(x-blob.lastX,y-blob.lastY)<65)line(x, y, blob.lastX, blob.lastY);
		blob.lastX = x;
		blob.lastY = y;
		
		const border = 60;
        blob.life--;
		if(blob.life<0 || !Number.isFinite(x+y) || x < -border || y < -border || x > width+border || y > height+border){
			blobs.splice(i,1);
		}
	}
}

function getSlopeY(x, y){
	switch(variation){
		case 0:return Math.sin(x);
		case 1:return Math.sin(x*5)*y*0.3;
		case 2:return Math.cos(x*y);
		case 3:return Math.sin(x)*Math.cos(y);
		case 4:return Math.cos(x)*y*y;
		case 5:return Math.log(Math.max(.001,Math.abs(x)))*Math.log(Math.max(.001,Math.abs(y)));
		case 6:return Math.tan(x)*Math.cos(y);
		case 7:return -Math.sin(x*0.1)*3;//orbit
		case 8:return (x-x*x*x)*0.01;//two orbits
		case 9:return -Math.sin(x);
		case 10:return -y-Math.sin(1.5*x) + 0.7;
		case 11:return Math.sin(x)*Math.cos(y);
	}
}
	
function getSlopeX(x,y){
	switch(variation){
		case 0:return Math.cos(y);
		case 1:return Math.cos(y*5)*x*0.3;
		case 2: 
		case 3: 
		case 4: 
		case 5: 
		case 6:return 1;
		case 7:return Math.sin(y*0.1)*3;//orbit
		case 8:return y/3;//two orbits
		case 9:return -y;		
		case 10:return -1.5*y;
		case 11:return Math.sin(y)*Math.cos(x);
	}
}

function getXPos(x){
	return (x-centerX)/xScale;
}
function getYPos(y){
	return (y-centerY)/yScale;
}

function getXPrint(x){
	return xScale*x+centerX;
}
function getYPrint(y){
	return yScale*y+centerY;
}






