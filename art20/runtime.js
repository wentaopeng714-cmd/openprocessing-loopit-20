/* Shared canvas, input and drawing utilities. Every scene owns its simulation. */
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
const TAU=Math.PI*2,rand=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
function circle(x,y,r,fill,stroke,lw=1){ctx.beginPath();ctx.arc(x,y,Math.max(.01,r),0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function ellipse(x,y,rx,ry,fill,angle=0,stroke){ctx.beginPath();ctx.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),angle,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function line(x,y,x2,y2,col,w=1){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}
function path(points,fill,stroke,w=1,close=true){if(!points.length)return;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);if(close)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=w;ctx.strokeStyle=stroke;ctx.stroke()}}
function curve(points,col,w=1){if(points.length<2)return;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length-1;i++){let p=points[i],n=points[i+1];ctx.quadraticCurveTo(...p,(p[0]+n[0])/2,(p[1]+n[1])/2)}ctx.lineTo(...points[points.length-1]);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke()}
function gradient(x,y,r,stops){const g=ctx.createRadialGradient(x-r*.2,y-r*.25,0,x,y,Math.max(.1,r));for(const [at,col] of stops)g.addColorStop(at,col);return g}
function wash(a,b){const g=ctx.createLinearGradient(0,0,0,A.h);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,A.w,A.h)}
function label(s,x,y,size=12,col='#fff',align='left',font='Arial'){ctx.fillStyle=col;ctx.font=size+'px '+font;ctx.textAlign=align;ctx.fillText(s,x,y)}
function grain(w,h,amount=900){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');for(let i=0;i<amount;i++){g.fillStyle=i%2?'#ffffff0b':'#00000009';g.fillRect(rand(w),rand(h),rand(1,2),1)}return c}
function layer(){const c=document.createElement('canvas');c.width=A.w;c.height=A.h;return c}
function near(p,q,r){return dist(p.x,p.y,q.x,q.y)<r}
const A={w:innerWidth,h:innerHeight,t:0,dt:1/60,step:1,hands:new Map(),paused:false,hidden:false,scene:null,shade:0,status(s){const e=document.querySelector('[data-status]');if(e)e.textContent=s},select(group,v){document.querySelectorAll('[data-group="'+group+'"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===v)))}};
let fpsTime=0,last=0,frames=0;
function size(){A.w=innerWidth;A.h=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(A.w*d);canvas.height=Math.round(A.h*d);canvas.style.width=A.w+'px';canvas.style.height=A.h+'px';ctx.setTransform(d,0,0,d,0,0);ctx.lineCap='round';ctx.lineJoin='round';A.scene?.resize?.()}
size();A.scene=makeScene(A);A.scene.reset?.();
const point=e=>{const r=canvas.getBoundingClientRect();return{id:e.pointerId,x:(e.clientX-r.left)*A.w/r.width,y:(e.clientY-r.top)*A.h/r.height,dx:0,dy:0,pressure:e.pressure||.5,start:performance.now(),sx:(e.clientX-r.left),sy:(e.clientY-r.top)}};
canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);let p=point(e);A.hands.set(p.id,p);A.scene.down?.(p)});
canvas.addEventListener('pointermove',e=>{const p=A.hands.get(e.pointerId);if(!p){A.scene.hover?.(point(e));return;}e.preventDefault();let q=point(e);q.dx=q.x-p.x;q.dy=q.y-p.y;q.start=p.start;q.sx=p.sx;q.sy=p.sy;A.hands.set(q.id,q);A.scene.move?.(q,p)});
function release(e){const p=A.hands.get(e.pointerId);if(p){A.scene.up?.(p,performance.now()-p.start);A.hands.delete(e.pointerId)}}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);canvas.oncontextmenu=()=>false;
function cancelHands(){for(const p of A.hands.values())A.scene.up?.(p,Infinity);A.hands.clear()}
document.querySelectorAll('button[data-action]').forEach(b=>b.addEventListener('click',()=>{const n=b.dataset.action;if(n==='reset'){cancelHands();A.scene.reset?.()}else if(n==='quiet'){A.hidden=!A.hidden;document.body.classList.toggle('quiet',A.hidden);document.querySelector('.ui').inert=A.hidden}else if(n==='pause'){A.paused=!A.paused;b.textContent=A.paused?'Resume':'Pause'}else A.scene.tool?.(n,b.dataset.value,b)}));
document.querySelectorAll('input').forEach(e=>e.addEventListener('input',()=>A.scene.tool?.(e.dataset.action,e.value,e)));
document.querySelector('[data-reveal]').onclick=()=>{A.hidden=false;document.body.classList.remove('quiet');document.querySelector('.ui').inert=false};
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('[data-reveal]').click();if(e.code==='Space'&&e.target===document.body){e.preventDefault();A.paused=!A.paused}});
window.addEventListener('blur',cancelHands);document.addEventListener('visibilitychange',()=>{last=0;cancelHands()});window.addEventListener('resize',size);
window.addEventListener('error',e=>{document.querySelector('#error').textContent=e.message;canvas.dataset.error=e.message});
function frame(now){requestAnimationFrame(frame);if(document.hidden||A.paused){last=now;return}A.dt=Math.min(.033,last?(now-last)/1000:1/60);A.step=A.dt*60;A.t+=A.dt;last=now;ctx.save();try{A.scene.draw();frames++;if(now-fpsTime>1000){canvas.dataset.frames=frames;fpsTime=now}}catch(e){document.querySelector('#error').textContent=e.message;canvas.dataset.error=e.message;A.paused=true;console.error(e)}ctx.restore()}
requestAnimationFrame(frame);
