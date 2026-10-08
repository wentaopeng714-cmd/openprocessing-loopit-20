from pathlib import Path
import json, re, hashlib, zipfile
R = Path(__file__).parent
S = R/'studies'
entries = [
 dict(slug='01-liquid-light',name='Liquid Light',eyebrow='LIGHT / INERTIA / TOUCH',author='Jason Labbe',source='https://openprocessing.org/@theRussetPotato/835887',license='CC BY-SA 3.0',desc='Luminous ink gathers into liquid. Draw a stream, hold to build a pearl, or pull it into an orbit.',hint='Draw a light stream · hold for a pearl · two fingers bend the current',tools=[('melt','Melt','motion'),('orbit','Orbit','motion'),('glass','Glass','motion'),('opal','Opal','palette'),('ember','Ember','palette')],scripts=['sketch.js','particle.js','shader.js'],bg='#070b12'),
 dict(slug='02-living-fibres',name='Living Fibres',eyebrow='TEXTURE / CURRENT / COLOUR',author='David April',source='https://openprocessing.org/@dsa157/3026685',license='CC BY-NC-SA 3.0',desc='A living field of fine coloured fibres. Comb the grain, leave a whirlpool, and watch the texture grow around it.',hint='Drag to comb the fibres · hold to grow a whirlpool · the current lingers',tools=[('comb','Comb','brush'),('whirl','Whirl','brush'),('spectrum','Spectrum','palette'),('reef','Reef','palette'),('sunset','Sunset','palette')],scripts=['sketch.js'],bg='#000'),
 dict(slug='03-particle-atelier',name='Particle Atelier',eyebrow='PAPER / PIGMENT / PATTERN',author='Vamoss; original equations by Felix Auer',source='https://openprocessing.org/sketch/751983',license='CC BY-SA 3.0',desc='Living pigment on warm paper. Your stroke unfurls into petals, tidal lines, or orbiting threads, leaving a drawing behind.',hint='Draw with living pigment · hold to grow a rosette · switch the field to change its path',tools=[('petal','Petal','field'),('orbit','Orbit','field'),('tide','Tide','field'),('coral','Coral','palette'),('ink','Ink','palette'),('undo','Undo','action')],scripts=['sketch.js'],bg='#eae6dc',paper=True)
]
for n,e in enumerate(entries,1):
 p=S/e['slug'];p.mkdir(exist_ok=True)
 initial_palette=next(i for i,x in enumerate(e['tools']) if x[2]=='palette')
 tools=''.join(f'<button data-tool="{a}" data-group="{g}" aria-pressed="{str(i in [0,initial_palette]).lower()}">{b}</button>' for i,(a,b,g) in enumerate(e['tools']))
 scripts=''.join(f'<script src="{s}?v=4"></script>' for s in e['scripts'])
 (p/'index.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{e['name']} · OpenProcessing Remixes</title><link rel="stylesheet" href="../assets/studio.css?v=4"></head><body class="{'paper' if e.get('paper') else ''}"><main id="canvas-container" aria-label="{e['name']} interactive artwork"></main><header><a href="../" aria-label="Back to studies">←</a><h1>{e['name']}</h1><span class="number">0{n} / 03</span><button data-pause aria-label="Pause">Ⅱ</button><button data-reset aria-label="Reset">↻</button><button data-hide aria-label="Hide interface">⤢</button></header><aside class="controls"><p class="hint">{e['hint']}</p><div class="tools">{tools}</div></aside><div id="error" role="alert"></div><script src="../../vendor/p5.min.js"></script><script src="../assets/input.js?v=4"></script>{scripts}</body></html>''')
 files=list((p/'original').glob('*.js')); hashes={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in files}
 (p/'README.md').write_text(f"# {e['name']}\n\nA direct source adaptation of {e['source']} by {e['author']}.\n\nLicense: {e['license']}. Changes: responsive touch input, source-specific creative controls, new art direction, sustained effects, bounded particle lifecycle, mobile performance, and English presentation. Original source is preserved in original/. No connection to Loopit is required.\n\nOriginal hashes:\n```json\n{json.dumps(hashes,indent=2)}\n```\n")
(S/'manifest.json').write_text(json.dumps(entries,indent=2))

