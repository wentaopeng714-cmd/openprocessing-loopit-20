// Shared pointer and presentation layer only. Independent artwork simulations below.
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
