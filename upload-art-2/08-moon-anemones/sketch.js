
// Sea creatures by Jason Labbe: each radial rope is a chain of spring pendulums.
// Original spring/gravity simulation retained; underwater pigment and touch input added.
let airDragSlider={value:()=>.12},gravitySlider={value:()=>.44},elasticitySlider={value:()=>.12},frizzSlider={value:()=>.62};
let creatures=[],marineTime=0,marineSkin='reef',marineMode='drift';
// Seeks after a target and creates a spring effect.
function Spring(x, y, maxForce) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.target = new p5.Vector(x, y);
  this.maxForce = maxForce;
  
  this.move = function() {
    var distThreshold = 20;
    
    // Move towards the target.
    var push = new p5.Vector(this.target.x, this.target.y);
    var distance = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    var force = map(min(distance, distThreshold), 0, distThreshold, 0, this.maxForce);
    push.sub(this.pos);
    push.normalize();
    push.mult(force);
    this.acc.add(push);
    
    // Add air-drag.
    this.vel.mult(1-airDragSlider.value());
    
    // Move it.
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.display = function() {
    strokeWeight(5);
    stroke(0, 255, 0);
    point(this.pos.x, this.pos.y);
  }
}// Attaches to another object and acts as a bouncy pendulum.
function Pendulum(a, x, y, parent) {
  
  this.a = a;
  this.chaos = random(0.5, 1.5);
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.mass = 2;
  this.parent = parent;
  
  this.restLength = p5.Vector.dist(this.pos, this.parent.pos);
  
  this.move = function() {
    var frizz = map(frizzSlider.value(), 0, 1, 1, this.chaos);
    
    // Push down with gravity.
    var gravity = new p5.Vector(cos(radians(this.a)), sin(radians(this.a)));
    gravity.mult(gravitySlider.value());
    gravity.mult(frizz);
    gravity.div(this.mass);
    this.acc.add(gravity);
    
    // Add air-drag.
    this.vel.mult(1-airDragSlider.value());
    this.vel.limit(5);
    
    // Move it.
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Adjust its spring.
    var currentLength = p5.Vector.dist(this.pos, this.parent.pos);
    
    var spring = new p5.Vector(this.pos.x, this.pos.y);
    spring.sub(this.parent.pos);
    spring.normalize();
    
    var stretchLength = currentLength-this.restLength;
    spring.mult(-elasticitySlider.value()*stretchLength);
    spring.div(this.mass);
    this.acc.add(spring);
  }
  
  this.display = function() {
    if (this.parent != null) {
      strokeWeight(0.5);
      stroke(255, 0, 0);
      line(this.parent.pos.x, this.parent.pos.y, this.pos.x, this.pos.y);
    }
    
    strokeWeight(3);
    stroke(0, 255, 0);
    point(this.pos.x, this.pos.y);
  }
}
function seaRope(x,y,a,sc){this.objs=[new Spring(x,y,1)];this.a=a;for(let i=0;i<7;i++){const p=new Pendulum(a,x+cos(radians(a))*i*12*sc,y+sin(radians(a))*i*12*sc,this.objs[this.objs.length-1]);p.restLength=max(4,12*sc)*random(.7,1.25);this.objs.push(p)}}
function creature(x,y,sc){return {x,y,homeX:x,homeY:y,phase:random(1000),sc,ropes:Array.from({length:72},(_,i)=>new seaRope(x,y,i*5,sc))}}
function resetSea(){creatures=[creature(width*.44,height*.4,min(1.3,width/350)),creature(width*.65,height*.65,min(.85,width/490))];for(let k=0;k<85;k++)stepSea(false)}
function setup(){artCanvas();resetSea();Studio.onTool=n=>{if(n==='drift'||n==='gather'){marineMode=n;Studio.select('mode',n)}else if(n==='bloom'){if(creatures.length>=4)creatures.shift();creatures.push(creature(random(width*.25,width*.75),random(height*.3,height*.7),min(.9,width/430)))}else{marineSkin=n;Studio.select('palette',n)}};Studio.onReset=resetSea}
function stepSea(render){marineTime++;if(render){background(marineSkin==='reef'?'#061a23':'#21162f');const ctx=drawingContext;const g=ctx.createRadialGradient(width*.45,height*.4,0,width*.5,height*.5,height*.7);g.addColorStop(0,marineSkin==='reef'?'#173c46':'#3f264b');g.addColorStop(1,marineSkin==='reef'?'#020d19':'#100c20');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);noStroke();fill(150,209,200,28);for(let i=0;i<70;i++)circle((i*173.7+sin(marineTime*.007+i)*15)%width,(i*157.3-marineTime*.2+height*30)%height,1+i%3)}
 for(let ci=0;ci<creatures.length;ci++){const c=creatures[ci];let tx=c.homeX+sin(marineTime*.028+c.phase)*width*.11,ty=c.homeY+cos(marineTime*.023+c.phase)*height*.08;
 for(const p of Studio.hands.values())if(marineMode==='gather'&&dist(p.x,p.y,c.x,c.y)<220){tx=p.x;ty=p.y}
 c.x=lerp(c.x,tx,.085);c.y=lerp(c.y,ty,.085);
 for(let ri=0;ri<c.ropes.length;ri++){const rope=c.ropes[ri],root=rope.objs[0];root.target.set(c.x+cos(radians(rope.a))*8*c.sc,c.y+sin(radians(rope.a))*8*c.sc);for(const o of rope.objs){for(const p of Studio.hands.values()){let dx=o.pos.x-p.x,dy=o.pos.y-p.y,d=hypot(dx,dy);if(d>0&&d<90&&marineMode==='drift')o.acc.add(dx/d*(1-d/90)*1.9,dy/d*(1-d/90)*1.9)}o.move()}
 if(render){const hue=marineSkin==='reef'?(ci%2===0?[116,216,210]:[251,173,151]):(ci%2===0?[197,150,246]:[254,176,195]);noFill();stroke(...hue,ri%3===0?205:115);strokeWeight(ri%3===0?1.6:.7);beginShape();curveVertex(root.pos.x,root.pos.y);for(const o of rope.objs)curveVertex(o.pos.x,o.pos.y);const e=rope.objs[rope.objs.length-1];curveVertex(e.pos.x,e.pos.y);endShape();if(ri%4===0){noStroke();fill(...hue,190);circle(e.pos.x,e.pos.y,2.4)}}}
 if(render){const ctx=drawingContext;const g=ctx.createRadialGradient(c.x-8,c.y-10,2,c.x,c.y,28*c.sc);g.addColorStop(0,marineSkin==='reef'?'#eaffdf':'#ffdeef');g.addColorStop(.25,marineSkin==='reef'?'#c4efd099':'#f8b9ea88');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(c.x,c.y,28*c.sc,0,TWO_PI);ctx.fill()}}
}
function draw(){if(Studio.paused||Studio.suspended)return;stepSea(true)}
function hypot(x,y){return Math.hypot(x,y)}