# Preserve the original flow-field simulation and colour-bucket renderer.
p=S/'02-living-fibres'
t=(p/'original/mySketch.js').read_text()
t=t.replace('let SKETCH_WIDTH = 600;', 'let SKETCH_WIDTH = Math.min(780, window.innerWidth);').replace('let SKETCH_HEIGHT = 800;', 'let SKETCH_HEIGHT = Math.min(1040, window.innerHeight);')
t=t.replace('let MAX_PARTICLES = 40000;', 'let MAX_PARTICLES = window.innerWidth < 600 ? 14000 : 22000;')
t=t.replace('let FIELD_STEP = 4;', 'let FIELD_STEP = 8;').replace('let STEP_SIZE = 1.0;', 'let STEP_SIZE = 1.4;')
t=t.replace('let TRAIL_FADE_ALPHA = 10;', 'let TRAIL_FADE_ALPHA = 6;').replace('let STROKE_WEIGHT_MAX = 3.0;', 'let STROKE_WEIGHT_MAX = 1.4;').replace('let PARTICLE_ALPHA = 20;', 'let PARTICLE_ALPHA = 38;')
t=t.replace('  frameRate(ANIMATION_SPEED);','  pixelDensity(1);\n  frameRate(ANIMATION_SPEED);\n  Studio.attach(canvas.elt, width, height);\n  installFibreTouch();')
t=t.replace('function draw() {','function draw() {\n  if (Studio.paused || Studio.suspended) return;\n  evolveFibreBrush();')
t=t.replace('      field[x][y] = p5.Vector.fromAngle(angle);','''      const k=y*cols+x;
      let vx=Math.cos(angle)+brushX[k], vy=Math.sin(angle)+brushY[k];
      const length=Math.hypot(vx,vy)||1;
      field[x][y] = p5.Vector.fromAngle(Math.atan2(vy,vx));
      field[x][y].mult(Math.min(2.5, .9+length*.2));''')
t=t.replace('    let nVal = noise(this.position.x * COLOR_NOISE_SCALE, this.position.y * COLOR_NOISE_SCALE);','''    if(this.colorNoise===undefined || frameCount%18===0) this.colorNoise=noise(this.position.x * COLOR_NOISE_SCALE, this.position.y * COLOR_NOISE_SCALE);
    let nVal = this.colorNoise;''')
t=t[:t.index('function mousePressed() {')]
t+='''
// Added: a persistent, painted vector field. No spring-to-shape behaviour.
let brushX,brushY,fibreBrush='comb';
function paintFibre(p,whirl){
 const radius=Math.min(width,height)*.25;
 const cx=Math.floor(p.x/FIELD_STEP),cy=Math.floor(p.y/FIELD_STEP),rr=Math.ceil(radius/FIELD_STEP);
 const speed=Math.hypot(p.dx,p.dy),dx=speed>0?p.dx/speed:1,dy=speed>0?p.dy/speed:0;
 for(let y=Math.max(0,cy-rr);y<Math.min(rows,cy+rr);y++)for(let x=Math.max(0,cx-rr);x<Math.min(cols,cx+rr);x++){
  const xx=x*FIELD_STEP-p.x,yy=y*FIELD_STEP-p.y,d=Math.hypot(xx,yy);if(d>=radius)continue;
  const f=Math.pow(1-d/radius,2),k=y*cols+x,mag=whirl?.16:.42;
  const tx=whirl?-yy/(d+10):dx,ty=whirl?xx/(d+10):dy;
  brushX[k]=Math.max(-3,Math.min(3,brushX[k]+tx*f*mag));brushY[k]=Math.max(-3,Math.min(3,brushY[k]+ty*f*mag));
 }
}
function evolveFibreBrush(){
 for(const p of Studio.hands.values())if(fibreBrush==='whirl'||performance.now()-p.start>350)paintFibre(p,true);
 if(frameCount%4===0){for(let k=0;k<brushX.length;k++){brushX[k]*=.993;brushY[k]*=.993}calculateFlowField(frameCount*TIME_SPEED);}
}
function installFibreTouch(){
 brushX=new Float32Array(Math.ceil(width/FIELD_STEP)*Math.ceil(height/FIELD_STEP));brushY=new Float32Array(brushX.length);
 Studio.onMove=p=>{paintFibre(p,fibreBrush==='whirl');Studio.hint(fibreBrush==='whirl'?'Your whirlpool keeps turning after your hand leaves.':'The fibres remember the direction of your stroke.');};
 Studio.onDown=p=>{p.start=performance.now();paintFibre(p,true)};
 Studio.onTool=(name)=>{if(['comb','whirl'].includes(name)){fibreBrush=name;Studio.select('brush',name);return}
 PALETTE_INDEX={spectrum:0,reef:3,sunset:2}[name]??0;Studio.select('palette',name);Studio.hint('A new colour atmosphere flows through the existing texture.');};
 Studio.onReset=()=>{brushX.fill(0);brushY.fill(0);GLOBAL_SEED++;randomSeed(GLOBAL_SEED);noiseSeed(GLOBAL_SEED);calculateFlowField(0);applyBackgroundColor();};
}
'''
# setup calculates initial field before brush arrays exist; ensure allocation precedes it.
t=t.replace('  // Pre-calculate the flow field','  brushX=new Float32Array(cols*rows);brushY=new Float32Array(cols*rows);\n  // Pre-calculate the flow field')
(p/'sketch.js').write_text('// Direct adaptation of David April, Hairy Colorful Patches, CC BY-NC-SA 3.0.\n'+t)

