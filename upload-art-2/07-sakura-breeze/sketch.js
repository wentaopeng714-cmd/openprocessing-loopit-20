
// Dynamic tree by Jason Labbe: recursive branches, angular spring and air drag.
// Reskin: petal geometry, seasonal pigment, paper grain, touch wind. CC BY-SA 3.0.
let maxLevel=7,branchForce=.5,rootBranch,treeScale=1,petals=[],season='sakura',wind=0,tick=0;
const TREE_SKINS={sakura:{paper:'#f9f1e9',ink:'#65534e',petal:['#d58495','#f1b2bb','#ffd1c8'],sun:'#efc1ae'},maple:{paper:'#ece7d6',ink:'#52492d',petal:['#cf602e','#df972e','#a44828'],sun:'#d6be83'},moon:{paper:'#171e30',ink:'#c0b4a7',petal:['#9c9ecb','#d9c2d7','#718eab'],sun:'#d4d3d9'}};
function Leaf(){this.size=random(8,18);this.offsetX=random(-18,18);this.offsetY=random(-18,18);this.rotation=random(TWO_PI);this.col=floor(random(3))}
function Berry(){Leaf.call(this);this.size*=.6}
// A branch's position is always relative to its parent.
function Branch(length, angle, level) {
	this.vel = 0;
	this.acc = 0
	this.level = level;
	this.angle = angle;
	this.restAngle = angle;
	this.length = length;
	this.children = [];
	this.leaves = [];
	
	// If the branch is high enough then begin spawning leaves and berries.
	if (this.level > maxLevel - 3) {
		for (let i = 0; i < int(random(6)); i++) {
			if (i % 6 == 0) {
				this.leaves.push(new Berry());
			} else {
				this.leaves.push(new Leaf());
			}
		}
	}
	
	// Adds a new branch as a child.
	this.newBranch = function(angle, mult) {
		let newBranch = new Branch(this.length * mult, angle, this.level + 1)
		this.children.push(newBranch);
    return newBranch;
	}
	
	// Adds a new velocity to its acceleration.
	this.applyForce = function(force) {
    this.acc += force;
	}
	
	// Simulates its new angle.
	this.move = function() {
		// Add some weak wind so there's subtle motion when it's idle.
		let windMult = map(this.level, 0, maxLevel, 0.1, 1) * random(0.75, 1.25);
		let wind = noise(frameCount * 0.002) * 0.5 * windMult;
		this.applyForce(wind);
		
		// Always have the angle chasing back to its rest pose.
		// This is what causes the branches to bounce.
		let angleThresh = 10;
		let spring = new p5.Vector(this.restAngle, 0);
		let distance = dist(this.angle, 0, this.restAngle, 0);
		let force = map(min(distance, angleThresh), 0, angleThresh, 0, branchForce);
		spring.sub(new p5.Vector(this.angle, 0));
		spring.normalize();
		spring.mult(force);
		this.applyForce(spring.x);
		
		// Slow down velocity with air drag.
		this.vel *= 0.95;
		
		// Add acceleration to velocity, and then to the angle.
		this.vel += this.acc;
		this.angle += this.vel;
		this.angle = constrain(this.angle, this.restAngle - 45, this.restAngle + 45);  // Limit how far its angle can bend, otherwise it could spin!
		this.acc = 0;
	}
}
function subDivide(b){let n=floor(random(1,4));for(let i=0;i<n;i++){const a=n===1?random(-25,25):map(i,0,n-1,-35,35)+random(-8,8);const c=b.newBranch(a,random(.69,.84));if(c.level<maxLevel)subDivide(c)}}
function newTree(){rootBranch=new Branch(random(95,125),-90,0);subDivide(rootBranch);let xs=[],ys=[];function bounds(b,x,y,a){a+=b.restAngle;x+=cos(radians(a))*b.length;y+=sin(radians(a))*b.length;xs.push(x);ys.push(y);for(const c of b.children)bounds(c,x,y,a)}bounds(rootBranch,0,0,0);treeScale=min((width*.88)/(max(xs)-min(xs)+70),height*.58/(-min(ys)+25));petals=[];wind=0}
function setup(){artCanvas();newTree();Studio.onDown=p=>{wind+=.8;dropPetals(p.x,p.y,8)};Studio.onMove=p=>{wind=constrain(wind+p.dx*.014,-4,4);dropPetals(p.x,p.y,2)};Studio.onTool=n=>{if(TREE_SKINS[n]){season=n;Studio.select('palette',n);document.body.classList.toggle('paper',n!=='moon')}else{wind=3.8;dropPetals(width*.5,height*.35,65)}};Studio.onReset=newTree}
function dropPetals(x,y,n){for(let i=0;i<n;i++)petals.push({x:x+random(-90,90),y:y+random(-40,40),vx:random(-1,1)+wind,vy:random(.3,1.4),a:random(TWO_PI),s:random(3,8),c:floor(random(3)),life:600});if(petals.length>220)petals.splice(0,petals.length-220)}
function blossom(x,y,l,skin){push();translate(x,y);rotate(l.rotation);noStroke();fill(skin.petal[l.col]);for(let k=0;k<5;k++){rotate(TWO_PI/5);ellipse(l.size*.29,0,l.size*.67,l.size*.48)}fill(season==='moon'?'#eee2dd':'#aa7650');circle(0,0,l.size*.18);pop()}
function showBranch(b,wx,wy,wa){wa+=b.angle;const nx=wx+cos(radians(wa))*b.length,ny=wy+sin(radians(wa))*b.length;let force=wind*.12*map(b.level,0,maxLevel,.05,1);for(const p of Studio.hands.values()){const d=dist(p.x,p.y,width*.5+nx*treeScale,height*.78+ny*treeScale);if(d<160)force+=(p.x<width*.5+nx*treeScale?1:-1)*(1-d/160)*1.5*(b.level+1)/8}b.applyForce(force);b.move();push();rotate(radians(b.angle));stroke(TREE_SKINS[season].ink);strokeWeight((maxLevel-b.level+1)*1.04);line(0,0,b.length,0);for(const l of b.leaves)blossom(b.length+l.offsetX,l.offsetY,l,TREE_SKINS[season]);translate(b.length,0);for(const c of b.children)showBranch(c,nx,ny,wa);pop()}
function draw(){if(Studio.paused||Studio.suspended)return;tick++;wind*=.984;const s=TREE_SKINS[season];background(s.paper);noStroke();fill(s.sun);circle(width*.72,height*.26,min(width,height)*.24);fill(season==='moon'?'#252b3c':'#e8dfd4');ellipse(width*.5,height*.785,width*.6,14);push();translate(width*.5,height*.78);scale(treeScale);showBranch(rootBranch,0,0,0);pop();if(tick%45===0)dropPetals(width*.5,height*.32,1);for(let i=petals.length-1;i>=0;i--){const p=petals[i];p.x+=p.vx+sin(tick*.015+p.a)*.5;p.y+=p.vy;p.vx*=.99;p.a+=.018;p.life--;push();translate(p.x,p.y);rotate(p.a);fill(s.petal[p.c]);noStroke();ellipse(0,0,p.s,p.s*.48);pop();if(p.y>height*.79)p.vy=0;if(p.life<0)petals.splice(i,1)}stroke(season==='moon'?'#ffffff06':'#483b2907');strokeWeight(1);for(let i=0;i<90;i++)point((i*157.1)%width,(i*241.7)%height)}
