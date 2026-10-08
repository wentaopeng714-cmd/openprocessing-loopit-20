"""Build six separate, offline HTML artworks and root-index ZIPs.
Original rendering principles are retained; each artwork owns its simulation.
"""
from pathlib import Path
import json, base64, shutil, zipfile, re

R=Path(__file__).parent
G=R/'upload-art'
G.mkdir(exist_ok=True)
(G/'standalone').mkdir(exist_ok=True)
(G/'packages').mkdir(exist_ok=True)
entries=[
 dict(slug='01-portrait-loom',name='Portrait Loom',theme='dark',author='Vamoss',source='https://openprocessing.org/@u65884/624879',hint='Draw to pull the threads. Hold to gather them. Release to reveal the face.',tools=[('weave','Weave','mode'),('scatter','Scatter','mode'),('subject','New subject','action')]),
 dict(slug='02-field-canvas',name='Field Canvas',theme='paper',author='Jason Labbe',source='https://openprocessing.org/@theRussetPotato/472966',hint='Drag to bend the brushwork. Hold to paint a swirl. Your marks stay.',tools=[('flow','Flow','mode'),('carve','Carve','mode'),('scene','New scene','action')]),
 dict(slug='03-pigment-portrait',name='Pigment Portrait',theme='paper',author='Jason Labbe',source='https://openprocessing.org/@theRussetPotato/520387',hint='Paint the portrait with your finger. Try colour washing or the palette knife.',tools=[('paint','Paint','mode'),('knife','Knife','mode'),('wash','Colour wash','mode'),('subject','New subject','action')]),
 dict(slug='04-ribbon-falls',name='Ribbon Falls',theme='dark',author='Jason Labbe',source='https://openprocessing.org/@theRussetPotato/431862',hint='Drag to lift the falling ribbons. Hold for a whirlpool. Flick to leave a current.',tools=[('amber','Amber','palette'),('cobalt','Cobalt','palette'),('rose','Rose','palette'),('suspend','Suspend','action')]),
 dict(slug='05-golden-garden',name='Golden Garden',theme='paper',author='Vamoss',source='https://openprocessing.org/@u65884/1036179',hint='Touch to plant a living bloom. Drag to comb its fibres. Hold to let it grow.',tools=[('plant','Plant','mode'),('comb','Comb','mode'),('gold','Gold','palette'),('moss','Moss','palette'),('coral','Coral','palette')]),
 dict(slug='06-liquid-light',name='Liquid Light',theme='dark',author='Jason Labbe',source='https://openprocessing.org/@theRussetPotato/835887',hint='Draw liquid light. Hold to grow a pearl. Two fingers bend the current.',tools=[('melt','Melt','motion'),('orbit','Orbit','motion'),('glass','Glass','motion'),('opal','Opal','palette'),('ember','Ember','palette')])
]

css='''*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;overscroll-behavior:none;background:#090b10;color:#f6ede1;font-family:Arial,sans-serif}body.paper{background:#f4f0e7;color:#303931}canvas{display:block;touch-action:none}#canvas-container{position:fixed;inset:0;display:grid;place-items:center}header{position:fixed;left:max(22px,env(safe-area-inset-left));top:max(20px,env(safe-area-inset-top));right:22px;display:flex;align-items:flex-start;gap:10px;pointer-events:none;z-index:3}h1{font:400 clamp(22px,4.6vw,34px) Georgia,serif;letter-spacing:-.7px;margin:0;flex:1;text-shadow:0 1px 10px #0005}.paper h1{text-shadow:0 1px 12px #f4f0e7}header button{pointer-events:auto;width:38px;height:38px;padding:0;font-size:18px}button{font:12px Arial,sans-serif;color:inherit;background:#151822c7;border:1px solid #ffffff20;border-radius:24px;padding:12px 16px;cursor:pointer;touch-action:manipulation;backdrop-filter:blur(12px)}.paper button{background:#fffdf5dc;border-color:#454b3727}button[aria-pressed=true]{background:#efddbb;color:#282b29;border-color:#efddbb}.paper button[aria-pressed=true]{background:#465740;color:#fffaee;border-color:#465740}button:focus-visible{outline:2px solid #edaf71;outline-offset:3px}.controls{position:fixed;left:14px;right:14px;bottom:max(20px,env(safe-area-inset-bottom));z-index:3;display:flex;align-items:center;flex-direction:column;pointer-events:none}.hint{max-width:480px;font-size:12px;line-height:1.6;text-align:center;margin:0 0 14px;background:#0b0f16b0;padding:7px 14px;border-radius:18px;backdrop-filter:blur(10px)}.paper .hint{background:#f7f3e8dc}.tools{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;pointer-events:auto}.quiet header,.quiet .controls{opacity:0;pointer-events:none;transition:opacity .4s}.quiet .tools,.quiet header button{pointer-events:none}#error{position:fixed;inset:45% 20px auto;color:#f55;text-align:center;z-index:8}@media(max-width:480px){header{left:16px;right:16px;top:16px}h1{font-size:24px}button{padding:11px 13px;font-size:11px}.hint{font-size:11px;max-width:310px;margin-bottom:10px}}'''
(G/'studio.css').write_text(css)
css+='''.show-controls{display:none;position:fixed;right:16px;top:16px;z-index:7;width:38px;height:38px;padding:0;font-size:18px}.quiet .show-controls{display:block}'''
(G/'studio.css').write_text(css)