# Keep Vamoss/Felix Auer differential equations and RK4 integration.
p=S/'03-particle-atelier';t=(p/'original/mySketch.js').read_text()
slopes=t[t.index('function getSlopeY'):]
# Clamp singularities that can otherwise poison a pigment path.
slopes=slopes.replace('Math.log(Math.abs(x))*Math.log(Math.abs(y))','Math.log(Math.max(.001,Math.abs(x)))*Math.log(Math.max(.001,Math.abs(y)))')
integration=t[t.index('\tvar stepsize ='):t.index('\nfunction getSlopeY')]
integration=integration.replace('deltaTime*0.002','Math.min(deltaTime,35)*0.003').replace('i > 0','i >= 0').replace('stroke(blob.color);','stroke(blob.color);').replace('const border = 200;','const border = 60;\n        blob.life--;').replace('if(x < -border','if(blob.life<0 || !Number.isFinite(x+y) || x < -border')
integration=integration.replace('strokeWeight(blob.size);','strokeWeight(blob.size * Math.min(1,blob.life/90));').replace('line(x, y, blob.lastX, blob.lastY);','if(Math.hypot(x-blob.lastX,y-blob.lastY)<65)line(x, y, blob.lastX, blob.lastY);')
head='''// Particle Plotter, Vamoss, based on Felix Auer's differential equations.
// Source https://openprocessing.org/sketch/751983 · CC BY-SA 3.0.
// Added: paper/pigment rendering, deliberate fields, lasting ink, gesture brush and undo.
let blobs=[],colors,variation=11,xScale,yScale,centerX,centerY;
let pigment='coral',undoFrames=[],emitted=0;
const palettes={coral:['#ad4a37','#e87752','#b99857','#537f79','#343a36'],ink:['#122e34','#315a68','#669097','#b58459','#202925']};
function setup(){
 const c=createCanvas(Math.min(1000,window.innerWidth),Math.min(1100,window.innerHeight));c.parent('canvas-container');pixelDensity(1);frameRate(60);
 xScale=width/18;yScale=xScale;centerX=width/2;centerY=height/2;
 colors=palettes[pigment].map(x=>color(x));clearPaper();Studio.attach(c.elt,width,height);
 Studio.onDown=p=>{saveUndo();const ox=centerX,oy=centerY;centerX=p.x;centerY=p.y;for(const b of blobs){b.x+=(ox-centerX)/xScale;b.y+=(oy-centerY)/yScale;}emit(p,70);Studio.hint('The pigment keeps unfolding. Hold your brush to grow a new rosette.');};
 Studio.onMove=p=>emit(p,Math.min(30,10+Math.hypot(p.dx,p.dy)));
 Studio.onTool=name=>{if(name==='undo'){if(undoFrames.length){drawingContext.putImageData(undoFrames.pop(),0,0);blobs=[];}return}
 if(palettes[name]){pigment=name;colors=palettes[name].map(x=>color(x));Studio.select('palette',name)}else{variation={petal:11,orbit:7,tide:3}[name]??11;Studio.select('field',name);Studio.hint('New strokes follow the '+name+' field. Earlier ink stays on the paper.');}};
 Studio.onReset=()=>{saveUndo();blobs=[];clearPaper()};
 // A small initial hand-painted composition, never a replacement for input.
 for(let k=0;k<8;k++){const a=k/8*TWO_PI;emit({x:width*.5+cos(a)*width*.13,y:height*.46+sin(a)*width*.13,dx:0,dy:0,pressure:.3},80);}
}
function clearPaper(){background('#eae6dc');const ctx=drawingContext;ctx.save();ctx.fillStyle='#334036';ctx.globalAlpha=.045;for(let i=0;i<width*height/85;i++)ctx.fillRect(Math.random()*width,Math.random()*height,.7,.7);ctx.restore();}
function saveUndo(){if(undoFrames.length>=5)undoFrames.shift();undoFrames.push(drawingContext.getImageData(0,0,width,height));}
function emit(p,count){
 const speed=Math.hypot(p.dx,p.dy),spread=Math.max(3,Math.min(width*.14,55+speed));
 for(let i=0;i<count;i++){const a=random(TWO_PI),r=random(spread),x=p.x+cos(a)*r,y=p.y+sin(a)*r;blobs.push({x:getXPos(x),y:getYPos(y),xSpeed:0,ySpeed:0,size:random(.25,.9)*(1+speed*.005),lastX:x,lastY:y,color:colors[(emitted++)%colors.length],direction:random(.3,1)*(random()>.5?1:-1),life:random(140,360)});}
 if(blobs.length>2200)blobs.splice(0,blobs.length-2200);
}
function draw(){
 if(Studio.paused||Studio.suspended)return;
 for(const p of Studio.hands.values())emit(p,12);
 const length=blobs.length;
'''
(p/'sketch.js').write_text(head+integration+'\n'+slopes)

