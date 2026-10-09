"""Second collection: six independent OpenProcessing reskins, offline upload files."""
from pathlib import Path
import json, shutil, zipfile

R=Path(__file__).parent
G=R/'upload-art-2'
S=R/'research/more-art'
for name in ['', 'standalone', 'packages', 'previews']:
    (G/name).mkdir(parents=True,exist_ok=True)
entries=[
 dict(slug='07-sakura-breeze',name='Sakura Breeze',theme='paper',folder='760669-tree',author='Jason Labbe',id=760669,hint='Brush the branches. Hold to send a breeze. Watch the petals settle.',tools=[('sakura','Sakura','palette'),('maple','Maple','palette'),('moon','Moon','palette'),('gust','Petal shower','action')]),
 dict(slug='08-moon-anemones',name='Moon Anemones',theme='dark',folder='458293-creatures',author='Jason Labbe',id=458293,hint='Touch the soft tentacles. Gather a creature and slowly lead it through the water.',tools=[('drift','Drift','mode'),('gather','Gather','mode'),('reef','Reef','palette'),('dusk','Dusk','palette'),('bloom','New bloom','action')]),
 dict(slug='09-soft-sculpture',name='Soft Sculpture',theme='paper',folder='2256732-organificial',author='Vamoss',id=2256732,hint='Pull a pearl to reshape the sculpture. Touch an empty space to add a new fold.',tools=[('citrus','Citrus','palette'),('candy','Candy','palette'),('lagoon','Lagoon','palette'),('breathe','Breathe','motion')]),
 dict(slug='10-pearl-tides',name='Pearl Tides',theme='dark',folder='656607-ripples',author='Jason Labbe',id=656607,hint='Drag to turn the pearl cube. Hold to send a wave through its surface.',tools=[('ivory','Ivory','palette'),('jade','Jade','palette'),('violet','Violet','palette'),('wave','Send a wave','action')]),
 dict(slug='11-crystal-grove',name='Crystal Grove',theme='dark',folder='916227-frozen',author='Jason Labbe',id=916227,hint='Draw slowly for glass branches. Hold to grow a crystal. Your drawing stays.',tools=[('ice','Ice','palette'),('rose','Rose quartz','palette'),('amber','Amber','palette'),('grow','Grow','mode'),('erase','Erase','mode')]),
 dict(slug='12-honey-type',name='Honey Type',theme='paper',folder='481266-splash',author='Jason Labbe',id=481266,hint='Press into the letters. Flick to splash. The liquid slowly finds its shape again.',tools=[('honey','Honey','palette'),('berry','Berry','palette'),('mint','Mint','palette'),('word','New word','action'),('pour','Pour','action')])
]
for e in entries:
    e['source']='https://openprocessing.org/'+('@u65884/' if e['author']=='Vamoss' else '@theRussetPotato/')+str(e['id'])
css=(R/'upload-art/studio.css').read_text()+'''\nbody.paper{background:#f9f3ea;color:#493d3e}body.paper button[aria-pressed=true]{background:#6a5753;border-color:#6a5753;color:#fff9ee}.paper .hint{background:#fff8eddf}.paper h1{text-shadow:0 1px 15px #fffaf1}.hint{max-width:510px}'''
common=(R/'upload-art/input.js').read_text()
(G/'studio.css').write_text(css)
(G/'input.js').write_text(common)