common=r'''// Shared pointer and presentation layer only. Independent artwork simulations below.
window.Studio={hands:new Map(),touched:false,paused:false,suspended:false,hidden:false,
 onDown:null,onMove:null,onUp:null,onTool:null,onReset:null,
 hint(s){document.querySelector('.hint').textContent=s},
 select(group,value){document.querySelectorAll('[data-group="'+group+'"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===value)))},
 attach(canvas,w,h){
  canvas.oncontextmenu=()=>false;
  const point=e=>{const r=canvas.getBoundingClientRect();return {id:e.pointerId,x:(e.clientX-r.left)*w/r.width,y:(e.clientY-r.top)*h/r.height,dx:0,dy:0,pressure:e.pressure||.5,start:performance.now(),at:performance.now()}};
  canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);this.touched=true;const p=point(e);this.hands.set(p.id,p);this.onDown?.(p)});
  canvas.addEventListener('pointermove',e=>{const p=this.hands.get(e.pointerId);if(!p)return;e.preventDefault();const q=point(e);q.dx=q.x-p.x;q.dy=q.y-p.y;q.start=p.start;this.hands.set(q.id,q);this.onMove?.(q,p)});
  const up=e=>{const p=this.hands.get(e.pointerId);if(p){this.onUp?.(p);this.hands.delete(e.pointerId)}};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);
 },init(){
  document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>this.onTool?.(b.dataset.tool,b));
  document.querySelector('[data-reset]').onclick=()=>{this.hands.clear();this.onReset?.()};
  document.querySelector('[data-pause]').onclick=e=>{this.paused=!this.paused;e.currentTarget.textContent=this.paused?'▷':'Ⅱ';e.currentTarget.setAttribute('aria-label',this.paused?'Resume':'Pause')};
  document.querySelector('[data-hide]').onclick=()=>{this.hidden=true;document.body.classList.add('quiet')};
  const show=()=>{this.hidden=false;document.body.classList.remove('quiet')};document.querySelector('[data-show]').onclick=show;document.addEventListener('keydown',e=>{if(e.key==='Escape')show()});
  document.addEventListener('visibilitychange',()=>{this.suspended=document.hidden;if(document.hidden)this.hands.clear()});
  window.addEventListener('blur',()=>this.hands.clear());
  window.addEventListener('error',e=>{document.querySelector('#error').textContent=e.message});
 }};Studio.init();
function artCanvas(){pixelDensity(1);const c=createCanvas(Math.min(1200,innerWidth),Math.min(1400,innerHeight));c.parent('canvas-container');frameRate(40);Studio.attach(c.elt,width,height);return c}
function windowResized(){// Keep an accumulated painting intact when the device rotates.
 const c=document.querySelector('canvas');if(!c)return;const scale=Math.min(innerWidth/c.width,innerHeight/c.height);c.style.width=c.width*scale+'px';c.style.height=c.height*scale+'px';
}
function wrapAngle(a){return Math.atan2(Math.sin(a),Math.cos(a))}
'''
(G/'input.js').write_text(common)

