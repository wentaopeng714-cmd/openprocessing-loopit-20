/* Twenty independent interaction models. Rendering and smooth interpolation are shared;
   input rules, persistence, simulation and outcomes belong to each subject. */
(()=>{'use strict';const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
class Interaction{
constructor(art){this.art=art;this.kind=art.kind;this.time=0;this.start=new Map();this.reset();}
reset(){this.s={expression:0,gaze:0,eye:1,tool:0,hills:new Float32Array(48),sun:{x:748,y:226},food:[],fish:Array.from({length:3},(_,i)=>({x:500+Math.cos(i*TAU/3)*245,y:500+Math.sin(i*TAU/3)*245,a:i*TAU/3+Math.PI/2})),flowers:[],water:0,lightPaths:[],pathByPointer:new Map(),level:.3,heat:.5,stir:0,tea:0,comfort:0,yarn:{x:690,y:780},currents:[],jellies:[{x:0,y:0},{x:0,y:0},{x:0,y:0}],pulse:0,threads:[],thread:[],color:0,grooves:[],grooveMask:new Float32Array(4096),rocks:[],perches:[{x:500,y:490}],butter:{x:500,y:490},flying:false,mist:new Float32Array(1024).fill(1),rain:1,angle:0,omega:.6,needle:true,arm:0,gust:0,season:0,falls:new Map(),phase:0,craters:[],tide:0,ripples:[],cuts:Array.from({length:4},()=>({a:null,amount:0,dx:0,dy:0})),juice:[],folds:[0,0],foldTargets:[0,0],wells:[],wellByPointer:new Map(),mass:1600,comets:[],brightness:.7,on:true,cord:0,cordV:0,pull:0,warmth:0,boats:[],boatByPointer:new Map(),sea:0};this.start.clear();this.art.points?.forEach(p=>{p.falling=0;p.vx=0;p.vy=0;});}
message(t){this.art.onGesture(t);}
down(p,id){this.start.set(id,{...p});let s=this.s;switch(this.kind){
case'face':this.face(p);this.message(p.y>540?'Sculpt the smile.':'Raise the brows. Shift the gaze.');break;
case'ink':if(s.tool===1)s.sun={...p};this.message(s.tool?'Move the sun through your landscape.':'Pull up a ridge. Your mountains stay.');break;
case'koi':this.feed(p);this.message('The fish will follow your food trail.');break;
case'bloom':if(s.tool===0){s.flowers.push({...p,growth:0,hue:s.flowers.length%4});s.flowers=s.flowers.slice(-18);}else s.water=1;this.message(s.tool?'Hold over a seed to help it bloom.':'A seed is planted. Switch to Water to grow it.');break;
case'aurora':let ribbon={points:[{...p}],color:s.color};s.lightPaths.push(ribbon);s.pathByPointer.set(id,ribbon);s.lightPaths=s.lightPaths.slice(-12);this.message('Draw a ribbon. Use two fingers to stretch its flow.');break;
case'tea':s.tool=p.y<420?0:1;this.message(s.tool?'Circle inside the cup to stir.':'Hold above the cup to pour.');break;
case'cat':if(s.tool)s.yarn={...p};else s.comfort=Math.min(1,s.comfort+.1);this.message(s.tool?'Roll the yarn. Watch the paw follow.':'Stroke the head to earn a sleepy purr.');break;
case'jelly':s.pulse=1;this.message('Draw a current. The jellyfish swim with it.');break;
case'fabric':s.thread=[{...p}];this.message('Draw across the loom to lay a lasting thread.');break;
case'dunes':if(s.tool){s.rocks.push({...p,r:18+Math.random()*18});s.rocks=s.rocks.slice(-18);}else{s.grooves.push([{...p}]);this.rake(p);}this.message(s.tool?'Place a stone. Rake around it.':'Draw slowly: the rake leaves eight lasting grooves.');break;
case'butterfly':s.perches.push({...p});s.perches=s.perches.slice(-8);s.flying=true;this.message('A new perch. Hold still and let the butterfly land.');break;
case'rain':this.wipe(p);this.message('Wipe a path through the fog. It slowly clouds again.');break;
case'vinyl':if(p.x>730){s.arm=clamp((p.y-280)/380,0,1);s.needle=true;}else{s.heldAngle=Math.atan2(p.y-500,p.x-500);s.omega=0;}this.message(p.x>730?'Move the needle to another groove.':'Spin or scratch the record. Let go for momentum.');break;
case'tree':s.gust=.5;this.message('Swipe quickly to send leaves falling. Tap to grow them back.');break;
case'moon':if(p.y<730&&Math.hypot(p.x-500,p.y-455)<260){s.craters.push({...p,r:12+Math.random()*22});s.craters=s.craters.slice(-16);}else s.ripples.push({...p,age:0});this.message('Swipe the moon to reveal its phases. Tap to leave a crater.');break;
case'fruit':s.selected=this.nearestFruit(p);this.message(s.tool?'Hold to squeeze a little juice.':'Swipe across an orange to slice it in two.');break;
case'crane':s.activeSide=p.x<500?0:1;this.message('Drag a wing across its hinge. The fold stays in place.');break;
case'galaxy':{let w=s.wells.find(w=>dist(w,p)<55);if(!w){w={...p,m:s.mass};s.wells.push(w);s.wells=s.wells.slice(-5);}s.activeWell=w;s.wellByPointer.set(id,w);this.message('A gravity well is born. Drag it; hold to deepen it.');break;}
case'lamp':s.tool=p.y>600&&Math.abs(p.x-720)<160?1:0;this.message(s.tool?'Pull the cord down, then release.':'Slide over the shade to dim the light.');break;
case'ocean':{let boat=s.boats.find(b=>dist(b,p)<70);if(!boat){boat={...p,y:clamp(p.y,320,710),base:clamp(p.y,320,710),a:0};s.boats.push(boat);s.boats=s.boats.slice(-6);}s.activeBoat=boat;s.boatByPointer.set(id,boat);s.ripples.push({...p,age:0,amp:32});this.message('Launch a boat. Drag to steer it through the waves.');break;}}
}
move(p,old,id){let s=this.s,dx=p.x-old.x,dy=p.y-old.y;switch(this.kind){
case'face':this.face(p);break;
case'ink':if(s.tool)s.sun={...p};else for(let i=0;i<48;i++)s.hills[i]=clamp(s.hills[i]+dy*Math.exp(-Math.pow((i*1000/48-p.x)/95,2))*.7,-230,170);break;
case'koi':if(!s.food.length||dist(s.food.at(-1),p)>22)this.feed(p);break;
case'bloom':if(s.tool)this.waterAt(p,.08);break;
case'aurora':{let path=s.pathByPointer.get(id);if(path&&dist(path.points.at(-1),p)>5){path.points.push({...p});if(path.points.length>180)path.points.shift();}break;}
case'tea':if(s.tool)s.stir+=dx*.03-dy*.015;else s.heat=1;break;
case'cat':if(s.tool)s.yarn={...p};else s.comfort=clamp(s.comfort+(Math.abs(dx)+Math.abs(dy))*.0015,0,1);break;
case'jelly':s.currents.push({...p,dx:clamp(dx,-18,18),dy:clamp(dy,-18,18)});s.currents=s.currents.slice(-90);break;
case'fabric':if(dist(s.thread.at(-1)||p,p)>5){s.thread.push({...p});if(s.thread.length>240)s.thread.shift();}break;
case'dunes':if(!s.tool){let path=s.grooves.at(-1);if(path&&dist(path.at(-1),p)>5){path.push({...p});if(path.length>200)path.shift();this.rake(p);}s.grooves=s.grooves.slice(-12);}break;
case'butterfly':s.perches[s.perches.length-1]={...p};s.flying=true;break;
case'rain':this.wipe(p);break;
case'vinyl':if(p.x>730&&this.start.get(id)?.x>730)s.arm=clamp((p.y-280)/380,0,1);else{let a=Math.atan2(p.y-500,p.x-500),da=wrap(a-(s.heldAngle??a));s.angle+=da;s.omega=clamp(da*35,-10,10);s.heldAngle=a;}break;
case'tree':s.gust=clamp(dx*.045,-3,3);break;
case'moon':if(p.y<730)s.phase=wrap(s.phase+dx*.012);else if(Math.abs(dx)+Math.abs(dy)>10)s.ripples.push({...p,age:0});s.ripples=s.ripples.slice(-20);break;
case'fruit':if(s.tool)this.squeeze(p);break;
case'crane':{let side=this.start.get(id)?.x<500?0:1;s.foldTargets[side]=clamp((p.x-500)*(side===0?1:-1)/280+1,0,1.8);break;}
case'galaxy':{let well=s.wellByPointer.get(id);if(well){well.x=p.x;well.y=p.y;}}break;
case'lamp':if(s.tool)s.pull=clamp(p.y-(this.start.get(id)?.y||p.y),0,160);else{s.brightness=clamp(1-(p.y-300)/330,.03,1);s.on=true;s.cordV+=dx*.0003;}break;
case'ocean':{let boat=s.boatByPointer.get(id);if(boat){boat.x=clamp(p.x,50,950);boat.base=clamp(p.y,280,750);}}s.ripples.push({...p,age:0,amp:clamp(dy*2,-60,60)});s.ripples=s.ripples.slice(-24);break;
}}
up(p,id){let s=this.s,a=this.start.get(id)||p;switch(this.kind){case'aurora':s.pathByPointer.delete(id);break;case'fabric':if(s.thread.length>2){s.threads.push({points:s.thread,color:s.color});s.threads=s.threads.slice(-45);}s.thread=[];break;case'fruit':if(!s.tool&&dist(a,p)>85)this.slice(a,p);break;case'tree':if(dist(a,p)<18){s.falls.clear();s.season=1;s.comfort=1;}break;case'lamp':if(s.pull>48)s.on=!s.on;s.cordV+=s.pull*.001;s.pull=0;break;case'vinyl':s.heldAngle=null;break;case'galaxy':s.activeWell=null;s.wellByPointer.delete(id);break;case'ocean':s.activeBoat=null;s.boatByPointer.delete(id);break;}this.start.delete(id);}
rake(p){for(let y=Math.max(0,Math.floor(p.y/1000*64)-2);y<Math.min(64,p.y/1000*64+3);y++)for(let x=Math.max(0,Math.floor(p.x/1000*64)-2);x<Math.min(64,p.x/1000*64+3);x++)this.s.grooveMask[y*64+x]=1;}
face(p){let s=this.s;if(p.y>535)s.expression=clamp((p.x-500)/110,-1,1);else{s.gaze=clamp((p.x-500)/180,-1,1);s.eye=clamp((p.y-290)/130,.12,1.4);}}
feed(p){this.s.food.push({...p,age:0});this.s.food=this.s.food.slice(-65);}
waterAt(p,n){for(let f of this.s.flowers)if(dist(p,f)<150)f.growth=clamp(f.growth+n,0,1);this.s.water=clamp(this.s.water+n*.12,0,1);}
wipe(p){for(let y=0;y<32;y++)for(let x=0;x<32;x++){let d=Math.hypot(x*1000/32-p.x,y*1000/32-p.y);if(d<65)this.s.mist[y*32+x]=Math.min(this.s.mist[y*32+x],Math.pow(d/65,3));}}
nearestFruit(p){let best=0,d=Infinity;for(let j=0;j<4;j++){let q={x:295+j*135,y:430+(j%2)*140},n=dist(p,q);if(n<d){d=n;best=j}}return best;}
slice(a,b){let s=this.s,dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy;for(let j=0;j<4;j++){let c={x:295+j*135,y:430+(j%2)*140};let t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/d2,0,1);if(dist(c,{x:a.x+dx*t,y:a.y+dy*t})<75){s.cuts[j].a=Math.atan2(dy,dx);this.squeeze(c);this.message('A fresh cut. Swipe another angle, or squeeze the juice.');}}}
squeeze(p){for(let i=0;i<7;i++)this.s.juice.push({...p,vx:(Math.random()-.5)*120,vy:-60-Math.random()*90,life:1});this.s.juice=this.s.juice.slice(-160);}
update(dt){let s=this.s;this.time+=dt;switch(this.kind){
case'koi':for(let f of s.fish){let food=s.food.reduce((best,q)=>!best||dist(f,q)<dist(f,best)?q:best,null),q=food||{x:500+Math.cos(this.time*.18+s.fish.indexOf(f)*TAU/3)*245,y:500+Math.sin(this.time*.18+s.fish.indexOf(f)*TAU/3)*245},d=dist(f,q),a=Math.atan2(q.y-f.y,q.x-f.x);f.a+=wrap(a-f.a)*dt*2;f.x+=Math.cos(f.a)*Math.min(65,d*1.5)*dt;f.y+=Math.sin(f.a)*Math.min(65,d*1.5)*dt;if(food&&d<30){s.food.splice(s.food.indexOf(food),1);this.art.rings.push({...f,life:1});}}s.food.forEach(f=>f.age+=dt);s.food=s.food.filter(f=>f.age<45);break;
case'bloom':if(s.tool&&this.art.pointers.size)for(let q of this.art.pointers.values())this.waterAt(q,dt*.3);s.water*=Math.exp(-dt*.06);break;
case'aurora':if(this.art.pointers.size===2){let [a,b]=[...this.art.pointers.values()];s.stretch=clamp(dist(a,b)/300,.4,2.4);}break;
case'tea':if(this.art.pointers.size&&s.tool===0){s.level=clamp(s.level+dt*.12,0,1);s.heat=1;}s.heat=Math.max(.1,s.heat-dt*.008);s.stir*=Math.exp(-dt*.5);break;
case'cat':s.comfort=Math.max(0,s.comfort-dt*.015);break;
case'jelly':s.pulse*=Math.exp(-dt*1.3);for(let j=0;j<3;j++){let q={x:300+j*210+s.jellies[j].x,y:400+s.jellies[j].y};for(let w of s.currents){let f=Math.exp(-Math.pow(dist(q,w)/210,2));s.jellies[j].x+=w.dx*f*dt*.45;s.jellies[j].y+=w.dy*f*dt*.45;}s.jellies[j].x=clamp(s.jellies[j].x,-170,170);s.jellies[j].y=clamp(s.jellies[j].y,-130,130);}break;
case'butterfly':{let q=s.perches.at(-1),d=dist(s.butter,q);s.butter.x+=(q.x-s.butter.x)*dt*1.2;s.butter.y+=(q.y-s.butter.y)*dt*1.2;s.flying=d>12;break;}
case'rain':for(let i=0;i<1024;i++)s.mist[i]=Math.min(1,s.mist[i]+dt*.016);break;
case'vinyl':if(s.heldAngle==null){s.angle+=s.omega*dt;s.omega*=Math.exp(-dt*.018);}break;
case'tree':s.gust*=Math.exp(-dt*.8);if(Math.abs(s.gust)>.8)for(let p of this.art.points)if(p.g===1&&!s.falls.has(p)&&Math.random()<dt*Math.abs(s.gust)*.12)s.falls.set(p,{x:p.hx,y:p.hy,vx:s.gust*40,vy:15});for(let [p,f]of s.falls){f.vy+=dt*16;f.x+=f.vx*dt;f.y=Math.min(885+Math.sin(p.seed)*20,f.y+f.vy*dt);f.vx*=Math.exp(-dt*.15);}break;
case'fruit':s.cuts.forEach(x=>{if(x.a!=null)x.amount=Math.min(1,x.amount+dt*2)});for(let q of s.juice){q.vy+=dt*130;q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt*.3;}s.juice=s.juice.filter(q=>q.life>0);if(s.tool&&this.art.pointers.size)for(let q of this.art.pointers.values())if(Math.random()<dt*8)this.squeeze(q);break;
case'crane':for(let j=0;j<2;j++)s.folds[j]+=(s.foldTargets[j]-s.folds[j])*Math.min(dt*7,1);break;
case'galaxy':for(let w of s.wellByPointer.values())w.m=Math.min(14000,w.m+dt*850);break;
case'lamp':s.cordV+=(-s.cord*.9-s.cordV*.7)*dt;s.cord+=s.cordV*dt;break;
case'ocean':for(let b of s.boats){if(![...s.boatByPointer.values()].includes(b))b.x=clamp(b.x+Math.sin(this.time+b.base)*dt*7,45,955);b.y=b.base+this.wave(b.x,b.base);b.a=(this.wave(b.x+5,b.base)-this.wave(b.x-5,b.base))*.03;}break;
}for(let w of s.ripples)w.age+=dt;s.ripples=s.ripples.filter(w=>w.age<14);}
wave(x,y){let z=Math.sin(x*.014+this.time*1.1)*15;for(let w of this.s.ripples){let d=Math.hypot(x-w.x,(y-w.y)*.5);z+=Math.sin(d*.045-w.age*3)*Math.exp(-Math.abs(d-w.age*60)/140)*(w.amp||24)*Math.exp(-w.age*.2)}return z+this.s.sea;}
target(p,x,y,t){let s=this.s,k=this.kind,g=p.g,alpha=1,color;
switch(k){
case'face':if(g===100)y+=s.expression*(24-48*Math.pow((x-500)/57,2));if(g===101){y=398+(y-398)*s.eye;x+=s.gaze*6;}if(g===102)y-=s.gaze*14;break;
case'ink':if(g===90){x+=s.sun.x-748;y+=s.sun.y-226;}else if(y>260&&y<760){let a=clamp(x/1000*47,0,47),i=Math.floor(a);y+=(s.hills[i]||0)*(1-(a-i))+(s.hills[Math.min(i+1,47)]||0)*(a-i);}break;
case'koi':if(g>=1&&g<=3){let j=g-1,f=s.fish[j],a=j*TAU/3,ox=500+Math.cos(a)*245,oy=500+Math.sin(a)*245,da=f.a-(a+Math.PI/2),dx=p.hx-ox,dy=p.hy-oy;x=f.x+dx*Math.cos(da)-dy*Math.sin(da);y=f.y+dx*Math.sin(da)+dy*Math.cos(da)+Math.sin(t*4+dx*.025)*5;}break;
case'bloom':if(p.hy<650){let q=.35+s.water*.7;x=500+(p.hx-500)*q;y=465+(p.hy-465)*q;}break;
case'aurora':if(g!==100){y=p.hy+(s.stretch||1)*Math.sin(x*.008+t*(s.reverse?-1:1))*38;}break;
case'tea':if(g>=20){x=p.hx+Math.sin(t*2+p.hy*.02+s.stir)*25*s.heat;y=p.hy-(s.heat-.5)*90;alpha=.2+s.heat*.8;}break;
case'cat':if(g===101)y=457+(p.hy-457)*(1-s.comfort*.85);if(p.hy<670){x+=clamp((s.yarn.x-500)*.06,-20,20);y+=Math.sin(t*(s.comfort>.4?7:1))*s.comfort*1.4;}break;
case'jelly':{let j=g>=10?g-10:g,off=s.jellies[j];if(off){x=p.hx+off.x+Math.sin(t*1.5+p.hy*.013)*12;y=p.hy+off.y+Math.sin(t*1.2+j)*14;if(g<10){let ox=300+j*210;x=ox+off.x+(p.hx-ox)*(1-s.pulse*.2);}}break;}
case'fabric':y=p.hy+Math.sin(x*.007+s.threads.length*.15)*4;break;
case'dunes':if(g!==90){let ix=clamp(Math.floor(p.hx/1000*64),0,63),iy=clamp(Math.floor(p.hy/1000*64),0,63);if(s.grooveMask[iy*64+ix])y+=Math.sin((p.hx+p.hy)*.55)*5;}break;
case'butterfly':{let wing=!!g,f=s.flying?(.35+Math.abs(Math.sin(t*7))*.65):.9,scale=.55;x=s.butter.x+(p.hx-500)*scale*(wing?f:1);y=s.butter.y+(p.hy-490)*scale;}break;
case'rain':if(g===1){y=170+((p.hy-170+t*(s.rain===2?60:24))%610);let ix=clamp(Math.floor(x/1000*32),0,31),iy=clamp(Math.floor(y/1000*32),0,31);alpha=s.mist[iy*32+ix];}break;
case'vinyl':if(g===1){let dx=p.hx-500,dy=p.hy-500;x=500+dx*Math.cos(s.angle)-dy*Math.sin(s.angle);y=500+dx*Math.sin(s.angle)+dy*Math.cos(s.angle);}if(g===3)y=p.hy+(s.needle?Math.sin(p.hx*.06+t*(4+s.omega))*Math.abs(s.omega)*3:0);break;
case'tree':if(g===1){let f=s.falls.get(p);if(f){x=f.x;y=f.y;}else{x=p.hx+s.gust*16*Math.sin(p.hy*.006);y=p.hy+Math.cos(t+p.seed)*2;}if(s.season)color=palettesForTree(p.seed);}break;
case'moon':if(g===1){let nx=(p.hx-500)/280,ny=(p.hy-455)/280,nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));alpha=.05+.95*Math.max(0,nz*Math.cos(s.phase)+nx*Math.sin(s.phase));}else y=p.hy+this.wave(p.hx,p.hy)*.35;break;
case'fruit':if(g<=3){let cut=s.cuts[g];if(cut.a!=null){let ox=295+g*135,oy=430+(g%2)*140,nx=-Math.sin(cut.a),ny=Math.cos(cut.a),side=Math.sign((p.hx-ox)*nx+(p.hy-oy)*ny)||1;x=p.hx+nx*side*cut.amount*42;y=p.hy+ny*side*cut.amount*42;}}break;
case'crane':{if(g!==0&&g!==3)break;let side=g===0?0:1,fold=s.folds[side],a=fold*Math.PI*.78,hinge=483;x=hinge+(p.hx-hinge)*Math.cos(a);y=p.hy+Math.sin(a)*(p.hx-hinge)*.35;alpha=.5+.5*Math.abs(Math.cos(a));}break;
case'lamp':if(g===1){x=p.hx+Math.sin(s.cord)*35;y=p.hy+Math.abs(s.cord)*8;alpha=s.on?.2+s.brightness*.8:.12;}break;
case'ocean':if(g!==90)y=p.hy+this.wave(p.hx,p.hy);break;
}return{x,y,alpha,color};}
physics(p,ratio){if(this.kind!=='galaxy')return false;let s=this.s;if(!p.orbit){let dx=p.x-500,dy=p.y-500,d=Math.max(1,Math.hypot(dx,dy));p.vx=-dy/d*.7;p.vy=dx/d*.7;p.orbit=true;}for(let w of s.wells){let dx=w.x-p.x,dy=w.y-p.y,d2=dx*dx+dy*dy+900,d=Math.sqrt(d2),f=w.m/d2;p.vx+=dx/d*f*ratio;p.vy+=dy/d*f*ratio;if(d<36){p.x=500+Math.cos(p.seed+this.time)*440;p.y=500+Math.sin(p.seed+this.time)*330;p.orbit=false;}}let speed=Math.hypot(p.vx,p.vy);if(speed>5){p.vx*=5/speed;p.vy*=5/speed;}p.x+=p.vx*ratio;p.y+=p.vy*ratio;if(p.x<20||p.x>980||p.y<30||p.y>970){p.x=clamp(p.x,20,980);p.y=clamp(p.y,30,970);p.vx*=-.8;p.vy*=-.8;}return true;}
controls(){return{
face:[['Soft smile',()=>{this.s.expression=1;this.message('Now sculpt another expression directly on the face.')}],['Open eyes',()=>this.s.eye=1]],
ink:[['Shape ridges',()=>this.s.tool=0],['Move sun',()=>this.s.tool=1],['Erode',()=>{for(let i=0;i<48;i++)this.s.hills[i]*=.4}]],
koi:[['Feed a trail',()=>{for(let i=0;i<12;i++)this.feed({x:350+i*25,y:500+Math.sin(i)*45})}]],
bloom:[['Plant',()=>this.s.tool=0],['Water',()=>this.s.tool=1]],aurora:[['Next ribbon',()=>this.s.color=(this.s.color+1)%4],['Reverse flow',()=>this.s.reverse=!this.s.reverse]],
tea:[['Green tea',()=>this.s.tea=0],['Rose tea',()=>this.s.tea=1]],cat:[['Pet',()=>this.s.tool=0],['Yarn',()=>this.s.tool=1]],
jelly:[['Light pulse',()=>this.s.pulse=1],['Still water',()=>this.s.currents=[]]],fabric:[['Coral',()=>this.s.color=0],['Gold',()=>this.s.color=1],['Teal',()=>this.s.color=2],['Undo thread',()=>this.s.threads.pop()]],
dunes:[['Rake',()=>this.s.tool=0],['Stone',()=>this.s.tool=1]],butterfly:[['New perch',()=>{this.s.perches.push({x:250+Math.random()*500,y:300+Math.random()*350});this.s.perches=this.s.perches.slice(-8)}]],
rain:[['Heavy rain',()=>this.s.rain=2],['Soft rain',()=>this.s.rain=1],['Warm breath',()=>this.s.mist.fill(1)]],
vinyl:[['33 RPM',()=>this.s.omega=TAU*33/60],['45 RPM',()=>this.s.omega=TAU*45/60],['Lift needle',()=>this.s.needle=!this.s.needle]],
tree:[['Autumn',()=>{this.s.season=0;this.s.gust=3}],['Spring',()=>{this.s.season=1;this.s.falls.clear()}]],moon:[['Full moon',()=>this.s.phase=0],['New moon',()=>this.s.phase=Math.PI]],
fruit:[['Slice',()=>this.s.tool=0],['Squeeze',()=>this.s.tool=1],['Replate',()=>{this.s.cuts=this.s.cuts.map(()=>({a:null,amount:0,dx:0,dy:0}));this.s.juice=[]}]],
crane:[['Fold flat',()=>this.s.foldTargets=[.62,.62]],['Unfold',()=>this.s.foldTargets=[0,0]]],galaxy:[['Gravity +',()=>{this.s.mass=Math.min(10000,this.s.mass*1.5);for(let w of this.s.wells)w.m*=1.3}],['Clear wells',()=>{this.s.wells=[];this.s.wellByPointer.clear()}]],
lamp:[['Dawn',()=>{this.s.warmth=1;this.s.on=true;this.s.brightness=.4}],['Evening',()=>{this.s.warmth=0;this.s.on=true;this.s.brightness=.7}]],
ocean:[['High tide',()=>this.s.sea=-70],['Low tide',()=>this.s.sea=60],['Clear boats',()=>{this.s.boats=[];this.s.boatByPointer.clear()}]]}[this.kind]||[];}
draw(c,t){let s=this.s;c.save();c.globalCompositeOperation='source-over';c.lineCap='round';let path=(ps,color,width=2)=>{if(ps.length<2)return;c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(ps[0].x,ps[0].y);for(let i=1;i<ps.length;i++)c.lineTo(ps[i].x,ps[i].y);c.stroke();};switch(this.kind){
case'koi':c.fillStyle='#ffe5a5';for(let f of s.food){c.beginPath();c.arc(f.x,f.y,3+Math.sin(t*2+f.x)*.5,0,TAU);c.fill()}break;
case'bloom':for(let f of s.flowers){let r=8+f.growth*66,a=t*.2;let col=['#d65488','#a954aa','#ee879d','#efbc61'][f.hue];c.strokeStyle=col;c.lineWidth=1.2;c.beginPath();for(let i=0;i<=200;i++){let q=i/200*TAU,rr=r*(.68+.32*Math.cos(q*7));let x=f.x+Math.cos(q+a)*rr,y=f.y+Math.sin(q+a)*rr;if(!i)c.moveTo(x,y);else c.lineTo(x,y)}c.stroke();c.beginPath();c.moveTo(f.x,f.y);c.quadraticCurveTo(f.x+15,f.y+50,f.x-4,f.y+90*f.growth);c.stroke();}if(this.art.pointers.size&&s.tool)c.fillStyle='#7db6cb';break;
case'aurora':for(let l of s.lightPaths){let points=l.points.map((p,i)=>({x:p.x,y:p.y+Math.sin(t*(s.reverse?-1:1)+i*.13)*12*(s.stretch||1)}));c.globalCompositeOperation='screen';for(let k=0;k<5;k++){c.globalAlpha=.15;path(points,['#6affdb','#86a8ff','#dc92ed','#dcff90'][l.color],2+k*4)}c.globalAlpha=1;}break;
case'tea':c.fillStyle=s.tea?'#be778960':'#78a79770';c.beginPath();c.ellipse(477,476+(1-s.level)*50,136,28,0,0,TAU);c.fill();if(this.art.pointers.size&&!s.tool){for(let p of this.art.pointers.values()){path([p,{x:477+Math.sin(t*9)*5,y:476}],s.tea?'#b96f94':'#69978d',4);}}if(s.stir){c.strokeStyle='#ebddbb';for(let j=0;j<3;j++){c.beginPath();c.ellipse(477,476,30+j*24,8+j*5,s.stir*.05,0,TAU);c.stroke();}}break;
case'cat':c.strokeStyle='#6593bf';c.lineWidth=2;c.beginPath();c.arc(s.yarn.x,s.yarn.y,24,0,TAU);c.stroke();for(let j=0;j<5;j++){c.beginPath();c.ellipse(s.yarn.x,s.yarn.y,22,5+j*3,t*.3+j,0,TAU);c.stroke()}if(s.tool){c.beginPath();c.moveTo(555,740);c.quadraticCurveTo(580,800,s.yarn.x-25,s.yarn.y);c.stroke();}break;
case'jelly':for(let w of s.currents.filter((_,i)=>i%4===0)){c.globalAlpha=.18;path([w,{x:w.x+w.dx*4,y:w.y+w.dy*4}],'#b4dbff',1)}c.globalAlpha=1;if(s.pulse>.05){c.fillStyle='#adc9ff';c.globalAlpha=s.pulse*.15;for(let j=0;j<3;j++){c.beginPath();c.arc(300+j*210+s.jellies[j].x,350+s.jellies[j].y,100,0,TAU);c.fill()}}break;
case'fabric':for(let l of [...s.threads,{points:s.thread,color:s.color}]){path(l.points,['#e15635','#dbae42','#178c94'][l.color],9);c.strokeStyle='#f9efd2';c.lineWidth=2;for(let i=0;i<l.points.length;i+=3){let p=l.points[i];c.beginPath();c.moveTo(p.x-1,p.y-7);c.lineTo(p.x+1,p.y+7);c.stroke()}}break;
case'dunes':for(let ps of s.grooves)for(let j=-4;j<4;j++){path(ps.map(p=>({x:p.x+j*6,y:p.y+j*4})),'#aa786450',1.2)}for(let q of s.rocks){c.fillStyle='#9e8070';c.beginPath();c.ellipse(q.x,q.y,q.r,q.r*.68,.3,0,TAU);c.fill();c.strokeStyle='#f5d8b6';c.beginPath();c.arc(q.x-4,q.y-3,q.r*.55,3,5);c.stroke()}break;
case'butterfly':for(let q of s.perches){c.strokeStyle='#c5c887';c.lineWidth=1.4;c.beginPath();c.moveTo(q.x,q.y+80);c.quadraticCurveTo(q.x-30,q.y+40,q.x,q.y);c.stroke();c.beginPath();c.ellipse(q.x,q.y+25,23,8,-.6,0,TAU);c.stroke()}break;
case'rain':c.fillStyle='#edf0e6';for(let y=5;y<25;y++)for(let x=5;x<27;x++){c.globalAlpha=s.mist[y*32+x]*.55;c.fillRect(x*1000/32,y*1000/32,33,33)}c.globalAlpha=1;break;
case'vinyl':c.strokeStyle=s.needle?'#f6d4f6':'#816a89';c.lineWidth=6;c.beginPath();c.moveTo(799,267);c.lineTo(799,460);c.lineTo(s.needle?690-s.arm*100:860,s.needle?540+s.arm*60:420);c.stroke();break;
case'moon':for(let q of s.craters){c.globalAlpha=.3;c.strokeStyle='#9c959d';c.lineWidth=2;c.beginPath();c.arc(q.x,q.y,q.r,0,TAU);c.stroke()}break;
case'fruit':for(let q of s.juice){c.globalAlpha=Math.max(0,q.life);c.fillStyle='#f49c35';c.beginPath();c.arc(q.x,q.y,2,0,TAU);c.fill()}break;
case'crane':c.globalAlpha=.5;c.fillStyle='#fff0df';for(let side of[0,1]){let x=side?670:325;c.beginPath();c.arc(x,490,5,0,TAU);c.fill();}break;
case'galaxy':for(let w of s.wells){c.fillStyle='#090510';c.beginPath();c.arc(w.x,w.y,14+Math.sqrt(w.m)*.15,0,TAU);c.fill();c.strokeStyle='#e7b3ef88';c.lineWidth=1.5;c.beginPath();c.ellipse(w.x,w.y,22+Math.sqrt(w.m)*.18,13+Math.sqrt(w.m)*.11,t*.15,0,TAU);c.stroke()}break;
case'lamp':c.strokeStyle='#e7c391';c.lineWidth=1.8;c.beginPath();c.moveTo(710,590);c.quadraticCurveTo(710+Math.sin(s.cord)*50,665+s.pull*.4,720+Math.sin(s.cord)*85,740+s.pull);c.stroke();c.fillStyle=s.on?'#f1cf92':'#9b7857';c.beginPath();c.arc(720+Math.sin(s.cord)*85,740+s.pull,10,0,TAU);c.fill();break;
case'ocean':for(let b of s.boats){c.save();c.translate(b.x,b.y);c.rotate(b.a);c.fillStyle='#fff6df';c.beginPath();c.moveTo(-28,0);c.lineTo(29,0);c.lineTo(17,16);c.lineTo(-17,16);c.closePath();c.fill();c.strokeStyle='#397b87';c.lineWidth=1;c.stroke();c.beginPath();c.moveTo(0,-42);c.lineTo(0,-2);c.lineTo(25,-2);c.closePath();c.fill();c.stroke();c.restore()}break;
}c.restore();}
}
function palettesForTree(seed){return ['#648756','#88ac68','#b6c483','#456b4e'][Math.floor(seed*10)%4]}
window.ArtInteraction=Interaction;
})();