tree=r'''
// Dynamic tree by Jason Labbe: recursive branches, angular spring and air drag.
// Reskin: petal geometry, seasonal pigment, paper grain, touch wind. CC BY-SA 3.0.
let maxLevel=7,branchForce=.5,rootBranch,treeScale=1,petals=[],season='sakura',wind=0,tick=0;
const TREE_SKINS={sakura:{paper:'#f9f1e9',ink:'#65534e',petal:['#d58495','#f1b2bb','#ffd1c8'],sun:'#efc1ae'},maple:{paper:'#ece7d6',ink:'#52492d',petal:['#cf602e','#df972e','#a44828'],sun:'#d6be83'},moon:{paper:'#171e30',ink:'#c0b4a7',petal:['#9c9ecb','#d9c2d7','#718eab'],sun:'#d4d3d9'}};
function Leaf(){this.size=random(8,18);this.offsetX=random(-18,18);this.offsetY=random(-18,18);this.rotation=random(TWO_PI);this.col=floor(random(3))}
function Berry(){Leaf.call(this);this.size*=.6}
'''+(S/'760669-tree/Branch.js').read_text()+r'''
function subDivide(b){let n=floor(random(1,4));for(let i=0;i<n;i++){const a=n===1?random(-25,25):map(i,0,n-1,-35,35)+random(-8,8);const c=b.newBranch(a,random(.69,.84));if(c.level<maxLevel)subDivide(c)}}
function newTree(){rootBranch=new Branch(random(95,125),-90,0);subDivide(rootBranch);let xs=[],ys=[];function bounds(b,x,y,a){a+=b.restAngle;x+=cos(radians(a))*b.length;y+=sin(radians(a))*b.length;xs.push(x);ys.push(y);for(const c of b.children)bounds(c,x,y,a)}bounds(rootBranch,0,0,0);treeScale=min((width*.88)/(max(xs)-min(xs)+70),height*.58/(-min(ys)+25));petals=[];wind=0}
function setup(){artCanvas();newTree();Studio.onDown=p=>{wind+=.8;dropPetals(p.x,p.y,8)};Studio.onMove=p=>{wind=constrain(wind+p.dx*.014,-4,4);dropPetals(p.x,p.y,2)};Studio.onTool=n=>{if(TREE_SKINS[n]){season=n;Studio.select('palette',n);document.body.classList.toggle('paper',n!=='moon')}else{wind=3.8;dropPetals(width*.5,height*.35,65)}};Studio.onReset=newTree}
function dropPetals(x,y,n){for(let i=0;i<n;i++)petals.push({x:x+random(-90,90),y:y+random(-40,40),vx:random(-1,1)+wind,vy:random(.3,1.4),a:random(TWO_PI),s:random(3,8),c:floor(random(3)),life:600});if(petals.length>220)petals.splice(0,petals.length-220)}
function blossom(x,y,l,skin){push();translate(x,y);rotate(l.rotation);noStroke();fill(skin.petal[l.col]);for(let k=0;k<5;k++){rotate(TWO_PI/5);ellipse(l.size*.29,0,l.size*.67,l.size*.48)}fill(season==='moon'?'#eee2dd':'#aa7650');circle(0,0,l.size*.18);pop()}
function showBranch(b,wx,wy,wa){wa+=b.angle;const nx=wx+cos(radians(wa))*b.length,ny=wy+sin(radians(wa))*b.length;let force=wind*.12*map(b.level,0,maxLevel,.05,1);for(const p of Studio.hands.values()){const d=dist(p.x,p.y,width*.5+nx*treeScale,height*.78+ny*treeScale);if(d<160)force+=(p.x<width*.5+nx*treeScale?1:-1)*(1-d/160)*1.5*(b.level+1)/8}b.applyForce(force);b.move();push();rotate(radians(b.angle));stroke(TREE_SKINS[season].ink);strokeWeight((maxLevel-b.level+1)*1.04);line(0,0,b.length,0);for(const l of b.leaves)blossom(b.length+l.offsetX,l.offsetY,l,TREE_SKINS[season]);translate(b.length,0);for(const c of b.children)showBranch(c,nx,ny,wa);pop()}
function draw(){if(Studio.paused||Studio.suspended)return;tick++;wind*=.984;const s=TREE_SKINS[season];background(s.paper);noStroke();fill(s.sun);circle(width*.72,height*.26,min(width,height)*.24);fill(season==='moon'?'#252b3c':'#e8dfd4');ellipse(width*.5,height*.785,width*.6,14);push();translate(width*.5,height*.78);scale(treeScale);showBranch(rootBranch,0,0,0);pop();if(tick%45===0)dropPetals(width*.5,height*.32,1);for(let i=petals.length-1;i>=0;i--){const p=petals[i];p.x+=p.vx+sin(tick*.015+p.a)*.5;p.y+=p.vy;p.vx*=.99;p.a+=.018;p.life--;push();translate(p.x,p.y);rotate(p.a);fill(s.petal[p.c]);noStroke();ellipse(0,0,p.s,p.s*.48);pop();if(p.y>height*.79)p.vy=0;if(p.life<0)petals.splice(i,1)}stroke(season==='moon'?'#ffffff06':'#483b2907');strokeWeight(1);for(let i=0;i<90;i++)point((i*157.1)%width,(i*241.7)%height)}
'''