assetroot=R/'research/reference-matched'
assetfiles=[assetroot/'624879-image-circular-random-walker/profile.jpg']+[assetroot/'472966-noise-flow-field-painter'/f for f in ['img1.jpg','img3.jpg','img4.jpg','img5.jpg']]+[assetroot/'520387-art-gallery-painter/emma.jpg']
encoded=['data:image/jpeg;base64,'+base64.b64encode(p.read_bytes()).decode() for p in assetfiles]
image_setup='const IMAGE_DATA='+json.dumps(encoded)+';\n'
image_helper=r'''
let images=[],photo,fit;
function preload(){images=IMAGE_DATA.map(s=>loadImage(s))}
function fitPhoto(index,immersive=false,tallPortrait=false){photo=images[index];photo.loadPixels();const size=tallPortrait&&width<600?Math.min(width*1.30/photo.height,(height-220)/photo.height):immersive?Math.max(width*.96/photo.width,(height-165)/photo.height):Math.min(width*.94/photo.width,(height-175)/photo.height);const sc=Math.max(.08,size);fit={scale:sc,w:photo.width*sc,h:photo.height*sc,x:(width-photo.width*sc)/2,y:(height-photo.height*sc)/2-15}}
function samplePhoto(x,y){const px=Math.max(0,Math.min(photo.width-1,Math.floor((x-fit.x)/fit.scale))),py=Math.max(0,Math.min(photo.height-1,Math.floor((y-fit.y)/fit.scale))),i=(py*photo.width+px)*4;return [photo.pixels[i],photo.pixels[i+1],photo.pixels[i+2]]}
function insidePhoto(x,y){return x>=fit.x&&x<fit.x+fit.w&&y>=fit.y&&y<fit.y+fit.h}
'''

portrait=image_setup+image_helper+r'''
// Vamoss circular walkers: inverse-radius turns, brightness-triggered reversal,
// source-image colour sampling and persistent lines retained. CC BY-SA 3.0.
let walkers=[],subject=0,loomMode='weave',loomTime=0,loomAnchors=[];
function setup(){artCanvas();resetLoom();Studio.onDown=p=>{seedTouch(p,70);loomAnchors.push({x:p.x,y:p.y,life:150,mode:loomMode});if(loomAnchors.length>5)loomAnchors.shift()};Studio.onMove=p=>{seedTouch(p,14);const a=loomAnchors[loomAnchors.length-1];if(a){a.x=p.x;a.y=p.y;a.life=150}};Studio.onTool=n=>{if(n==='subject'){subject=(subject+1)%3;resetLoom()}else{loomMode=n;Studio.select('mode',n)}};Studio.onReset=resetLoom}
function newWalker(x,y){return {x,y,px:x,py:y,dir:random()>.5?1:-1,r:random(2,7)*fit.scale,a:random(TWO_PI),age:0,col:samplePhoto(x,y)}}
function resetLoom(){fitPhoto([0,1,2][subject]);background('#080a0d');walkers=[];loomAnchors=[];for(let i=0;i<750;i++){const x=fit.x+random(fit.w),y=fit.y+random(fit.h);walkers.push(newWalker(x,y))}loomTime=0;for(let i=0;i<65;i++)stepLoom(false)}
function seedTouch(p,n){if(!insidePhoto(p.x,p.y))return;for(let i=0;i<n;i++){const a=random(TWO_PI),r=random(35);walkers.push(newWalker(p.x+cos(a)*r,p.y+sin(a)*r))}if(walkers.length>1200)walkers.splice(0,walkers.length-1200)}
function stepLoom(interact){
 const ctx=drawingContext;ctx.lineWidth=Math.max(.5,fit.scale*.85);ctx.lineCap='round';
 for(const q of walkers){
  q.a+=q.dir/Math.max(.7,q.r);q.age++;
  let vx=cos(q.a)*q.r,vy=sin(q.a)*q.r;
  if(interact)for(const h of loomAnchors){
   const dx=h.x-q.x,dy=h.y-q.y,d=Math.hypot(dx,dy),reach=Math.min(width,height)*.58;
   if(d<reach&&d>2){const f=Math.pow(1-d/reach,2)*8.5*h.life/150;const sign=h.mode==='scatter'?-1:1;vx+=sign*dx/d*f-dy/d*f*.6;vy+=sign*dy/d*f+dx/d*f*.6}
  }
  q.x+=vx;q.y+=vy;
  const c=samplePhoto(q.x,q.y);
  if(Math.max(...c)>185||!insidePhoto(q.x,q.y)){q.dir*=-1;q.r=random(2,7)*fit.scale;q.a+=PI}
  if(!insidePhoto(q.x,q.y)||q.age>260){const x=fit.x+random(fit.w),y=fit.y+random(fit.h);Object.assign(q,newWalker(x,y));continue}
  const col=loomAnchors.length?q.col:c;
  ctx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${loomAnchors.length?.45:.28})`;ctx.beginPath();ctx.moveTo(q.px,q.py);ctx.lineTo(q.x,q.y);ctx.stroke();q.px=q.x;q.py=q.y;
 }
}
function draw(){if(Studio.paused||Studio.suspended)return;loomTime++;for(const h of Studio.hands.values())if(loomTime%3===0)seedTouch(h,3);stepLoom(true);for(let i=loomAnchors.length-1;i>=0;i--){loomAnchors[i].life--;if(loomAnchors[i].life<=0)loomAnchors.splice(i,1)}}
'''

