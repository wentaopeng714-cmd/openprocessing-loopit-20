const fs=require('fs'),vm=require('vm'),assert=require('assert');let context={window:{},console,Math,Float32Array,Map};vm.createContext(context);vm.runInContext(fs.readFileSync('assets/art/interactions.js','utf8'),context);const Interaction=context.window.ArtInteraction;
function make(kind,points=[]){let art={kind,points,pointers:new Map(),rings:[],onGesture(){}};return new Interaction(art);}
// A drawn food trail must be consumed by autonomous fish, rather than dissolve particles.
let koi=make('koi');koi.down({x:500,y:500},1);koi.up({x:500,y:500},1);assert.equal(koi.s.food.length,1);for(let i=0;i<1800;i++)koi.update(1/60);assert.equal(koi.s.food.length,0);
// Wiping must erase fog locally, retain the cleared area, and allow gradual condensation.
let rain=make('rain');rain.down({x:500,y:500},1);assert.equal(rain.s.mist[16*32+16],0);assert.equal(rain.s.mist[0],1);rain.up({x:500,y:500},1);rain.update(10);assert(rain.s.mist[16*32+16]>0&&rain.s.mist[16*32+16]<.5);
// A scratch must yield rotation and continue after release.
let vinyl=make('vinyl');vinyl.down({x:650,y:500},1);vinyl.move({x:500,y:650},{x:650,y:500},1);vinyl.up({x:500,y:650},1);let angle=vinyl.s.angle;vinyl.update(.5);assert(vinyl.s.angle>angle);assert(vinyl.s.omega>0);
// A swipe crossing fruit separates opposite halves, leaving untouched fruits intact.
let fruit=make('fruit');fruit.down({x:200,y:430},1);fruit.up({x:390,y:430},1);fruit.update(1);assert.notEqual(fruit.s.cuts[0].a,null);let a=fruit.target({g:0,hx:295,hy:410},295,410,0),b=fruit.target({g:0,hx:295,hy:450},295,450,0);assert(b.y-a.y>80);assert.equal(fruit.s.cuts[3].a,null);
// Independent paper hinges must retain folds after the finger lifts.
let crane=make('crane');crane.down({x:300,y:430},1);crane.move({x:600,y:430},{x:300,y:430},1);crane.up({x:600,y:430},1);for(let i=0;i<120;i++)crane.update(1/60);assert(crane.s.folds[0]>.8);assert.equal(crane.s.folds[1],0);
// The lamp cord toggles only after a meaningful pull, not after a stray tap.
let lamp=make('lamp');lamp.down({x:720,y:740},1);lamp.up({x:720,y:745},1);assert.equal(lamp.s.on,true);lamp.down({x:720,y:740},2);lamp.move({x:720,y:830},{x:720,y:740},2);lamp.up({x:720,y:830},2);assert.equal(lamp.s.on,false);
// Shared interpolation cannot apply generic touch-repulsion to any of the twenty scenes.
let face=make('face');face.down({x:610,y:585},1);let lip=face.target({g:100,hx:500,hy:584},500,584,0),nose=face.target({g:0,hx:500,hy:480},500,480,0);assert(lip.y>600);assert.equal(nose.y,480);let torso=crane.target({g:1,hx:550,hy:590},550,590,0);assert.equal(torso.x,550);
console.log('Passed: autonomous feeding, fog persistence, angular inertia, slicing, retained independent folds, cord threshold, no generic repulsion.');