creatures=r'''
// Sea creatures by Jason Labbe: each radial rope is a chain of spring pendulums.
// Original spring/gravity simulation retained; underwater pigment and touch input added.
let airDragSlider={value:()=>.12},gravitySlider={value:()=>.44},elasticitySlider={value:()=>.12},frizzSlider={value:()=>.62};
let creatures=[],marineTime=0,marineSkin='reef',marineMode='drift';
'''+(S/'458293-creatures/spring.js').read_text()+(S/'458293-creatures/pendulum.js').read_text()+r'''
function seaRope(x,y,a,sc){this.objs=[new Spring(x,y,1)];this.a=a;for(let i=0;i<7;i++){const p=new Pendulum(a,x+cos(radians(a))*i*12*sc,y+sin(radians(a))*i*12*sc,this.objs[this.objs.length-1]);p.restLength=max(4,12*sc)*random(.7,1.25);this.objs.push(p)}}
function creature(x,y,sc){return {x,y,homeX:x,homeY:y,phase:random(1000),sc,ropes:Array.from({length:72},(_,i)=>new seaRope(x,y,i*5,sc))}}
function resetSea(){creatures=[creature(width*.44,height*.4,min(1.3,width/350)),creature(width*.65,height*.65,min(.85,width/490))];for(let k=0;k<85;k++)stepSea(false)}
function setup(){artCanvas();resetSea();Studio.onTool=n=>{if(n==='drift'||n==='gather'){marineMode=n;Studio.select('mode',n)}else if(n==='bloom'){if(creatures.length>=4)creatures.shift();creatures.push(creature(random(width*.25,width*.75),random(height*.3,height*.7),min(.9,width/430)))}else{marineSkin=n;Studio.select('palette',n)}};Studio.onReset=resetSea}
function stepSea(render){marineTime++;if(render){background(marineSkin==='reef'?'#061a23':'#21162f');const ctx=drawingContext;const g=ctx.createRadialGradient(width*.45,height*.4,0,width*.5,height*.5,height*.7);g.addColorStop(0,marineSkin==='reef'?'#173c46':'#3f264b');g.addColorStop(1,marineSkin==='reef'?'#020d19':'#100c20');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);noStroke();fill(150,209,200,28);for(let i=0;i<70;i++)circle((i*173.7+sin(marineTime*.007+i)*15)%width,(i*157.3-marineTime*.2+height*30)%height,1+i%3)}
 for(let ci=0;ci<creatures.length;ci++){const c=creatures[ci];let tx=c.homeX+sin(marineTime*.028+c.phase)*width*.11,ty=c.homeY+cos(marineTime*.023+c.phase)*height*.08;
 for(const p of Studio.hands.values())if(marineMode==='gather'&&dist(p.x,p.y,c.x,c.y)<220){tx=p.x;ty=p.y}
 c.x=lerp(c.x,tx,.085);c.y=lerp(c.y,ty,.085);
 for(let ri=0;ri<c.ropes.length;ri++){const rope=c.ropes[ri],root=rope.objs[0];root.target.set(c.x+cos(radians(rope.a))*8*c.sc,c.y+sin(radians(rope.a))*8*c.sc);for(const o of rope.objs){for(const p of Studio.hands.values()){let dx=o.pos.x-p.x,dy=o.pos.y-p.y,d=hypot(dx,dy);if(d>0&&d<90&&marineMode==='drift')o.acc.add(dx/d*(1-d/90)*1.9,dy/d*(1-d/90)*1.9)}o.move()}
 if(render){const hue=marineSkin==='reef'?(ci%2===0?[116,216,210]:[251,173,151]):(ci%2===0?[197,150,246]:[254,176,195]);noFill();stroke(...hue,ri%3===0?205:115);strokeWeight(ri%3===0?1.6:.7);beginShape();curveVertex(root.pos.x,root.pos.y);for(const o of rope.objs)curveVertex(o.pos.x,o.pos.y);const e=rope.objs[rope.objs.length-1];curveVertex(e.pos.x,e.pos.y);endShape();if(ri%4===0){noStroke();fill(...hue,190);circle(e.pos.x,e.pos.y,2.4)}}}
 if(render){const ctx=drawingContext;const g=ctx.createRadialGradient(c.x-8,c.y-10,2,c.x,c.y,28*c.sc);g.addColorStop(0,marineSkin==='reef'?'#eaffdf':'#ffdeef');g.addColorStop(.25,marineSkin==='reef'?'#c4efd099':'#f8b9ea88');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(c.x,c.y,28*c.sc,0,TWO_PI);ctx.fill()}}
}
function draw(){if(Studio.paused||Studio.suspended)return;stepSea(true)}
function hypot(x,y){return Math.hypot(x,y)}
'''