flow=image_setup+image_helper+r'''
// Jason Labbe image-sampled flow painter: noise-aligned strokes, thick-to-fine
// progression and offset highlights retained. Added an editable vector field.
let scene=0,paintAge=0,flowMode='flow',fieldX,fieldY,cols,rows,cells=16;
function setup(){artCanvas();cols=Math.ceil(width/cells);rows=Math.ceil(height/cells);fieldX=new Float32Array(cols*rows);fieldY=new Float32Array(cols*rows);resetField();Studio.onDown=p=>brushField(p,85);Studio.onMove=p=>{bendField(p);brushField(p,22)};Studio.onTool=n=>{if(n==='scene'){scene=(scene+1)%3;resetField()}else{flowMode=n;Studio.select('mode',n)}};Studio.onReset=resetField}
function resetField(){fitPhoto([3,2,4][scene],width<600);background('#f4f0e7');fieldX.fill(0);fieldY.fill(0);paintAge=0;noiseSeed(Math.floor(Math.random()*10000));for(let t=0;t<120;t++){paintAge=t;for(let i=0;i<70;i++)fieldStroke(fit.x+random(fit.w),fit.y+random(fit.h),false)}paintAge=130}
function fieldStroke(x,y,touch){
 if(!insidePhoto(x,y))return;
 const rgb=samplePhoto(x,y),k=Math.max(0,Math.min(fieldX.length-1,Math.floor(y/cells)*cols+Math.floor(x/cells)));
 let a=noise((x-fit.x)/fit.scale*.005,(y-fit.y)/fit.scale*.005)*TWO_PI-PI;
 if(Math.abs(fieldX[k])+Math.abs(fieldY[k])>.02)a=Math.atan2(Math.sin(a)+fieldY[k],Math.cos(a)+fieldX[k]);
 let sw=(touch?random(2.5,8):Math.max(.8,12-paintAge*.025))*Math.max(.5,fit.scale),len=random(12,34)*Math.max(.55,fit.scale);
 const ctx=drawingContext;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.lineCap='round';
 if(flowMode==='carve'&&touch){ctx.strokeStyle='#f4f0e7';ctx.lineWidth=sw*1.7}else{ctx.strokeStyle=`rgba(${rgb[0]},${rgb[1]},${rgb[2]},.78)`;ctx.lineWidth=sw}
 ctx.beginPath();ctx.moveTo(-len*.5,0);ctx.lineTo(len*.5,0);ctx.stroke();
 if(flowMode!=='carve'||!touch){ctx.strokeStyle=`rgba(${Math.min(255,rgb[0]*1.8)},${Math.min(255,rgb[1]*1.8)},${Math.min(255,rgb[2]*1.8)},.35)`;ctx.lineWidth=sw*.2;ctx.beginPath();ctx.moveTo(-len*.5,-sw*.22);ctx.lineTo(len*.5,-sw*.22);ctx.stroke()}ctx.restore();
}
function brushField(p,n){for(let i=0;i<n;i++){const a=random(TWO_PI),r=random(0,38);fieldStroke(p.x+cos(a)*r,p.y+sin(a)*r,true)}}
function bendField(p){const rad=Math.min(width,height)*.24,spin=Math.hypot(p.dx,p.dy)<2;for(let y=Math.max(0,Math.floor((p.y-rad)/cells));y<Math.min(rows,Math.ceil((p.y+rad)/cells));y++)for(let x=Math.max(0,Math.floor((p.x-rad)/cells));x<Math.min(cols,Math.ceil((p.x+rad)/cells));x++){const dx=x*cells-p.x,dy=y*cells-p.y,d=Math.hypot(dx,dy);if(d>=rad)continue;const f=(1-d/rad)*.5,k=y*cols+x;fieldX[k]=Math.max(-5,Math.min(5,fieldX[k]+(spin?-dy/(d+1):p.dx*.04)*f));fieldY[k]=Math.max(-5,Math.min(5,fieldY[k]+(spin?dx/(d+1):p.dy*.04)*f))}}
function draw(){if(Studio.paused||Studio.suspended)return;paintAge++;for(let i=0;i<14;i++)fieldStroke(fit.x+random(fit.w),fit.y+random(fit.h),false);for(const h of Studio.hands.values()){bendField(h);brushField(h,24)}if(frameCount%8===0){for(let k=0;k<fieldX.length;k++){fieldX[k]*=.996;fieldY[k]*=.996}}}
'''

