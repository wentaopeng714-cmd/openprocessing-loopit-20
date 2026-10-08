/* Direct adaptation of Magical trail shader — Jason Labbe.
 * https://openprocessing.org/@theRussetPotato/835887 · CC BY-SA 3.0
 * Keeps the original inverse-distance light shader and Particle primitive.
 * Added touch emission, long-press pearls, multi-touch bending, material modes,
 * responsive aspect correction, two palettes, finite lifetime and tone mapping.
 */
const MAX_PARTICLE_COUNT=60,MAX_TRAIL_COUNT=30;
let colorScheme=['#71EBE2','#C7A1FB','#83B7F0','#F5A7CE','#F5DB9D'];
let theShader,shaderTexture,trail=[],particles=[],motion='melt',tint=[.5,.68,1];
let clockLight=0,inkPalette='opal';
function setup(){
 pixelDensity(1);const c=createCanvas(Math.min(1000,window.innerWidth),Math.min(1200,window.innerHeight),WEBGL);c.parent('canvas-container');c.elt.oncontextmenu=()=>false;
 shaderTexture=createGraphics(width,height,WEBGL);shaderTexture.pixelDensity(1);shaderTexture.noStroke();theShader=shaderTexture.createShader(vertShader,fragShader);
 frameRate(35);Studio.attach(c.elt,width,height);
 Studio.onDown=p=>{emitLight(p,7);Studio.hint('Hold to gather a pearl. Draw to stretch the liquid light.');};
 Studio.onMove=(p,prev)=>{const speed=Math.hypot(p.dx,p.dy);trail.push({x:p.x,y:p.y,age:0});if(trail.length>MAX_TRAIL_COUNT)trail.shift();emitLight(p,Math.min(5,1+Math.floor(speed/10)));};
 Studio.onTool=name=>{
  if(['melt','orbit','glass'].includes(name)){motion=name;Studio.select('motion',name);Studio.hint({melt:'The light slowly dissolves. Add a new stroke to merge its colours.',orbit:'The pearls circle one another. Two fingers bend their paths.',glass:'Your luminous sculpture settles and stays. Add another strand.'}[name]);}
  else{inkPalette=name;colorScheme=name==='opal'?['#71EBE2','#C7A1FB','#83B7F0','#F5A7CE','#F5DB9D']:['#F7CF8C','#EBA35A','#F26835','#DC728B','#84A5AA'];tint=name==='opal'?[.50,.68,1.]:[.45,.75,.9];Studio.select('palette',name);}
 };
 Studio.onReset=()=>{particles=[];trail=[];Studio.touched=false;clockLight=0;};
 for(let i=0;i<30;i++){const a=i/30*TWO_PI,x=width*.5+cos(a)*width*.23,y=height*.46+sin(a*2)*height*.15;trail.push({x,y,age:0});const p=new Particle(x,y,-sin(a)*.12,cos(a)*.12);p.mass=12;p.vel.setMag(.6);particles.push(p);}
}
function emitLight(p,n){
 const speed=Math.hypot(p.dx,p.dy),two=Studio.hands.size>1;
 for(let i=0;i<n;i++){
  const a=random(TWO_PI),r=random(2,10),v=new Particle(p.x+cos(a)*r,p.y+sin(a)*r,speed>1?p.dx/speed:cos(a)*.3,speed>1?p.dy/speed:sin(a)*.3);
  v.vel.mult(.35);v.mass=(two?23:13)*(1+Math.min(1,speed/40));particles.push(v);
 }
 if(particles.length>MAX_PARTICLE_COUNT)particles.splice(0,particles.length-MAX_PARTICLE_COUNT);
}
function draw(){
 if(Studio.paused||Studio.suspended)return;clockLight++;
 for(const p of Studio.hands.values()){
  if(clockLight%7===0)emitLight(p,1);
  if(clockLight%2===0){trail.push({x:p.x,y:p.y,age:0});if(trail.length>MAX_TRAIL_COUNT)trail.shift();}
 }
 if(!Studio.touched&&clockLight%2===0){const t=clockLight*.017,p={x:width*.5+Math.cos(t)*width*.23,y:height*.46+Math.sin(t*2)*height*.15,dx:-Math.sin(t)*5,dy:Math.cos(t*2)*5};trail.push({x:p.x,y:p.y,age:0});if(trail.length>MAX_TRAIL_COUNT)trail.shift();if(clockLight%6===0)emitLight(p,1);}
 for(let i=particles.length-1;i>=0;i--){particles[i].move();if(particles[i].life<=0)particles.splice(i,1);}
 trail.forEach(t=>t.age++);trail=trail.filter(t=>t.age<(motion==='glass'?2000:130));
 const data=serializeSketch();background('#04080d');noStroke();shaderTexture.shader(theShader);
 theShader.setUniform('resolution',[width,height]);theShader.setUniform('inkTint',tint);
 theShader.setUniform('trailCount',trail.length);theShader.setUniform('trail',data.trails);
 theShader.setUniform('particleCount',particles.length);theShader.setUniform('particles',data.particles);theShader.setUniform('colors',data.colors);
 shaderTexture.rect(0,0,width,height);texture(shaderTexture);rect(-width/2,-height/2,width,height);
}
function serializeSketch(){
 const data={trails:new Array(MAX_TRAIL_COUNT*2).fill(0),particles:new Array(MAX_PARTICLE_COUNT*3).fill(0),colors:new Array(MAX_PARTICLE_COUNT*3).fill(0)};
 trail.forEach((p,i)=>{data.trails[i*2]=p.x/width;data.trails[i*2+1]=1-p.y/height});
 particles.forEach((p,i)=>{data.particles[i*3]=p.pos.x/width;data.particles[i*3+1]=1-p.pos.y/height;data.particles[i*3+2]=p.mass*Math.max(.7,p.vel.mag())*p.life/100;const c=color(colorScheme[p.colorIndex]);data.colors[i*3]=red(c);data.colors[i*3+1]=green(c);data.colors[i*3+2]=blue(c);});return data;
}