# Keep original polygon inset routines without its setup, UI or mouse handlers.
sculpture=(S/'2256732-organificial/hobby-curve.js').read_text()+'\nfunction createPolygon'+(S/'2256732-organificial/mySketch.js').read_text().split('function createPolygon',1)[1]
sculpture+=r'''
// Organificial by Vamoss: Hobby curves, inset polygons and conic gradients retained.
let nodes=[],sculptTime=0,sculptPalette='citrus',breathing=true,held=new Map();
const SCULPT={citrus:['#f4df69','#f0a247','#ec684d','#8fbd90','#e8db9a'],candy:['#fbd4dc','#e981b8','#f5a577','#989cd4','#d84e86'],lagoon:['#bcece4','#67c3be','#497b96','#ccc38e','#f8e8b4']};
function resetSculpt(){nodes=[];for(let i=0;i<9;i++){let a=i*TWO_PI/9,r=min(width*.34,height*.29)*random(.72,1.12);let x=width*.5+cos(a)*r,y=height*.45+sin(a)*r;nodes.push({x,y,bx:x,by:y,phase:random(TWO_PI)})}held.clear()}
function setup(){artCanvas();resetSculpt();Studio.onDown=p=>{let best=60,idx=-1;nodes.forEach((n,i)=>{let d=dist(p.x,p.y,n.x,n.y);if(d<best){best=d;idx=i}});if(idx<0&&nodes.length<18){let best=Infinity;for(let i=0;i<nodes.length;i++){let n=nodes[i],q=nodes[(i+1)%nodes.length],d=dist(p.x,p.y,(n.x+q.x)/2,(n.y+q.y)/2);if(d<best){best=d;idx=i+1}}nodes.splice(idx,0,{x:p.x,y:p.y,bx:p.x,by:p.y,phase:random(TWO_PI)})}if(idx>=0)held.set(p.id,nodes[idx])};Studio.onMove=p=>{let n=held.get(p.id);if(n){n.x=n.bx=constrain(p.x,20,width-20);n.y=n.by=constrain(p.y,90,height-150)}};Studio.onUp=p=>held.delete(p.id);Studio.onTool=n=>{if(n==='breathe'){breathing=!breathing;document.querySelector('[data-tool=breathe]').setAttribute('aria-pressed',breathing)}else{sculptPalette=n;Studio.select('palette',n)}};Studio.onReset=resetSculpt}
function drawHobby(v){if(v.length<3)return;const box=createPolygon(nodes),left=box.minX-12,right=box.maxX+12,top=box.minY-12,bottom=box.maxY+12;const safe=q=>({x:constrain(Number.isFinite(q.x)?q.x:width*.5,left,right),y:constrain(Number.isFinite(q.y)?q.y:height*.45,top,bottom)});const curves=createHobbyBezier(v,{tension:1,cyclic:true});beginShape();let first=safe(v[0]);vertex(first.x,first.y);for(const c of curves){const a=safe(c.startControl),b=safe(c.endControl),p=safe(c.point);bezierVertex(a.x,a.y,b.x,b.y,p.x,p.y)}endShape(CLOSE)}
function draw(){if(Studio.paused||Studio.suspended)return;sculptTime++;background('#f6f1e6');const cs=SCULPT[sculptPalette];for(const n of nodes)if(![...held.values()].includes(n)){n.x=lerp(n.x,n.bx+(breathing?sin(sculptTime*.018+n.phase)*7:0),.14);n.y=lerp(n.y,n.by+(breathing?cos(sculptTime*.02+n.phase)*8:0),.14)}
 const ctx=drawingContext;let poly=createPolygon(nodes),cx=(poly.minX+poly.maxX)/2,cy=(poly.minY+poly.maxY)/2;
 noStroke();ctx.shadowColor='#73544d25';ctx.shadowBlur=28;ctx.shadowOffsetY=13;
 for(let layer=0;layer<5;layer++){let gradient=ctx.createConicGradient(sculptTime*.001+layer*.6,cx,cy);for(let j=0;j<=cs.length;j++)gradient.addColorStop(j/cs.length,cs[(j+layer)%cs.length]);ctx.fillStyle=gradient;drawHobby(poly.vertices);ctx.shadowBlur=0;ctx.shadowOffsetY=0;let pad=min(width,height)*.028;let v=getPaddingVertices(poly,pad);if(v.length<3)break;poly=createPolygon(v)}
 stroke('#ffffff65');strokeWeight(.9);noFill();drawHobby(nodes);for(const n of nodes){ctx.shadowColor='#4b373b44';ctx.shadowBlur=5;ctx.shadowOffsetY=2;noStroke();fill('#fffdf3');circle(n.x,n.y,width<500?13:17);ctx.shadowBlur=0;ctx.shadowOffsetY=0;fill('#d6c8b9');circle(n.x+1,n.y+1,3)}
}
'''

