
// Direct adaptation: Jason Labbe, Niagara falls hues. CC BY-SA 3.0.
// Size-dependent gravity, ribbon line trails, slow fade and upward interaction
// remain. Added lingering vortices, touch currents, palettes and suspended flow.
let drops=[],eddies=[],fallsHue=0,fallsPalette='amber',suspendedFlow=false,fallsTick=0;
function setup(){artCanvas();colorMode(HSB,360);resetFalls();Studio.onDown=p=>makeEddy(p,1);Studio.onMove=p=>{if(frameCount%3===0)makeEddy(p,.4)};Studio.onUp=p=>makeEddy(p,Math.min(2,.7+Math.hypot(p.dx,p.dy)*.015));Studio.onTool=n=>{if(n==='suspend'){suspendedFlow=!suspendedFlow;document.querySelector('[data-tool="suspend"]').setAttribute('aria-pressed',String(suspendedFlow));return}fallsPalette=n;Studio.select('palette',n)};Studio.onReset=resetFalls}
function resetFalls(){background('#0d1016');drops=[];eddies=[];fallsTick=0;for(let i=0;i<240;i++)addDrop(random(height));for(let i=0;i<90;i++)draw()}
function addDrop(y=0){const x=random(width),sz=random(1.5,12);drops.push({x,y,px:x,py:y,vx:0,vy:random(.5,3),size:sz,h:fallsHue+random(-14,14),life:0})}
function makeEddy(p,power){eddies.push({x:p.x,y:p.y,strength:power,life:240,spin:p.dx<0?-1:1});if(eddies.length>12)eddies.shift()}
function draw(){
 if(Studio.paused||Studio.suspended)return;fallsTick++;noStroke();fill(220,35,5,6);rect(0,0,width,height);
 if(!suspendedFlow&&drops.length<900)for(let i=0;i<5;i++)addDrop();
 const rad=Math.min(width,height)*.28;
 for(const h of Studio.hands.values())if(fallsTick%20===0)makeEddy(h,1.3);
 for(let i=drops.length-1;i>=0;i--){const p=drops[i];p.life++;
  p.vy+=suspendedFlow?0:p.size*.006;p.vx*=.986;
  for(const h of Studio.hands.values()){
   const dx=h.x-p.x,dy=h.y-p.y,d=Math.hypot(dx,dy);if(d<rad&&d>1){const f=(1-d/rad)*.8;p.vx+=dx/d*f+h.dx*.002;p.vy+=(dy-rad)/Math.max(20,d)*f+h.dy*.002;p.h+=.2}
  }
  for(const e of eddies){const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);if(d<rad&&d>5){const f=Math.pow(1-d/rad,2)*e.strength*(e.life/240)*1.1;p.vx-=dy/d*f*e.spin;p.vy+=dx/d*f*e.spin}}
  const speed=Math.hypot(p.vx,p.vy);if(speed>7){p.vx*=7/speed;p.vy*=7/speed}
  p.x+=p.vx*(suspendedFlow?.22:1);p.y+=p.vy*(suspendedFlow?.22:1);
  const hue=fallsPalette==='amber'?28+Math.sin((p.h+fallsTick*.05)*.03)*19:fallsPalette==='cobalt'?185+Math.sin(p.h*.025)*35:330+Math.sin(p.h*.03)*27;
  stroke((hue+360)%360,fallsPalette==='amber'?260:190,330,260);strokeWeight(p.size);line(p.px,p.py,p.x,p.y);
  if(p.size>6){stroke(hue,120,360,160);strokeWeight(.7);line(p.px-p.size*.17,p.py,p.x-p.size*.17,p.y)}
  p.px=p.x;p.py=p.y;if(p.y>height+30||p.x<-30||p.x>width+30||p.life>1700)drops.splice(i,1);
 }
 for(let i=eddies.length-1;i>=0;i--){eddies[i].life--;if(eddies[i].life<0)eddies.splice(i,1)}fallsHue=(fallsHue+.15)%360;
}
