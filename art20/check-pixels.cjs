// Compare identical seeded renders with and without each work's main gesture.
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const {createCanvas}=require('/Users/tao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const base=__dirname,entries=JSON.parse(fs.readFileSync(path.join(base,'manifest.json')));
const gestures=[[[200,350],[240,370]],[[305,400],[230,450]],[[180,420],[270,320]],[[195,295],[280,360]],[[117,295],[185,330]],[[195,300],[280,420]],[[140,340],[280,500]],[[187,295],[260,450]],[[120,430],[280,500]],[[195,390],[250,430]],[[180,550],[210,540]],[[117,337],[190,250]],[[195,365],[220,400]],[[250,400],[280,430]],[[200,400],[220,440]],[[200,400],[240,380]],[[195,400],[235,410]],[[190,400],[250,430]],[[200,600],[270,650]],[[195,465],[195,410]]];
function run(entry,gesture){
 const w=390,h=844,main=createCanvas(w,h),error={textContent:''},handlers={};main.dataset={};main.style={};main.addEventListener=(n,f)=>handlers[n]=f;main.getBoundingClientRect=()=>({left:0,top:0,width:w,height:h});main.setPointerCapture=()=>{};
 const node={textContent:'',classList:{toggle(){},remove(){}},setAttribute(){}};
 const document={hidden:false,body:node,querySelector:s=>s==='canvas'?main:s==='#error'?error:node,querySelectorAll:()=>[],createElement:()=>createCanvas(w,h),addEventListener(){}};
 let next,now=0,seed=12983;const math=Object.create(Math);math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 const sandbox={document,window:{addEventListener(){}},innerWidth:w,innerHeight:h,devicePixelRatio:1,performance:{now:()=>now},console,requestAnimationFrame:f=>next=f,Math:math,Map};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(base,entry.slug,'scene.js'),'utf8')+'\n'+fs.readFileSync(path.join(base,'runtime.js'),'utf8'),sandbox);
 const frame=n=>{for(let i=0;i<n;i++){now+=1000/60;next(now)}};
 const pointer=(n,p)=>{if(gesture)handlers[n]?.({pointerId:1,clientX:p[0],clientY:p[1],pressure:.5,preventDefault(){}})};
 frame(120);let [a,b]=gestures[entries.indexOf(entry)];pointer('pointerdown',a);frame(30);
 for(let i=1;i<=30;i++){pointer('pointermove',[a[0]+(b[0]-a[0])*i/30,a[1]+(b[1]-a[1])*i/30]);frame(2)}
 pointer('pointerup',b);frame(90);
 if(error.textContent)throw Error(entry.slug+': '+error.textContent);
 return crypto.createHash('sha256').update(main.toBuffer('image/png')).digest('hex');
}
const results=[];
for(const e of entries){let baseline=run(e,false),interaction=run(e,true);if(baseline===interaction)throw Error('Gesture had no visible effect: '+e.slug);results.push({slug:e.slug,baseline,interaction});console.log(e.slug+' visible gesture response')}
fs.writeFileSync(path.join(base,'pixel-checks.json'),JSON.stringify(results,null,2));