pearls=r'''
// Mutable ripples by Jason Labbe, Processing.js -> offline p5/Canvas projection.
// Original cube-shell sampling and distance-offset sine wave retained.
let pearlTime=0,rotX=-.3,rotY=.58,targetX=-.3,targetY=.58,pearlPalette='ivory',pulse=0,pulsePos={x:75,y:75,z:75},cube=[];
const PEARLS={ivory:{bg:'#222f36',hi:'#fffbe6',lo:'#8298a1'},jade:{bg:'#143b35',hi:'#edffe2',lo:'#41a998'},violet:{bg:'#29243e',hi:'#ffe9e7',lo:'#a191d1'}};
function setup(){artCanvas();for(let x=0;x<=144;x+=12)for(let y=0;y<=144;y+=12)for(let z=0;z<=144;z+=12)if(x===0||x===144||y===0||y===144||z===0||z===144)cube.push({x,y,z});Studio.onDown=p=>{pulse=1;pulsePos={x:p.x/width*144,y:p.y/height*144,z:72}};Studio.onMove=p=>{targetY+=p.dx*.009;targetX+=p.dy*.009;pulse=min(1,pulse+.06)};Studio.onTool=n=>{if(n==='wave'){pulse=1;pulsePos={x:random(144),y:random(144),z:random(144)}}else{pearlPalette=n;Studio.select('palette',n)}};Studio.onReset=()=>{rotX=targetX=-.3;rotY=targetY=.58;pulse=0;pearlTime=0}}
function projectPearl(x,y,z){let yy=y*cos(rotX)-z*sin(rotX),zz=y*sin(rotX)+z*cos(rotX),xx=x*cos(rotY)+zz*sin(rotY);zz=-x*sin(rotY)+zz*cos(rotY);const sc=min(width*.70,height*.5)/235*(400/(400-zz));return{x:width*.5+xx*sc,y:height*.46+yy*sc,z:zz,sc}}
function draw(){if(Studio.paused||Studio.suspended)return;pearlTime++;rotX=lerp(rotX,targetX,.08);rotY=lerp(rotY,targetY,.08);if(!Studio.hands.size){targetY+=.0018;pulse*=.985}else pulse=min(1,pulse+.015);const skin=PEARLS[pearlPalette];background(skin.bg);const ctx=drawingContext;let back=ctx.createRadialGradient(width*.5,height*.4,0,width*.5,height*.45,height*.65);back.addColorStop(0,skin.lo+'50');back.addColorStop(1,skin.bg);ctx.fillStyle=back;ctx.fillRect(0,0,width,height);noStroke();fill(0,35);ellipse(width*.5,height*.73,min(width*.6,350),18);
 let nx=noise(pearlTime*.007)*144,ny=noise(1000+pearlTime*.007)*144,nz=noise(5000+pearlTime*.007)*144;const data=cube.map(p=>{const d=Math.hypot(p.x-nx,p.y-ny,p.z-nz);let wave=sin((pearlTime+d)*.07);if(pulse>.01)wave+=sin(dist(p.x,p.y,pulsePos.x,pulsePos.y)*.095-pearlTime*.14)*pulse*.7;const q=projectPearl(p.x-72,p.y-72,p.z-72);return {...q,r:(3.5+3.5*(wave+1)/2)*q.sc,wave}}).sort((a,b)=>a.z-b.z);
 for(const p of data){const r=max(.7,p.r),g=ctx.createRadialGradient(p.x-r*.28,p.y-r*.32,.1,p.x,p.y,r);g.addColorStop(0,skin.hi);g.addColorStop(.36,skin.hi);g.addColorStop(.85,skin.lo);g.addColorStop(1,skin.bg);ctx.globalAlpha=.7+(p.z+130)/520;ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,TWO_PI);ctx.fill()}ctx.globalAlpha=1;
}
'''

