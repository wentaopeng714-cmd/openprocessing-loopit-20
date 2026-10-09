// Run the real p5.js and scene code against a DOM simulation and native Canvas.
// This checks scene execution and renders thumbnails; it is not browser UI QA.
const fs=require('fs'),{JSDOM,VirtualConsole}=require('/private/tmp/op-art-runtime/node_modules/jsdom');
const {createCanvas,Image}=require('/Users/tao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
async function createP5(code,w=390,h=844,p5Source,htmlBody){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));
 const dom=new JSDOM(htmlBody||'<!doctype html><html><body><main id="ui"></main><div id="error"></div></body></html>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://example.test/',virtualConsole:vc});
 const win=dom.window;let now=0,ids=0,raf=new Map();Object.defineProperty(win,'innerWidth',{value:w,configurable:true});Object.defineProperty(win,'innerHeight',{value:h,configurable:true});Object.defineProperty(win,'devicePixelRatio',{value:1});Object.defineProperty(win.performance,'now',{value:()=>now});
 win.requestAnimationFrame=f=>{raf.set(++ids,f);return ids};win.cancelAnimationFrame=id=>raf.delete(id);win.fetch=global.fetch;win.Request=global.Request;win.Response=global.Response;win.Headers=global.Headers;win.Image=Image;
 for(const key of ['width','height']){const d=Object.getOwnPropertyDescriptor(win.HTMLCanvasElement.prototype,key);Object.defineProperty(win.HTMLCanvasElement.prototype,key,{get:d.get,set(v){d.set.call(this,v);if(this.native)this.native[key]=v;},configurable:true});}
 win.HTMLCanvasElement.prototype.getContext=function(kind){if(kind!=='2d')return null;if(!this.native)this.native=createCanvas(this.width,this.height);if(this.native.width!==this.width)this.native.width=this.width;if(this.native.height!==this.height)this.native.height=this.height;const c=this.native.getContext('2d');if(!this.proxy)this.proxy=new Proxy(c,{get(o,k){if(k==='drawImage')return(s,...a)=>o.drawImage(s.native||s,...a);const v=Reflect.get(o,k,o);return typeof v==='function'?v.bind(o):v},set(o,k,v){o[k]=(["shadowColor","fillStyle","strokeStyle"].includes(k)&&typeof v==="object")?String(v):v;return true}});return this.proxy};
 win.HTMLCanvasElement.prototype.toDataURL=function(...args){return this.native.toDataURL(...args)};win.HTMLCanvasElement.prototype.getBoundingClientRect=function(){return{x:0,y:0,left:0,top:0,right:w,bottom:h,width:w,height:h}};
 win.addEventListener('error',e=>errors.push(e.error?.stack||e.message));
 win.eval(p5Source||fs.readFileSync(require('path').join(__dirname,'../vendor/p5.min.js'),'utf8'));win.eval(code);
 await new Promise(resolve=>win.addEventListener('load',()=>setImmediate(resolve),{once:true}));
 const inst=win.p5.instance; if(!inst)throw Error('p5 instance did not start: '+errors);
 const frames=n=>{for(let i=0;i<n;i++){now+=1000/60;let pending=[...raf.values()];raf.clear();for(const f of pending)f(now);if(errors.length)throw Error(errors.join('\n'))}};
 return{win,inst,dom,errors,frames,canvas:()=>win.document.querySelector('canvas')?.native,close:()=>win.close()};
}
module.exports={createP5};
if(require.main===module)(async()=>{const r=await createP5(fs.readFileSync(process.argv[2],'utf8'));r.frames(180);fs.writeFileSync('/private/tmp/p5-native-test.png',r.canvas().toBuffer('image/png'));console.log('Rendered real p5.js source; '+r.win.frameCount+' frames, '+r.errors.length+' errors');r.close()})().catch(e=>{console.error(e);process.exit(1)});