pigment=image_setup+image_helper+r'''
// Port of Jason Labbe's Processing.js Art gallery painter to p5.js.
// Brightness-driven stroke angles, shifted HSB pigments, dark underpaint and
// offset highlights retained. Finger brushes replace click-only image cycling.
let pigmentSubject=0,pigmentMode='paint',hueShift=24,pigmentAge=0,smears=[];
function setup(){artCanvas();colorMode(HSB,255);resetPigment();Studio.onDown=p=>{pigmentBrush(p,100);smears.push({x:p.x,y:p.y,life:160})};Studio.onMove=p=>pigmentBrush(p,40);Studio.onTool=n=>{if(n==='subject'){pigmentSubject=(pigmentSubject+1)%3;resetPigment()}else{pigmentMode=n;Studio.select('mode',n)}};Studio.onReset=resetPigment}
function resetPigment(){fitPhoto([5,0,2][pigmentSubject],false,true);background('#f4f0e7');hueShift=random(255);pigmentAge=0;smears=[];for(let t=0;t<135;t++){pigmentAge=t;for(let i=0;i<55;i++)pigmentMark(fit.x+random(fit.w),fit.y+random(fit.h),false)}pigmentAge=135}
function pigmentMark(x,y,touch,dx=0,dy=0){
 if(!insidePhoto(x,y))return;const c=samplePhoto(x,y),b=Math.max(...c),hs=(b+hueShift)%255,a=b/255*TWO_PI-PI;
 const sw=touch?random(1,5)*fit.scale:Math.max(.5,4-pigmentAge*.008)*fit.scale;
 let len=touch?random(8,23)*fit.scale:Math.max(4,30-pigmentAge*.065)*fit.scale;
 push();translate(x,y);rotate(touch&&pigmentMode==='knife'?Math.atan2(dy,dx):a);
 if(touch&&pigmentMode==='wash'){noStroke();fill((hs+frameCount*.15)%255,155,b,16);ellipse(0,0,random(8,26),random(6,20));pop();return}
 strokeWeight(sw+1);stroke(hs,150,b*.35,85);line(-len,1,len,1);
 strokeWeight(pigmentMode==='knife'&&touch?sw*2.5:sw);stroke(hs,150,b,185);line(-len,0,len,0);
 strokeWeight(Math.max(.35,sw*.24));stroke(hs,100,Math.min(255,150+b*.42),75);line(-len,-sw*.3,len,-sw*.3);pop();
}
function pigmentBrush(p,n){for(let i=0;i<n;i++){const a=random(TWO_PI),r=random(25);pigmentMark(p.x+cos(a)*r,p.y+sin(a)*r,true,p.dx,p.dy)}}
function draw(){if(Studio.paused||Studio.suspended)return;pigmentAge++;for(let i=0;i<8;i++)pigmentMark(fit.x+random(fit.w),fit.y+random(fit.h),false);for(const h of Studio.hands.values()){pigmentBrush(h,20);if(pigmentMode==='wash')hueShift=(hueShift+.15)%255}for(let i=smears.length-1;i>=0;i--){let s=smears[i];s.life--;if(s.life<=0)smears.splice(i,1);else if(frameCount%3===0)pigmentBrush({x:s.x+Math.sin(s.life*.08)*18,y:s.y+Math.cos(s.life*.08)*18,dx:0,dy:0},4)}}
'''