crystal=(S/'916227-frozen/delaunay.js').read_text()+r'''
// Frozen Brush 2 by Jason Labbe: splitting particles plus Delaunay triangles retained.
// Reskin: translucent facets, long-lived drawings, touch-seeded growth, palette tools.
let crystals=[],frozenTime=0,crystalPalette='ice',crystalMode='grow',paperLayer;
const CRYSTAL={ice:['#c0eef0','#65a6c4','#e2f8ef'],rose:['#ecc1da','#ae79b2','#fbdbc9'],amber:['#eec989','#ba854f','#ffe5a6']};
function crystalParticle(x,y,split){let a=random(TWO_PI),sp=random(1.3,3.5);return{x,y,vx:cos(a)*sp,vy:sin(a)*sp,life:0,split,hue:random()}}
function seedCrystal(x,y,n){if(crystalMode==='erase'){paperLayer.erase();paperLayer.noStroke();paperLayer.circle(x,y,95);paperLayer.noErase();crystals=crystals.filter(p=>dist(x,y,p.x,p.y)>65);return}for(let i=0;i<n;i++)crystals.push(crystalParticle(x+random(-4,4),y+random(-4,4),2));if(crystals.length>260)crystals.splice(0,crystals.length-260)}
function resetCrystal(){crystals=[];paperLayer=createGraphics(width,height);paperLayer.pixelDensity(1);paperLayer.clear();let cx=width*.5,cy=height*.43;for(let i=0;i<35;i++){let a=i*.22;seedCrystal(cx+cos(a)*i*2.3,cy+sin(a)*i*2.3,1)}for(let i=0;i<45;i++)stepCrystal()}
function setup(){artCanvas();resetCrystal();Studio.onDown=p=>seedCrystal(p.x,p.y,8);Studio.onMove=(p,q)=>{let d=dist(p.x,p.y,q.x,q.y);for(let k=0;k<=d;k+=8)seedCrystal(lerp(q.x,p.x,k/max(1,d)),lerp(q.y,p.y,k/max(1,d)),2)};Studio.onTool=n=>{if(n==='grow'||n==='erase'){crystalMode=n;Studio.select('mode',n)}else{crystalPalette=n;Studio.select('palette',n)}};Studio.onReset=()=>{paperLayer.remove();resetCrystal()}}
function stepCrystal(){frozenTime++;for(let i=crystals.length-1;i>=0;i--){const p=crystals[i];p.life++;p.vx*=.94;p.vy*=.94;p.x+=p.vx;p.y+=p.vy;if(p.life%12===0&&p.split>0&&crystals.length<260){p.split--;crystals.push(crystalParticle(p.x,p.y,p.split-1))}if(p.life>90)crystals.splice(i,1)}if(crystals.length<3)return;
 const tri=Delaunay.triangulate(crystals.map(p=>[p.x,p.y]));const cs=CRYSTAL[crystalPalette];paperLayer.strokeWeight(.45);
 for(let i=0;i<tri.length;i+=3){const a=crystals[tri[i]],b=crystals[tri[i+1]],c=crystals[tri[i+2]];if(dist(a.x,a.y,b.x,b.y)>65||dist(b.x,b.y,c.x,c.y)>65||dist(c.x,c.y,a.x,a.y)>65)continue;const col=color(cs[floor(a.hue*3)]);col.setAlpha(8);paperLayer.fill(col);const edge=color(cs[2]);edge.setAlpha(23);paperLayer.stroke(edge);paperLayer.triangle(a.x,a.y,b.x,b.y,c.x,c.y)}
}
function draw(){if(Studio.paused||Studio.suspended)return;for(const p of Studio.hands.values())if(frozenTime%5===0)seedCrystal(p.x+random(-15,15),p.y+random(-15,15),2);stepCrystal();background('#0a1420');const ctx=drawingContext,g=ctx.createRadialGradient(width*.5,height*.4,0,width*.5,height*.45,height*.7);g.addColorStop(0,'#1c3444');g.addColorStop(1,'#070b15');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);image(paperLayer,0,0);noStroke();for(const p of crystals){fill(CRYSTAL[crystalPalette][2]);circle(p.x,p.y,max(.4,1.8-p.life*.018))}}
'''

