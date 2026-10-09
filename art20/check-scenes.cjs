// Geometry and input smoke checks; this does not replace visual browser review.
const fs=require('fs'),vm=require('vm'),path=require('path');
const base=__dirname,manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json')));
let checks=0;
function context(){let stack=0;return new Proxy({
 save(){stack++},restore(){if(--stack<0)throw Error('Unbalanced restore')},
 createLinearGradient(...a){finite(a);return{addColorStop(at){if(!Number.isFinite(at)||at<0||at>1)throw Error('Invalid gradient stop')}}},
 createRadialGradient(...a){finite(a);if(a[2]<0||a[5]<0)throw Error('Negative radius');return this.createLinearGradient()},
 measureText(s){return{width:s.length*6}},
 },{get(o,k){if(k in o)return o[k];return(...a)=>{finite(a);if(k==='arc'&&a[2]<0||k==='ellipse'&&(a[2]<0||a[3]<0))throw Error('Negative '+k);checks++}},set(o,k,v){if(typeof v==='number'&&!Number.isFinite(v))throw Error('Non-finite '+k);o[k]=v;return true}})}
function finite(a){if(a.some(v=>typeof v==='number'&&!Number.isFinite(v)))throw Error('Non-finite drawing geometry: '+a)}
function element(attrs={}){const handlers={};return{dataset:attrs,style:{},textContent:'',inert:false,classList:{toggle(){},remove(){}},addEventListener(n,f){handlers[n]=f},setAttribute(){},click(){handlers.click?.()},_handlers:handlers}}
function canvas(w,h){const c=element();c.getContext=()=>context();c.getBoundingClientRect=()=>({left:0,top:0,width:w,height:h});c.setPointerCapture=()=>{};return c}
const results=[];
for(const entry of manifest)for(const [w,h]of [[390,844],[1440,900]]){
 const main=canvas(w,h),status=element(),error=element(),ui=element(),reveal=element(),body=element(),events={};
 const html=fs.readFileSync(path.join(base,entry.slug,'index.html'),'utf8');
 const controls=[...html.matchAll(/<(button|input)\b([^>]*data-action="[^"]+"[^>]*)>/g)].map(m=>{const attr=n=>m[2].match(new RegExp('(?:^|\\s)'+n+'="([^"]*)"'))?.[1];const e=element({action:attr('data-action'),value:attr('data-value'),group:attr('data-group')});e.value=attr('value');e.tag=m[1];e.min=attr('min');e.max=attr('max');return e});
 const document={body,hidden:false,createElement:()=>canvas(w,h),addEventListener(n,f){events[n]=f},querySelector(s){return s==='canvas'?main:s==='#error'?error:s==='.ui'?ui:s==='[data-reveal]'?reveal:status},querySelectorAll(s){return s==='button[data-action]'?controls.filter(e=>e.tag==='button'):s==='input'?controls.filter(e=>e.tag==='input'):controls.filter(e=>e.dataset.group)}};
 let next,now=0;const logs=[];
 const sandbox={document,window:{addEventListener(n,f){events[n]=f}},innerWidth:w,innerHeight:h,devicePixelRatio:2,performance:{now:()=>now},console:{error:e=>logs.push(String(e))},requestAnimationFrame:f=>next=f,Math,Map};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(base,entry.slug,'scene.js'),'utf8')+'\n'+fs.readFileSync(path.join(base,'runtime.js'),'utf8'),sandbox);
 function frames(n){for(let i=0;i<n;i++){now+=1000/60;next(now)}if(error.textContent||logs.length)throw Error(entry.slug+' '+w+' '+error.textContent+' '+logs)}
 function pointer(n,x,y,id=1){main._handlers[n]?.({pointerId:id,clientX:x,clientY:y,pressure:.5,preventDefault(){}})}
 frames(150);
 for(const c of controls){if(c.tag==='input'){for(const v of [c.min,c.max]){c.value=v;c._handlers.input?.();frames(20)}}else{c.click();frames(10);if(c.dataset.action==='quiet'){reveal.onclick();frames(5)}}}
 for(let pass=0;pass<3;pass++){
  let x=w*(.3+pass*.2),y=h*.48;pointer('pointerdown',x,y);frames(30);
  for(let i=0;i<40;i++){pointer('pointermove',x+Math.sin(i*.16)*w*.13,y+Math.cos(i*.16)*h*.12);frames(2)}
  pointer('pointerup',x,y);frames(90);
 }
 // Exercise multi-pointer release and resize/reset paths.
 pointer('pointerdown',w*.4,h*.5,7);pointer('pointerdown',w*.6,h*.55,8);frames(30);
 pointer('pointercancel',w*.4,h*.5,7);pointer('pointerup',w*.6,h*.55,8);events.resize();frames(40);
 if(!+main.dataset.frames)throw Error('No animation frames');
 results.push({slug:entry.slug,width:w,frames:+main.dataset.frames,error:null});
}
fs.writeFileSync(path.join(base,'geometry-checks.json'),JSON.stringify({checks,results},null,2));
console.log('Passed '+results.length+' scene/viewport runs; '+checks+' drawing operations checked.');