falls=r'''
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
'''

garden=r'''
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
'''

codes=[portrait,flow,pigment,falls,garden]
source_map=[('624879-image-circular-random-walker','current-original.js'),('472966-noise-flow-field-painter','mySketch.js'),('520387-art-gallery-painter','mySketch.pde'),('431862-niagara-falls-hues','mySketch.js'),('1036179-organic-trail','current-original.js')]
p5=(R/'vendor/p5.min.js').read_text()
for i,e in enumerate(entries):
 p=G/e['slug'];p.mkdir(exist_ok=True)
 (p/'original').mkdir(exist_ok=True)
 if i<5:
  (p/'sketch.js').write_text(codes[i]);src,filename=source_map[i];shutil.copy(assetroot/src/filename,p/'original'/filename)
  scripts=['sketch.js']
 else:
  scripts=['sketch.js','particle.js','shader.js']
  for f in scripts:
   s=(R/'studies/01-liquid-light'/f).read_text()
   if f=='sketch.js':s=s.replace('Math.min(780,window.innerWidth),Math.min(1040,window.innerHeight)','Math.min(1000,window.innerWidth),Math.min(1200,window.innerHeight)').replace('Studio.attach(c.elt,width,height);','frameRate(35);Studio.attach(c.elt,width,height);')
   if f=='particle.js':s=s.replace("(motion==='glass'?.00035:.002)","(motion==='glass'?0:.002)").replace('this.mass*=.9995;',"this.mass*=motion==='glass'?1:.9995;")
   if f=='shader.js':
    s=s.replace('float mult = 0.0000016;','float mult = 0.00001;').replace('*.000002;','*.000004;').replace('* 0.000002;','* 0.000004;')
    a=s.index('vec3 light=vec3(r,g,b);');b=s.index('gl_FragColor = vec4(col+vec3(.015,.022,.032),1.0);')+len('gl_FragColor = vec4(col+vec3(.015,.022,.032),1.0);')
    s=s[:a]+'''vec3 light=vec3(r,g,b);
 float energy=length(light);
 // Labbe's accumulated coloured light, with soft highlight compression.
 vec3 col=(1.0-exp(-light*1.25))*.95;
 float pearl=smoothstep(2.5,9.0,energy);
 col=mix(col,vec3(.91,.97,1.),pearl*.85);
 gl_FragColor=vec4(col+vec3(.012,.018,.025),1.0);'''+s[b:]
   (p/f).write_text(s)
  for f in (R/'studies/01-liquid-light/original').glob('*.js'):shutil.copy(f,p/'original'/f.name)
 e['license']='CC BY-SA 3.0';e['scripts']=scripts
 active_groups=set();tools=[]
 for key,label,group in e['tools']:
  selected=group!='action' and group not in active_groups;active_groups.add(group)
  tools.append(f'<button data-tool="{key}" data-group="{group}" aria-pressed="{str(selected).lower()}">{label}</button>')
 notice=f"Derived from {e['source']} by {e['author']}; CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0/. Modified: touch input, independent creative gestures, responsive sizing, palettes and finite particle limits. Attribution is retained here and in LICENSE.txt."
 html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{e['name']}</title><meta name="author" content="{e['author']}; interactive adaptation"><!-- {notice} --><link rel="stylesheet" href="../studio.css"></head><body class="{e['theme']}"><main id="canvas-container" aria-label="{e['name']} interactive artwork"></main><header><h1>{e['name']}</h1><button data-pause aria-label="Pause">Ⅱ</button><button data-reset aria-label="Reset artwork">↻</button><button data-hide aria-label="Hide controls">⤢</button></header><aside class="controls"><p class="hint">{e['hint']}</p><div class="tools">{''.join(tools)}</div></aside><div id="error" role="alert"></div><script src="../../vendor/p5.min.js"></script><script src="../input.js"></script>{''.join('<script src="'+s+'"></script>' for s in scripts)}</body></html>'''
 html=html.replace('<div id="error" role="alert"></div>','<button class="show-controls" data-show aria-label="Show controls">⤡</button><div id="error" role="alert"></div>')
 html=html.replace('</head>','<!-- p5.js: LGPL-2.1; https://p5js.org; separate library license preserved in the ZIP. --></head>')
 (p/'index.html').write_text(html)
 standalone=html.replace('<link rel="stylesheet" href="../studio.css">','<style>'+css+'</style>')
 for src in re.findall(r'<script src="([^"]+)"></script>',standalone):
  code=p5 if src=='../../vendor/p5.min.js' else common if src=='../input.js' else (p/src).read_text()
  standalone=standalone.replace(f'<script src="{src}"></script>','<script>'+code.replace('</script','<\\/script')+'</script>')
 standalone_path=G/'standalone'/(e['slug']+'.html');standalone_path.write_text(standalone)
 license_text=notice+'\n\nOriginal source is included in original/. Derivative JavaScript is licensed CC BY-SA 3.0.\np5.js: LGPL-2.1, https://p5js.org; complete license included in P5-LICENSE.txt.\nImage assets are retained from the original OpenProcessing sketches: '+', '.join(str(f.relative_to(R)) for f in assetfiles)+'\n'
 (p/'LICENSE.txt').write_text(license_text)
 with zipfile.ZipFile(G/'packages'/(e['slug']+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('index.html',standalone);z.writestr('LICENSE.txt',license_text);z.write(R/'vendor/P5-LICENSE.txt','P5-LICENSE.txt')
  for f in (p/'original').glob('*'):z.write(f,'original/'+f.name)
  for s in scripts:z.write(p/s,'adapted/'+s)
  if i<3:
   for f in assetfiles:z.write(f,'original/assets/'+f.name)
 with zipfile.ZipFile(G/'packages'/(e['slug']+'.zip')) as z:assert z.testzip() is None and 'index.html' in z.namelist()
 assert not re.search(r'<script src=|<link rel="stylesheet"',standalone)

(G/'manifest.json').write_text(json.dumps(entries,indent=2))
previews=G/'previews';previews.mkdir(exist_ok=True)
V=Path('/Users/tao/.codex/visualizations/2026/10/08/01a11b38-bb70-7292-b4c6-e4b80961e9d2')
for i,e in enumerate(entries,1):
 src=V/f'upload-art-{i:02}-mobile.jpg'
 if src.exists():shutil.copy(src,previews/(e['slug']+'.jpg'))
cards=''.join(f'<article><a class="preview" href="{e["slug"]}/"><img src="previews/{e["slug"]}.jpg" alt="{e["name"]} actual mobile preview"></a><span>0{i+1} / ART STUDY</span><h2>{e["name"]}</h2><p>{e["hint"]}</p><a href="{e["slug"]}/">Play ↗</a><a href="standalone/{e["slug"]}.html" download>HTML ↓</a><a href="packages/{e["slug"]}.zip" download>ZIP ↓</a></article>' for i,e in enumerate(entries))
(G/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Six Touch Artworks</title><style>*{box-sizing:border-box}body{margin:0;background:#f2eddf;color:#343c35;font-family:Arial,sans-serif;padding:5vw}h1{font:400 clamp(40px,6vw,76px) Georgia,serif;letter-spacing:-2px;max-width:850px}main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}article{padding:22px;background:#fffcf2;border:1px solid #343c3522;border-radius:18px;overflow:hidden}span{font-size:10px;letter-spacing:2px;color:#8b7959}h2{font:28px Georgia,serif}p{font-size:13px;line-height:1.7;min-height:65px}a{display:inline-block;margin:10px 14px 0 0;color:#3c644c;font-size:13px}.preview{display:block;margin:-22px -22px 20px;background:#171c19;height:330px;text-align:center}.preview img{height:100%;width:100%;object-fit:cover;object-position:center}body>p{min-height:auto}@media(max-width:900px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){main{grid-template-columns:1fr}}</style><h1>Six ways to leave<br>a living mark.</h1><p>Independent touch artworks · English · Offline HTML · One ZIP per artwork</p><p><a href="../upload-art-2/">Explore collection two · Six more artworks ↗</a></p><main>'''+cards+'</main></html>')
print('Built six independent HTML artworks and six root-index ZIP files.')
for e in entries:
 f=G/'standalone'/(e['slug']+'.html');print(f.name,round(f.stat().st_size/1024),'KB')