honey=r'''
// Splash! by Jason Labbe: target-seeking droplets split once fast, then fall under gravity.
// Reskin: filled liquid typography, pigment, touch impulses, returning drops, no font file.
let drops=[],honeyWord=0,honeyPalette='honey',honeyTime=0,wordTargets=[];
const HONEY={honey:{bg:'#fff5df',dark:'#af691b',bright:'#f7cc59',shadow:'#c5893d'},berry:{bg:'#f9edf0',dark:'#8b385d',bright:'#ed96ab',shadow:'#bb6486'},mint:{bg:'#eaf3e9',dark:'#3f7866',bright:'#9dc7a5',shadow:'#5b927d'}};
function liquidDrop(x,y,tx,ty){return{pos:createVector(x,y),vel:createVector(0,0),acc:createVector(0,0),target:createVector(tx,ty),activate:false,recovering:false,fallVariance:random(.75,1.25),size:random(1.8,3.3),age:0,child:false,shine:random()>.78}}
function resetHoney(){const g=createGraphics(width,height);g.pixelDensity(1);g.textFont('Georgia');g.textStyle(BOLD);g.textAlign(CENTER,CENTER);g.textSize(min(width*.21,145));g.fill(255);g.text(['HONEY','LOVE','MELT'][honeyWord],width*.5,height*.43);g.loadPixels();wordTargets=[];const spacing=width<500?3.4:5;for(let y=height*.26;y<height*.59;y+=spacing)for(let x=width*.04;x<width*.96;x+=spacing){let i=(floor(y)*width+floor(x))*4;if(g.pixels[i+3]>100)wordTargets.push({x,y})}g.remove();drops=wordTargets.map(p=>liquidDrop(p.x,p.y,p.x,p.y));honeyTime=0}
function setup(){artCanvas();resetHoney();Studio.onDown=p=>splashNear(p,1.5);Studio.onMove=p=>splashNear(p,3+min(7,hypot(p.dx,p.dy)*.12));Studio.onTool=n=>{if(n==='word'){honeyWord=(honeyWord+1)%3;resetHoney()}else if(n==='pour'){for(const p of drops)if(!p.child){p.vel.add(random(-3,3),random(3,6))}}else{honeyPalette=n;Studio.select('palette',n);document.body.style.background=HONEY[n].bg}};Studio.onReset=resetHoney}
function splashNear(p,strength){for(const d of drops){const dx=d.pos.x-p.x,dy=d.pos.y-p.y,dd=hypot(dx,dy);if(dd<70&&dd>.01){d.recovering=false;d.vel.add(dx/dd*strength,dy/dd*strength-.3)}}}
function stepDrop(p){p.age++;if(!p.activate){if(p.vel.mag()>2.4&&!p.recovering){p.activate=true;p.age=0;if(!p.child&&drops.length<2300)for(let i=0;i<2;i++){let q=liquidDrop(p.pos.x,p.pos.y,p.target.x,p.target.y);q.activate=true;q.child=true;q.vel=p.vel.copy().rotate(random(-.35,.35)).mult(random(.7,1.2));q.size=random(1,2.5);drops.push(q)}}else{let d=p5.Vector.sub(p.target,p.pos),length=d.mag();if(length<3){p.recovering=false;p.vel.mult(.15)}p.vel.mult(.93);if(length>.2){d.normalize().mult(min(.36,length*.018));p.acc.add(d)}}}else{p.acc.y+=.17*p.fallVariance;p.vel.mult(.994);if(p.pos.y>height*.74){p.pos.y=height*.74;p.vel.y*=-.35;p.vel.x*=.95}if(p.age>90&&!p.child){p.activate=false;p.recovering=true;p.vel.mult(.08)}}
 for(const h of Studio.hands.values()){let d=p5.Vector.sub(p.pos,createVector(h.x,h.y)),l=d.mag();if(l>0&&l<55){d.normalize().mult((1-l/55)*.4);p.acc.add(d)}}p.vel.add(p.acc);p.vel.limit(12);p.pos.add(p.vel);p.acc.mult(0);if(p.pos.x<0||p.pos.x>width){p.pos.x=constrain(p.pos.x,0,width);p.vel.x*=-.5}}
function draw(){if(Studio.paused||Studio.suspended)return;honeyTime++;const s=HONEY[honeyPalette];background(s.bg);noStroke();fill(s.shadow+'16');ellipse(width*.5,height*.745,width*.82,15);
 for(let i=drops.length-1;i>=0;i--){const p=drops[i];stepDrop(p);if(p.child&&p.age>180){drops.splice(i,1);continue}const r=p.size*(p.activate?1.1:1);stroke(s.dark);strokeWeight(r*2);point(p.pos.x,p.pos.y);noStroke();fill(s.bright);circle(p.pos.x-r*.23,p.pos.y-r*.25,r*1.45);if(p.shine){fill('#fffce1');circle(p.pos.x-r*.25,p.pos.y-r*.4,r*.38)}}
}
function hypot(x,y){return Math.hypot(x,y)}
'''

sketches=[tree,creatures,sculpture,pearls,crystal,honey]
p5=(R/'vendor/p5.min.js').read_text()

def shell(e,inline=False):
    groups={}
    buttons=''
    for n,label,group in e['tools']:
        active=group not in groups and group!='action'
        groups[group]=True
        buttons+=f'<button data-tool="{n}" data-group="{group}" aria-pressed="{str(active).lower()}">{label}</button>'
    body=f'''<body class="{e['theme']}"><div id="canvas-container"></div><header><h1>{e['name']}</h1><button data-pause aria-label="Pause">Ⅱ</button><button data-hide aria-label="Hide controls">◌</button></header><button class="show-controls" data-show aria-label="Show controls">◌</button><div class="controls"><p class="hint">{e['hint']}</p><div class="tools">{buttons}<button data-reset>Reset</button></div></div><div id="error" role="alert"></div>'''
    header=f'''<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{e['name']}</title><meta name="author" content="Remix of {e['author']}"><!-- Based on {e['source']}; original and adaptation CC BY-SA 3.0. Source notices are included in the ZIP. p5.js LGPL 2.1. -->'''
    if inline:
        scripts=''.join('<script>'+s.replace('</script','<\\/script')+'</script>' for s in [p5,common,sketches[entries.index(e)]])
        return header+'<style>'+css+'</style></head>'+body+scripts+'</body></html>'
    return header+'<link rel="stylesheet" href="../studio.css"></head>'+body+'<script src="../../vendor/p5.min.js"></script><script src="../input.js"></script><script src="sketch.js"></script></body></html>'

