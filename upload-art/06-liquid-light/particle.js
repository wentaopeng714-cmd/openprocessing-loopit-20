// Jason Labbe particle primitive, adapted under CC BY-SA 3.0.
function Particle(x, y, vx, vy) {
	this.pos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
	this.vel.mult(random(10));
	this.vel.rotate(radians(random(-25, 25)));
	this.mass = random(4, 18);
 this.life=1;this.age=0;this.anchor=false;
	this.airDrag = random(0.92, 0.98);
	this.colorIndex = int(random(colorScheme.length));
	
	this.move = function() {
		this.age++;
 this.life=Math.max(0,this.life-(motion==='glass'?0:.002));
 if(motion==='orbit'){let dx=width/2-this.pos.x,dy=height/2-this.pos.y,d=Math.hypot(dx,dy)||1;this.vel.x+=dx*.0005-dy/d*.09;this.vel.y+=dy*.0005+dx/d*.09;this.vel.limit(5);}
 if(motion==='glass')this.vel.mult(.8);else this.vel.mult(.981);
 for(const h of Studio.hands.values()){const dx=this.pos.x-h.x,dy=this.pos.y-h.y,d=Math.hypot(dx,dy);if(d<160&&d>1){this.vel.x+=-dy/d*.055;this.vel.y+=dx/d*.055;}}
 this.mass*=motion==='glass'?1:.9995;
		this.pos.add(this.vel);
	}
}