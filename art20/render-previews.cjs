// Render the actual scene code through a native Canvas implementation.
// These are artwork thumbnails, not browser UI screenshots.
const fs=require('fs'),vm=require('vm'),path=require('path');
const {createCanvas}=require('/Users/tao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const base=__dirname,entries=JSON.parse(fs.readFileSync(path.join(base,'manifest.json')));
for(const e of entries.filter(e=>!process.argv[2]||e.slug.startsWith(process.argv[2]))){
 const w=640,h=960,main=createCanvas(w,h),error={textContent:''};main.dataset={};main.style={};main.addEventListener=()=>{};main.getBoundingClientRect=()=>({left:0,top:0,width:w,height:h});
 const node={textContent:'',classList:{toggle(){},remove(){}},setAttribute(){}};
 const document={hidden:false,body:node,querySelector:s=>s==='canvas'?main:s==='#error'?error:node,querySelectorAll:()=>[],createElement:()=>createCanvas(w,h),addEventListener(){}};
 let next;const sandbox={document,window:{addEventListener(){}},innerWidth:w,innerHeight:h,devicePixelRatio:1,performance:{now:()=>0},console,requestAnimationFrame:f=>next=f,Math,Map};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(base,e.slug,'scene.js'),'utf8')+'\n'+fs.readFileSync(path.join(base,'runtime.js'),'utf8'),sandbox);
 if(e.slug.startsWith('09-'))vm.runInContext("A.scene.tool('circles')",sandbox);
 if(e.slug.startsWith('07-'))vm.runInContext("for(let i=0;i<80;i++){let a=i/80*Math.PI*2,p={x:A.w*.5+Math.cos(a)*100,y:A.h*.5+Math.sin(a)*125},q={x:A.w*.5+Math.cos(a-.08)*100,y:A.h*.5+Math.sin(a-.08)*125};A.scene.move(p,q)}",sandbox);
 for(let i=0;i<240;i++)next((i+1)*1000/60);
 if(error.textContent)throw Error(e.slug+': '+error.textContent);
 fs.writeFileSync(path.join(base,'previews',e.slug+'.jpg'),main.toBuffer('image/jpeg',85));
 console.log(e.slug);
}
