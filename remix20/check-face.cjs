const fs=require('fs'),path=require('path'),{createP5}=require('./render-node.cjs');
// Execute the real p5 OBJ loader and original blendshape functions in a simulated DOM.
// WebGL drawing is replaced with a software projection solely for this QA thumbnail.
(async()=>{
 let code=fs.readFileSync(path.join(__dirname,'20-porcelain-expressions/sketch.js'),'utf8');
 code=code.replace('createCanvas(windowWidth, windowHeight, WEBGL)','createCanvas(windowWidth, windowHeight)');
 code+=`\nvar testReady=false;const faceSetup=setup;setup=function(){window.ortho=()=>{};window.lights=()=>{};window.ambientLight=()=>{};window.directionalLight=()=>{};window.ambientMaterial=()=>{};window.rotateX=()=>{};window.rotateY=()=>{};window.model=()=>{};faceSetup();canvas.createBuffers=()=>{};testReady=true;};`;
 const p5=fs.readFileSync(path.join(__dirname,'../vendor/p5-1.3.1.min.js'),'utf8');
 const r=await createP5(code,390,844,p5);
 for(let i=0;i<120&&!r.win.testReady;i++)await new Promise(a=>setTimeout(a,100));
 if(!r.win.testReady)throw Error('OBJ preload did not finish: '+r.errors);
 r.frames(3);const meshes=r.win.meshes,controls=r.win.controls;
 if(Object.values(meshes).some(m=>!m||!m.vertices.length))throw Error('Missing source mesh');
 const initial=r.win.blendMeshes.normal.mesh.vertices.map(v=>[v.x,v.y,v.z]);
 r.win.R.action('smile');r.frames(3);
 const changed=r.win.blendMeshes.normal.mesh.vertices.filter((v,i)=>Math.abs(v.x-initial[i][0])+Math.abs(v.y-initial[i][1])+Math.abs(v.z-initial[i][2])>1e-6).length;
 if(changed<20)throw Error('Smile did not deform source vertices');
 r.win.R.action('surprise');r.frames(3);r.win.R.action('calm');r.frames(3);
 const restored=r.win.blendMeshes.normal.mesh.vertices.every((v,i)=>Math.abs(v.x-initial[i][0])+Math.abs(v.y-initial[i][1])+Math.abs(v.z-initial[i][2])<1e-6);
 if(!restored)throw Error('Calm did not restore vertices');
 r.win.R.x=390/2+controls[0].pos.x;r.win.R.y=844/2+controls[0].pos.y;r.win.mouseX=r.win.R.x;r.win.mouseY=r.win.R.y;r.win.R.down();
 if(!controls[0].active)throw Error('Touch did not acquire jaw control');
 r.win.R.y+=16;r.frames(3);if(controls[0].pos.y===controls[0].restPos.y)throw Error('Touch did not move jaw');r.win.R.up();
 r.win.R.action('smile');r.frames(3);
 const cn=r.canvas(),cx=cn.getContext('2d');cx.fillStyle='#f1e9df';cx.fillRect(0,0,390,844);
 // Same model orientation as the source: scale 93.6, X 180 degrees, Y 160 degrees.
 const ang=160*Math.PI/180,ss=93.6,polys=[];
 for(const [mesh,col] of [[r.win.blendMeshes.normal.mesh,[225,215,200]],[r.win.blendMeshes.brows.mesh,[75,60,50]],[meshes.hair,[75,60,50]],[meshes.eyes,[245,245,240]],[meshes.iris,[140,192,208]],[meshes.pupils,[20,20,20]]]){
  const vs=mesh.vertices.map(v=>({x:195+(v.x*Math.cos(ang)+v.z*Math.sin(ang))*ss,y:422+50-v.y*ss,z:(v.x*Math.sin(ang)-v.z*Math.cos(ang))*ss}));
  for(const f of mesh.faces){const a=vs[f[0]],b=vs[f[1]],c=vs[f[2]];if(!a||!b||!c)continue;const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1;const shade=.55+.45*Math.abs((n[0]*-.3+n[1]*-.5+n[2]*.8)/l);polys.push({p:[a,b,c],z:(a.z+b.z+c.z)/3,col:col.map(k=>Math.round(k*shade))});}
 }
 polys.sort((a,b)=>a.z-b.z);for(const f of polys){cx.fillStyle='rgb('+f.col.join(',')+')';cx.beginPath();cx.moveTo(f.p[0].x,f.p[0].y);cx.lineTo(f.p[1].x,f.p[1].y);cx.lineTo(f.p[2].x,f.p[2].y);cx.closePath();cx.fill();}
 fs.writeFileSync(path.join(__dirname,'20-porcelain-expressions/preview.png'),cn.toBuffer('image/png'));
 fs.writeFileSync(path.join(__dirname,'qa-face.json'),JSON.stringify({test:'Real p5 1.3.1 OBJ loader and original facial deformation; simulated DOM; WebGL drawing not tested',meshes:Object.keys(meshes).length,changedVertices:changed,calmRestored:restored,touchJawPassed:true,thumbnail:'Software projection of the source meshes, not a browser screenshot',errors:r.errors},null,2));console.log('PASS Facial Rig:',Object.keys(meshes).length,'loaded meshes;',changed,'vertices deformed; reset and touch passed;',r.errors);r.close();
})().catch(e=>{console.error(e);process.exit(1)});
