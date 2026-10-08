/* Spring inertia and pointer repulsion adapted from Mouse Twitch by maks:
   https://openprocessing.org/@maksss/3026808 — CC BY-NC-SA 3.0.
   All figurative geometry, compositions, gestures and rendering are new. */
(()=>{'use strict';
const TAU=Math.PI*2,rand=(a=0,b=1)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const palettes={face:['#fdd6a0','#d69264','#b75740','#f9ac78'],ink:['#203d3c','#52716a','#789389','#c07445'],koi:['#e74925','#ffc98b','#fff4d5','#ec8654'],bloom:['#fa8db7','#ef548d','#ffd4dd','#d077ca'],aurora:['#6affdb','#86a8ff','#b7f18a','#dc92ed'],tea:['#7b533b','#d5af81','#e9d7bc','#86a097'],cat:['#325c9a','#739ed0','#123260','#b5d4eb'],jelly:['#aaa7ff','#dc9be5','#83e2f5','#f0ccfa'],fabric:['#f35329','#fbc854','#0c969b','#9fcbb1'],dunes:['#edb98b','#cf7d60','#9a554d','#f9d5a6'],butterfly:['#b1dffc','#f1c76c','#7bb5ed','#f8efb8'],rain:['#738e69','#c2cbb1','#385744','#9bb891'],vinyl:['#d176ec','#86c6ff','#f19dbc','#b0a2fb'],tree:['#c47723','#eead49','#935322','#f0d77f'],moon:['#ece7da','#afa9ad','#d2c6b6','#e9d6bd'],fruit:['#e35931','#fca846','#4b745a','#f8ce63'],crane:['#f2e5d2','#d7bba5','#b38273','#fff3de'],galaxy:['#ffb965','#bd8ed9','#80a9fa','#ffdfbf'],lamp:['#f9c87b','#cf9355','#ffdf9f','#d67644'],ocean:['#b2e5da','#65b6bd','#2b808f','#fcf2cc']};
function geometry(kind,v=0){let pts=[],colors=palettes[kind],N=1;let add=(x,y,c=0,size=rand(1,2.8),g=0)=>pts.push({hx:x,hy:y,c:colors[((c%4)+4)%4],size,g,seed:rand(0,TAU)});
let curve=(fn,n=120,c=0,size=1.5,g=0)=>{for(let i=0;i<n;i++){let t=i/(n-1),p=fn(t);add(p[0],p[1],c,size,g)}};
let ellipse=(x,y,rx,ry,c=0,n=180,g=0)=>curve(t=>[x+Math.cos(t*TAU)*rx,y+Math.sin(t*TAU)*ry],n,c,rand(1,2.2),g);
let line=(x1,y1,x2,y2,c=0,n=80,g=0)=>curve(t=>[x1+(x2-x1)*t,y1+(y2-y1)*t],n,c,1.8,g);
if(kind==='face'){
 // Anatomical contour portrait: swept hair, eyes, nose, lips and neck.
 for(let k=0;k<22;k++)curve(t=>{let a=t*TAU;return[500+Math.cos(a)*(164-k*2.2)+18*Math.sin(a*2),432+Math.sin(a)*(249-k*2.8)]},115,k%3,rand(1,2.5));
 for(let k=0;k<22;k++)curve(t=>[315+t*355,280-110*Math.sin(t*Math.PI)+k*4+13*Math.sin(t*7+k*.24)],75,k%4,2);
 for(let side of [-1,1]){let ex=500+side*77;for(let k=0;k<4;k++)curve(t=>[ex-44+t*88,398-Math.sin(t*Math.PI)*22+k*4],60,0,2.3,101);ellipse(ex,398,11,16,2,60,101);curve(t=>[ex-46+t*95,368-Math.sin(t*Math.PI)*10],65,1,2,102);}
 curve(t=>[501-15*Math.sin(t*Math.PI),405+t*125],100,0,2.4);curve(t=>[470+t*64,526+Math.sin(t*Math.PI)*12],60,1,2);
 for(let k=0;k<6;k++)curve(t=>[444+t*114,584-Math.sin(t*Math.PI)*9+Math.sin(t*TAU)*6+k*3],70,k%3,2,100);
 for(let side of [-1,1]){curve(t=>[500+side*(88+56*t),630+180*t],95,1,2);curve(t=>[500+side*(110+240*t),760+80*t],100,2,2);}
 if(v%2)pts.forEach(p=>p.hx+=50*Math.sin(p.hy/210));
}else if(kind==='ink'){
 for(let j=0;j<5;j++)for(let k=0;k<14;k++)curve(t=>{let x=30+t*940;let y=430+j*69-(170+Math.sin(v+j)*30)*Math.exp(-Math.pow((x-230-j*80)/140,2))-110*Math.exp(-Math.pow((x-720+j*25)/170,2))+Math.sin(t*23+j)*20+k*3;return[x,y]},120,j%3,1.4);
 ellipse(748,226,44,44,3,180,90);for(let j=0;j<13;j++)curve(t=>[50+t*910,763+j*7+Math.sin(t*9+j*.3)*5],80,2,1);
 for(let j=0;j<7;j++){let x=210+j*19;line(x,647,x-9,555,0,30);for(let k=0;k<5;k++)line(x-4,575+k*13,x+22,562+k*13,0,15)}
}else if(kind==='koi'){
 for(let j=0;j<3;j++){let a=j*TAU/3+v*.4,ox=500+Math.cos(a)*245,oy=500+Math.sin(a)*245;let rot=a+Math.PI/2;
 for(let i=0;i<650;i++){let t=rand(-1,1),wide=Math.sqrt(1-t*t)*rand(-1,1)*48,x=t*142,y=wide;add(ox+x*Math.cos(rot)-y*Math.sin(rot),oy+x*Math.sin(rot)+y*Math.cos(rot),t>.35?2:(i%9<5?0:1),rand(1,3),j+1)}
 for(let k=0;k<14;k++)curve(t=>{let x=-130-t*100,y=Math.sin(t*Math.PI/2)*(k-6)*5;return[ox+x*Math.cos(rot)-y*Math.sin(rot),oy+x*Math.sin(rot)+y*Math.cos(rot)]},22,k%3,1.4,j+1);
 ellipse(ox+120*Math.cos(rot),oy+120*Math.sin(rot),4,4,3,25,j+1);
 }
}else if(kind==='bloom'){
 for(let j=0;j<12+(v%3)*2;j++){let a=j*TAU/(12+(v%3)*2);for(let k=0;k<10;k++)curve(t=>{let r=Math.sin(t*Math.PI)*(260-k*7),w=Math.sin(t*TAU)*55;return[500+Math.cos(a)*r-Math.sin(a)*w,465+Math.sin(a)*r+Math.cos(a)*w]},60,(j+k)%4,1.8,j)}
 ellipse(500,465,34,34,2,130);curve(t=>[500+Math.sin(t*4)*35,490+t*350],140,1,2.5);for(let j=0;j<3;j++)curve(t=>[500+Math.sin(t*Math.PI)*120*(j%2?1:-1),660+j*55+Math.sin(t*TAU)*35],70,3,2);
}else if(kind==='aurora'){
 for(let j=0;j<36;j++)curve(t=>[50+t*900,370+Math.sin(t*7+j*.035+v)*145+Math.sin(t*15)*48+j*5],100,j%4,1.7,j);
 for(let i=0;i<300;i++)add(rand(0,1000),rand(60,940),i%4,rand(.5,1.5),100);
}else if(kind==='tea'){
 for(let k=0;k<16;k++){ellipse(477,477+k*12,184-k*3,48-k*.3,k%3,95);}
 for(let k=0;k<6;k++)curve(t=>[650+Math.sin(t*Math.PI)*124+k*3,494+t*139],90,0,1.7);
 ellipse(488,729,253,52,1,190);ellipse(488,720,228,39,2,170);
 for(let k=0;k<14;k++)curve(t=>[414+k*10+Math.sin(t*11+k*.2+v)*26,450-t*254],80,k%3,rand(.6,1.3),20+k);
 ellipse(477,476,139,30,3,130);
}else if(kind==='cat'){
 for(let k=0;k<17;k++)curve(t=>[500+Math.cos(t*TAU)*(176-k*3),472+Math.sin(t*TAU)*(185-k*4)],130,k%3,1.7);
 for(let side of [-1,1]){for(let k=0;k<8;k++){line(500+side*(115+k*3),352,500+side*165,232+k*4,side<0?1:0,55);line(500+side*165,232+k*4,500+side*213,427,1,60)}ellipse(500+side*78,457,36,19,3,110,101);ellipse(500+side*78,457,4,15,0,50,101);for(let j=0;j<4;j++)curve(t=>[500+side*(35+t*208),539+j*14+t*(j-1.5)*25],70,2,1.1);}
 line(487,516,500,534,0,24);line(500,534,513,516,0,24);curve(t=>[455+t*90,560+Math.sin(t*TAU)*10],60,0,2);
 for(let k=0;k<10;k++)ellipse(498,736,118+k*5,100,1,80);
}else if(kind==='jelly'){
 for(let j=0;j<3;j++){let ox=300+j*210,oy=350+Math.sin(j*3+v)*80;for(let k=0;k<16;k++)curve(t=>[ox+Math.cos(t*Math.PI)*(90-k*2),oy-Math.sin(t*Math.PI)*(80-k*2)],60,k%4,1.8,j);
 for(let k=0;k<16;k++)curve(t=>[ox+(k-8)*8+Math.sin(t*13+k*.4)*25*t,oy+t*(220+Math.sin(k)*65)],50,k%4,1,j+10);}
}else if(kind==='fabric'){
 for(let j=0;j<44;j++)curve(t=>[80+t*840,130+j*18+Math.sin(t*10+j*.18+v)*58],75,j%4,2.8,j);
 for(let j=0;j<25;j++)curve(t=>[85+j*34+Math.sin(t*10+j*.18)*36,115+t*790],75,j%4,1.1,j+50);
}else if(kind==='dunes'){
 for(let j=0;j<7;j++)for(let k=0;k<13;k++)curve(t=>[30+t*940,320+j*67-Math.sin(t*Math.PI*1.3+j*.6+v)*90+k*4],95,j%4,1.5,j);
 ellipse(720,192,52,52,3,200,90);
}else if(kind==='butterfly'){
 for(let side of [-1,1])for(let j=0;j<28;j++)curve(t=>{let a=t*TAU,r=180+55*Math.sin(a*2);return[500+side*(80+Math.sin(a)*r)*(1-j*.014),485+Math.cos(a)*r*1.2*(1-j*.014)]},80,j%4,1.7,side);
 for(let k=0;k<5;k++)ellipse(500,490,12-k*1.7,117,3,100);for(let side of [-1,1])curve(t=>[500+side*t*35,395-t*72+Math.sin(t*3)*8],65,0,1.8);
}else if(kind==='rain'){
 // A window made of weather: tall droplets, evergreen leaves and a sill.
 for(let i=0;i<700;i++){let x=rand(180,820),y=rand(170,780);add(x,y,i%3,rand(.6,1.5),1)}
 for(let x of [155,500,845])line(x,135,x,815,2,160);for(let y of [135,815])line(155,y,845,y,2,160);
 for(let i=0;i<26;i++){let x=rand(190,810),y=rand(210,720);curve(t=>[x+Math.sin(t*TAU)*4,y+t*18],15,0,1.8)}
 for(let j=0;j<9;j++)curve(t=>[690+Math.sin(t*Math.PI)*(j-4)*19,875-t*150],55,j%3,1.6,2);ellipse(690,875,53,18,1,75);
}else if(kind==='vinyl'){
 for(let j=0;j<42;j++)ellipse(500,500,72+j*6,72+j*6,j%4,100,1);ellipse(500,500,60,60,2,130,2);ellipse(500,500,7,7,0,40,2);
 
 for(let j=0;j<13;j++)curve(t=>[130+t*730,878+Math.sin(t*40+j*.3)*15-j*2],90,j%4,1.3,3);
}else if(kind==='tree'){
 for(let j=0;j<14;j++)curve(t=>[500+j-7+Math.sin(t*4)*12,880-t*425],100,2,2);
 for(let j=0;j<38;j++){let a=rand(0,TAU),r=rand(50,245),cx=500+Math.cos(a)*r,cy=390+Math.sin(a)*r*.8;line(500,620,cx,cy,2,45);for(let k=0;k<38;k++){let q=rand(0,TAU),rr=rand(0,45);add(cx+Math.cos(q)*rr,cy+Math.sin(q)*rr,j%4,rand(1.8,4.5),1)}}
}else if(kind==='moon'){
 for(let i=0;i<2300;i++){let a=rand(0,TAU),rr=280*Math.sqrt(rand());add(500+Math.cos(a)*rr,455+Math.sin(a)*rr,i%4,rand(.5,2.4),1)}
 for(let j=0;j<12;j++){let x=rand(320,670),y=rand(250,650),r=rand(8,40);ellipse(x,y,r,r,j%3,65,1)}
 for(let j=0;j<14;j++)curve(t=>[160+t*680,824+j*7+Math.sin(t*15+j)*5],60,j%4,.9,2);
}else if(kind==='fruit'){
 for(let j=0;j<4;j++){let x=295+j*135,y=430+(j%2)*140;for(let k=0;k<10;k++)ellipse(x,y,84-k*4,89-k*4,j%3,85,j);for(let k=0;k<9;k++)line(x,y,x+Math.cos(k*TAU/9)*75,y+Math.sin(k*TAU/9)*75,3,20,j);}
 for(let j=0;j<8;j++)ellipse(500,705,326-j*5,100-j*2,2,120,5);for(let j=0;j<8;j++)curve(t=>[490+t*150,344-Math.sin(t*Math.PI)*35+j*3],70,2,1.8,6);
}else if(kind==='crane'){
 let faces=[[[215,500],[483,480],[635,279]],[[483,480],[643,615],[635,279]],[[483,480],[360,652],[225,754]],[[483,480],[610,481],[802,323]],[[610,481],[690,618],[830,586]],[[643,615],[690,618],[609,809]]];
 for(let j=0;j<faces.length;j++){let [a,b,c]=faces[j];for(let i=0;i<290;i++){let u=rand(),vv=rand();if(u+vv>1){u=1-u;vv=1-vv}add(a[0]+u*(b[0]-a[0])+vv*(c[0]-a[0]),a[1]+u*(b[1]-a[1])+vv*(c[1]-a[1]),j%4,rand(.7,1.9),j)}for(let k=0;k<3;k++)line(faces[j][k][0],faces[j][k][1],faces[j][(k+1)%3][0],faces[j][(k+1)%3][1],0,70,j);}
}else if(kind==='galaxy'){
 for(let i=0;i<3000;i++){let a=rand(0,TAU),r=rand(20,420),arm=i%3;let ang=a*.1+r*.009+arm*TAU/3;add(500+Math.cos(ang)*r+rand(-35,35),500+Math.sin(ang)*r*.62+rand(-24,24),i%4,rand(.5,2.6),arm)}
}else if(kind==='lamp'){
 for(let j=0;j<20;j++){let xx=rand(310,690),yy=rand(300,610);curve(t=>[xx+(t-.5)*130,yy+Math.sin(t*TAU+j)*12],45,j%4,1.3,1)}
 for(let k=0;k<30;k++){let y=300+k*10,x1=345-k*2,x2=655+k*2;line(x1,y,x2,y,k%4,70,1)}
 ellipse(500,300,156,26,1,150,1);ellipse(500,600,222,40,0,180,1);for(let k=0;k<5;k++)line(500+k,625,500+k,832,2,90);ellipse(500,847,131,27,1,150);
}else if(kind==='ocean'){
 for(let j=0;j<46;j++)curve(t=>[20+t*960,248+j*12+Math.sin(t*14+j*.13+v)*42+Math.sin(t*31)*12],90,j%4,1.5,j);
 for(let i=0;i<150;i++)add(rand(50,950),rand(720,845),i%4,rand(.8,2),90);
}
return pts;}
const settings={face:{bg:'#24151b',wash:'#472329',blend:'screen'},ink:{bg:'#eee9dc',wash:'#d9dfce'},koi:{bg:'#153e42',wash:'#0c5356',blend:'screen'},bloom:{bg:'#f6e8ed',wash:'#f5cfde'},aurora:{bg:'#101d35',wash:'#152b3d',blend:'screen'},tea:{bg:'#e6ddcc',wash:'#d1c8b3'},cat:{bg:'#dae9f3',wash:'#c0dce9'},jelly:{bg:'#241b50',wash:'#182c5d',blend:'screen'},fabric:{bg:'#f7e9c8',wash:'#f4ddb3'},dunes:{bg:'#f5d8b6',wash:'#dfb294'},butterfly:{bg:'#142d51',wash:'#123b62',blend:'screen'},rain:{bg:'#e1e5d7',wash:'#c2ceb9'},vinyl:{bg:'#251a31',wash:'#3a213e',blend:'screen'},tree:{bg:'#faf0d4',wash:'#ebdbb0'},moon:{bg:'#202630',wash:'#303543',blend:'screen'},fruit:{bg:'#fff2d8',wash:'#f7ddb5'},crane:{bg:'#ad5650',wash:'#8d3d47',blend:'screen'},galaxy:{bg:'#180d29',wash:'#2d1436',blend:'screen'},lamp:{bg:'#302425',wash:'#5d3825',blend:'screen'},ocean:{bg:'#d7eeee',wash:'#89c5cf'}};
class Artwork{
constructor(canvas,kind,{preview=false,onGesture=()=>{}}={}){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.kind=kind;this.preview=preview;this.onGesture=onGesture;this.t=0;this.last=0;this.variant=0;this.scatter=false;this.paused=false;this.pointers=new Map();this.rings=[];this.trails=[];this.frame=0;this.visible=true;this.wind=0;this.palette=0;this.seed();this.interaction=new ArtInteraction(this);if(preview)this.interaction.s.water=1;this.resize();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.observer=new IntersectionObserver(es=>this.visible=es[0].isIntersecting);this.observer.observe(canvas);this.bind();this.loop=this.loop.bind(this);this.raf=requestAnimationFrame(this.loop);}
seed(){let old=this.points;this.points=geometry(this.kind,this.variant);if(this.preview)this.points=this.points.filter((_,i)=>i%2===0);this.points.forEach((p,i)=>{p.x=old?.[i]?.x??p.hx;p.y=old?.[i]?.y??p.hy;p.vx=0;p.vy=0;});}
resize(){let b=this.canvas.getBoundingClientRect();this.w=b.width;this.h=b.height;let d=Math.min(devicePixelRatio||1,this.preview?1:2);this.canvas.width=Math.max(1,Math.round(this.w*d));this.canvas.height=Math.max(1,Math.round(this.h*d));this.dpr=d;this.s=(this.preview?Math.min(this.w,this.h):Math.min(this.w*(this.h/this.w>1.5?1.28:1),this.h*.92))/1000;}
map(e){let b=this.canvas.getBoundingClientRect();return{x:((e.clientX-b.left)-this.w/2)/this.s+500,y:((e.clientY-b.top)-this.h/2)/this.s+500};}
bind(){if(this.preview)return;let c=this.canvas;c.addEventListener('pointerdown',e=>{e.preventDefault();c.setPointerCapture(e.pointerId);let p=this.map(e);this.pointers.set(e.pointerId,p);this.interaction.down(p,e.pointerId);});c.addEventListener('pointermove',e=>{if(!this.pointers.has(e.pointerId))return;let p=this.map(e),old=this.pointers.get(e.pointerId);this.pointers.set(e.pointerId,p);this.interaction.move(p,old,e.pointerId);});let up=e=>{let p=this.map(e);if(this.pointers.has(e.pointerId))this.interaction.up(p,e.pointerId);this.pointers.delete(e.pointerId);};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);}

change(){this.variant++;this.palette=(this.palette+1)%4;this.wind=(this.wind+1)%3;this.seed();this.rings.push({x:500,y:500,life:1});}
release(){this.scatter=!this.scatter;}
reset(){this.scatter=false;this.variant=0;this.palette=0;this.wind=0;this.trails=[];this.rings=[];this.pointers.clear();this.points=null;this.seed();this.interaction?.reset();}
ambient(p,t){let k=this.kind,x=p.hx,y=p.hy,g=p.g;
if(k==='koi'){let a=t*.12,dx=x-500,dy=y-500;return[500+dx*Math.cos(a)-dy*Math.sin(a),500+dx*Math.sin(a)+dy*Math.cos(a)];}
if(k==='vinyl'&&g===1){let a=t*(.10+this.wind*.06),dx=x-500,dy=y-500;return[500+dx*Math.cos(a)-dy*Math.sin(a),500+dx*Math.sin(a)+dy*Math.cos(a)];}
if(k==='galaxy'){let a=t*.035,dx=x-500,dy=(y-500)/.62;return[500+dx*Math.cos(a)-dy*Math.sin(a),500+(dx*Math.sin(a)+dy*Math.cos(a))*.62];}
if(k==='jelly')return[x+Math.sin(t*.9+y*.008)*12,y+Math.sin(t*.7+g)*26];
if(k==='bloom'||k==='butterfly'){let b=1+Math.sin(t*.65)*.035+(this.pointers.size?.14:0);return[500+(x-500)*b,465+(y-465)*b];}
if(k==='aurora'||k==='ocean'||k==='fabric')return[x+Math.sin(t*.7+y*.004)*10,y+Math.sin(t*.8+x*.007+g*.07)*14];
if(k==='tea'&&g>=20)return[x+Math.sin(t+y*.017)*13,y-Math.sin(t*.6)*17];
if(k==='rain'&&g===1)return[x,170+((y-170+t*22)%610)];
if(k==='tree'&&g===1)return[x+Math.sin(t*.8+y*.012)*9,y+Math.cos(t*.8+x*.013)*4];
return[x+Math.sin(t*.6+p.seed)*2,y+Math.cos(t*.45+p.seed)*2];}
backdrop(c,t){let S=settings[this.kind];c.fillStyle=S.bg;c.fillRect(-5000,-5000,10000,10000);let grad=c.createRadialGradient(500,440,20,500,500,600);grad.addColorStop(0,S.wash);grad.addColorStop(1,S.bg);c.fillStyle=grad;c.fillRect(0,0,1000,1000);

if(this.kind==='koi'){c.strokeStyle='#81c6bc18';for(let j=0;j<7;j++){c.beginPath();c.ellipse(500,500,145+j*48+Math.sin(t)*4,145+j*48,0,0,TAU);c.stroke();}}
if(this.kind==='moon'){let g=c.createRadialGradient(500,455,150,500,455,325);g.addColorStop(0,'#ded2b807');g.addColorStop(.87,'#e3d3b812');g.addColorStop(1,'#e3d3b800');c.fillStyle=g;c.beginPath();c.arc(500,455,330,0,TAU);c.fill();}
if(this.kind==='lamp'){let g=c.createRadialGradient(500,600,5,500,600,470);let light=this.interaction.s.on?this.interaction.s.brightness:0;g.addColorStop(0,'rgba(255,186,70,'+(light*.42)+')');g.addColorStop(1,'#ffba4600');c.fillStyle=g;c.fillRect(0,0,1000,1000);}
// Gentle material grain, fixed so it never flashes.
c.fillStyle=this.kind==='ink'?'#5449390b':'#ffffff07';for(let j=0;j<170;j++)c.fillRect((j*173)%1000,(j*319)%1000,1,1);
}
loop(now){this.raf=requestAnimationFrame(this.loop);if(!this.visible||document.hidden||this.paused){this.last=now;return;}let dt=this.last?Math.min((now-this.last)/1000,.045):.016;this.last=now;this.t+=dt;this.interaction.update(dt);this.frame++;if(this.preview&&this.frame%3!==1)return;let c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.w,this.h);c.translate(this.w/2,this.h/2);c.scale(this.s,this.s);c.translate(-500,-500);this.backdrop(c,this.t);let ratio=dt*60,S=settings[this.kind];c.globalCompositeOperation=S.blend||'source-over';
let previous=null,inkLines=['ink','tea','dunes','jelly','fabric','vinyl','bloom','ocean','aurora'].includes(this.kind);for(let p of this.points){let [ax,ay]=this.ambient(p,this.t);let pose=this.interaction.target(p,ax,ay,this.t),hx=pose.x,hy=pose.y;
 // Interpolation is shared. Every scene supplies its own persistent simulation targets.
 if(!this.interaction.physics(p,ratio)){p.vx+=(hx-p.x)*.018*ratio;p.vy+=(hy-p.y)*.018*ratio;p.vx*=Math.pow(.80,ratio);p.vy*=Math.pow(.80,ratio);p.x+=p.vx*ratio;p.y+=p.vy*ratio;}
 c.globalAlpha=pose.alpha??1;

 c.fillStyle=pose.color||p.c;
 let size=p.size;if(inkLines&&previous&&previous.g===p.g&&Math.hypot(previous.hx-p.hx,previous.hy-p.hy)<36){c.strokeStyle=c.fillStyle;c.globalAlpha=.42*(pose.alpha??1);c.lineWidth=this.kind==='ink'?1.5:1;c.beginPath();c.moveTo(previous.x,previous.y);c.lineTo(p.x,p.y);c.stroke();c.globalAlpha=pose.alpha??1;}previous=p;if(this.kind==='ink'||this.kind==='dunes'||this.kind==='tea')size*=.65;if(this.kind==='aurora'||this.kind==='galaxy')size*=.7+Math.sin(this.t+p.seed)*.3;
 if(this.kind==='fabric'||this.kind==='rain'){c.strokeStyle=c.fillStyle;c.lineWidth=size;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x+3,p.y+(this.kind==='rain'?8:2));c.stroke();}else{c.beginPath();c.arc(p.x,p.y,size,0,TAU);c.fill();}
}
c.globalAlpha=1;c.globalCompositeOperation='source-over';this.interaction.draw(c,this.t);
for(let r of this.rings){r.life-=dt*.55;c.globalAlpha=Math.max(r.life,0)*.45;c.strokeStyle=palettes[this.kind][this.palette];c.lineWidth=1.2;c.beginPath();c.arc(r.x,r.y,(1-r.life)*170+5,0,TAU);c.stroke();}this.rings=this.rings.filter(r=>r.life>0);c.globalAlpha=1;
}
destroy(){cancelAnimationFrame(this.raf);this.resizeObserver.disconnect();this.observer.disconnect();}
}
window.Artwork=Artwork;window.ArtSettings=settings;
})();