for e,sketch in zip(entries,sketches):
    d=G/e['slug'];d.mkdir(exist_ok=True)
    (d/'sketch.js').write_text(sketch)
    (d/'index.html').write_text(shell(e))
    shutil.copytree(S/e['folder'],d/'original',dirs_exist_ok=True)
    license=f'''{e['name']}, adapted from {e['author']}'s OpenProcessing sketch\n{e['source']}\nOriginal and adaptation: CC Attribution ShareAlike 3.0\nhttps://creativecommons.org/licenses/by-sa/3.0/\nChanges: palette, visual material, touch input, offline packaging.\nOriginal algorithms are credited in sketch.js and preserved in original/.\n'''
    if e['id']==2256732:license+='Hobby curve algorithm by Arnoson, https://github.com/arnoson/hobby-curve, package.json declares ISC. Attribution retained in original/hobby-curve.js.\n'
    if e['id']==916227:license+='Delaunay implementation credited by original author to Jay LaPorte, https://github.com/ironwallaby/delaunay/blob/master/delaunay.js. Original file and attribution retained.\n'
    (d/'LICENSE.txt').write_text(license)
    html=shell(e,True);(G/'standalone'/f"{e['slug']}.html").write_text(html)
    with zipfile.ZipFile(G/'packages'/f"{e['slug']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('index.html',html);z.writestr('LICENSE.txt',license);z.write(R/'vendor/P5-LICENSE.txt','P5-LICENSE.txt');z.writestr('adapted/sketch.js',sketch)
        for f in (d/'original').iterdir():z.write(f,'original/'+f.name)

(G/'manifest.json').write_text(json.dumps(entries,indent=2))
(G/'UPLOAD.txt').write_text('Each standalone HTML works offline. Upload it individually, or upload the corresponding ZIP with index.html at its root. All controls use English. No external assets or service integrations.\n')

cards=''.join(f'''<article><a class="preview" href="{e['slug']}/"><img src="previews/{e['slug']}.jpg" alt="{e['name']} interactive artwork"></a><div class="caption"><small>{e['slug'][:2]} / TOUCH ART</small><h2>{e['name']}</h2><p>{e['hint']}</p><nav><a href="{e['slug']}/">Play ↗</a><a download href="standalone/{e['slug']}.html">HTML ↓</a><a download href="packages/{e['slug']}.zip">ZIP ↓</a></nav></div></article>''' for e in entries)
(G/'index.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Six More Touch Artworks</title><style>*{box-sizing:border-box}body{margin:0;background:#eee9df;color:#3c3933;font-family:Arial,sans-serif}main{max-width:1220px;margin:auto;padding:40px 24px}header{display:flex;align-items:end;gap:25px;justify-content:space-between;padding-bottom:28px}h1{font:48px Georgia,serif;margin:8px 0}header p{max-width:390px;line-height:1.6;font-size:13px;color:#777264}small{font-size:10px;letter-spacing:2px;color:#877c6f}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}article{background:#f9f6ef;border:1px solid #b8b1a333;border-radius:18px;overflow:hidden}.preview{display:block;height:320px;overflow:hidden}.preview img{height:100%;width:100%;object-fit:cover;object-position:center 43%}.caption{padding:22px}h2{font:26px Georgia,serif;margin:8px 0 12px}article p{font-size:12px;line-height:1.7;color:#7c7366;min-height:42px}nav{display:flex;gap:8px}nav a{background:#e7e0d3;border-radius:20px;padding:10px 15px;color:#484238;text-decoration:none;font-size:12px}nav a:first-child{background:#4b5446;color:#fff7e9}footer{font-size:12px;padding:30px 0;color:#837a6b}footer a{color:inherit}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}header{display:block}h1{font-size:40px}}@media(max-width:540px){main{padding:24px 16px}.grid{grid-template-columns:1fr}.preview{height:380px}}</style></head><body><main><header><div><small>COLLECTION TWO · 07—12</small><h1>More ways to wander.</h1></div><p>Six soft, tactile worlds. Each artwork has its own movement and material. Play here or download an individual offline file.</p></header><div class="grid">'''+cards+'''</div><footer>Independent HTML & ZIP files · English controls · Touch & mouse · <a href="../upload-art/">First collection ↗</a> · <a href="../art20/">New: twenty artworks ↗</a></footer></main></body></html>''')
print('Built six more offline HTML and ZIP artworks.')