# Shader and particle primitives remain derived directly from Jason Labbe.
p=S/'01-liquid-light'
shader=(p/'original/shader.js').read_text()
shader=shader.replace('uniform vec2 resolution;', 'uniform vec2 resolution;\n uniform vec3 inkTint;')
shader=shader.replace('float r = 0.0;', 'vec2 aspect=vec2(resolution.x/resolution.y,1.0);\n vec2 gradient=vec2(0.0);\n float r = 0.0;')
shader=shader.replace('distance(st, trailPos.xy)','max(.003,distance(st*aspect, trailPos.xy*aspect))').replace('distance(st, pos)','max(.003,distance(st*aspect, pos*aspect))')
shader=shader.replace('g += value * 0.5;\n\t\t\t\tb += value;', 'r += value * inkTint.r;\n g += value * inkTint.g;\n b += value * inkTint.b;')
shader=shader.replace('float mult = 0.00005;', 'float mult = 0.0000016;')
shader=shader.replace('vec3 color = colors[i];','vec3 color = colors[i];\n vec2 delta=(st-pos)*aspect;\n float d=max(.008,length(delta));\n gradient-=2.0*delta/(d*d*d*d)*mult*mass*length(color);')
shader=shader.replace('float value = float(i) /','vec2 delta=(st-trailPos.xy)*aspect;\n float d=max(.008,length(delta));\n gradient-=2.0*delta/(d*d*d*d)*float(i)*.000002;\n float value = float(i) /')
shader=shader.replace('max(.003,distance(st*aspect, trailPos.xy*aspect))','pow(max(.006,distance(st*aspect, trailPos.xy*aspect)),2.0)').replace('max(.003,distance(st*aspect, pos*aspect))','pow(max(.006,distance(st*aspect, pos*aspect)),2.0)').replace('* 0.00015;','* 0.000002;')
shader=shader.replace('gl_FragColor = vec4(r, g, b, 1.0);','''vec3 light=vec3(r,g,b);
 float energy=length(light);
 // Retain Labbe's inverse-distance light accumulation; give it a pearlescent core.
 vec3 hue=light/max(.001,energy);
 vec3 normal=normalize(vec3(gradient*.004,1.0));
 vec3 lamp=normalize(vec3(-.55,.7,1.1));
 float diffuse=max(.0,dot(normal,lamp));
 float spec=pow(max(.0,dot(reflect(-lamp,normal),vec3(0.,0.,1.))),28.0);
 float liquid=smoothstep(.54,.57,energy);
 float rim=pow(1.0-normal.z,2.0);
 vec3 sheen=.55+.45*cos(vec3(0.,2.,4.)+normal.z*5.0);
 vec3 surface=hue*(.16+diffuse*.9)+vec3(.85,.93,1.)*spec*.8+sheen*rim*.5;
 vec3 glow=(1.0-exp(-light*.25))*.4;
 vec3 col=mix(glow,surface,liquid);
 gl_FragColor = vec4(col+vec3(.015,.022,.032),1.0);''')
(p/'shader.js').write_text('// Jason Labbe inverse-distance light shader, adapted under CC BY-SA 3.0.\n'+shader)
part=(p/'original/particle.js').read_text()
part=part.replace('this.mass = random(1, 20);','this.mass = random(4, 18);\n this.life=1;this.age=0;this.anchor=false;')
part=part.replace('this.vel.mult(this.airDrag);','''this.age++;
 this.life=Math.max(0,this.life-(motion==='glass'?.00035:.002));
 if(motion==='orbit'){let dx=width/2-this.pos.x,dy=height/2-this.pos.y,d=Math.hypot(dx,dy)||1;this.vel.x+=dx*.0005-dy/d*.09;this.vel.y+=dy*.0005+dx/d*.09;this.vel.limit(5);}
 if(motion==='glass')this.vel.mult(.8);else this.vel.mult(.981);
 for(const h of Studio.hands.values()){const dx=this.pos.x-h.x,dy=this.pos.y-h.y,d=Math.hypot(dx,dy);if(d<160&&d>1){this.vel.x+=-dy/d*.055;this.vel.y+=dx/d*.055;}}
 this.mass*=.9995;''')
(p/'particle.js').write_text('// Jason Labbe particle primitive, adapted under CC BY-SA 3.0.\n'+part)

print('Built three direct-source studies; independent rendering algorithms.')
