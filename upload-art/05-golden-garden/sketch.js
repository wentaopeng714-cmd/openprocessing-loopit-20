
// Vamoss Organic Trail final tutorial. CC BY-SA 3.0.
// Noise-turned heading, ease toward a focus, size decay, inverse-size velocity
// and spatial/time lightness noise retained. Added planted roots and combing.
let fibres=[],roots=[],gardenMode='plant',gardenPalette='gold',gardenTick=0;
function setup(){artCanvas();colorMode(HSL,100);resetGarden();Studio.onDown=p=>{if(gardenMode==='plant')plantRoot(p.x,p.y)};Studio.onMove=p=>{if(gardenMode==='plant'&&Math.hypot(p.dx,p.dy)>5&&gardenTick%4===0)plantRoot(p.x,p.y,.5)};Studio.onTool=n=>{if(['plant','comb'].includes(n)){gardenMode=n;Studio.select('mode',n)}else{gardenPalette=n;Studio.select('palette',n)}};Studio.onReset=resetGarden}
function rootAt(x,y,scale=1){return {x,y,r:random(95,145)*Math.min(1,width/550)*scale,phase:-PI*.5+random(-.6,.6),age:0,h:gardenPalette==='gold'?random(9,14):gardenPalette==='moss'?random(18,27):random(1,5)}}
function newFibre(root,spread=1){const a=root.phase+random(-1.3,1.3),r=random(root.r*.3*spread);return {x:root.x+cos(a)*r,y:root.y+sin(a)*r,dir:a,size:random(1.1,2.9),root,branch:random(-1.2,1.2),h:root.h+random(-2,2),l:random(22,39),age:0}}
function plantRoot(x,y,scale=1){const root=rootAt(x,y,scale);roots.push(root);if(roots.length>18)roots.shift();for(let i=0;i<220*scale;i++)fibres.push(newFibre(root,.3));if(fibres.length>1400)fibres.splice(0,fibres.length-1400)}
function resetGarden(){background('#f3eddf');fibres=[];roots=[];gardenTick=0;for(let j=0;j<5;j++){const x=width*(.18+j*.16),y=height*(.57+Math.sin(j*1.4)*.09);plantRoot(x,y)}for(let t=0;t<190;t++)stepGarden(false)}
function stepGarden(interact){
 const time=gardenTick*.012;
 for(let i=0;i<fibres.length;i++){
  const p=fibres[i],root=p.root,angle=root.phase+p.branch+Math.sin(time*.4)*.2;let fx=root.x+cos(angle)*root.r*1.8,fy=root.y+sin(angle)*root.r*1.8;
  p.dir+=(noise(p.x*.03,p.y*.03,time)-.477)*.65;
  if(interact&&gardenMode==='comb')for(const h of Studio.hands.values()){const d=Math.hypot(h.x-p.x,h.y-p.y);if(d<160){fx=h.x+h.dx*10;fy=h.y+h.dy*10}}
  const target=Math.atan2(fy-p.y,fx-p.x);p.dir+=wrapAngle(target-p.dir)*.025;
  p.size*=.993;p.age++;
  if(p.size<.6||p.age>350||p.x<0||p.x>width||p.y<55||p.y>height-90){Object.assign(p,newFibre(root,1));continue}
  const px=p.x,py=p.y;p.x+=cos(p.dir)/(p.size+2.5)*4;p.y+=sin(p.dir)/(p.size+2.5)*4;
  const bri=(noise(p.x/35,p.y/35,time*2+i*.005)-.3)*(100-p.size*16);
  stroke(p.h,65,Math.max(12,Math.min(65,p.l+bri)),45);strokeWeight(p.size*.5);line(px,py,p.x,p.y);
 }
 gardenTick++;
}
function draw(){if(Studio.paused||Studio.suspended)return;for(const h of Studio.hands.values())if(gardenMode==='plant'&&gardenTick%6===0){const root=roots[roots.length-1];if(root){root.r=Math.min(130,root.r+.6);for(let i=0;i<4;i++)fibres.push(newFibre(root,.3))}}if(fibres.length>1400)fibres.splice(0,fibres.length-1400);stepGarden(true)}
