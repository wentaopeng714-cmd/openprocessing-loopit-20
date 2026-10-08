/* Original: Mouse Twitch — maks
Source: https://openprocessing.org/@maksss/3026808
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */

let particles=[];
let step=40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let x=step;x<windowWidth-step;x+=step){
    for (let y=step;y<windowHeight-step;y+=step){
      particles.push(new particle(x,y));
    }
  }
  background(18,15,35);stroke(211,155,251)
}


let mX=0;
let mY=0;

function draw() {
  mX=mouseX;
  mY=mouseY;
  for (c=particles.length-1;c>0;c--){
    particles[c].update();
    particles[c].show();
  }
  background(18,15,35,40);

}

function particle(x,y){
  this.x0=x;
  this.y0=y;
  this.pos=createVector(x,y);
  this.oldMove=createVector(0,0);
  this.rand=random(0.95,1.);

  this.update=function (){
    this.move=createVector(this.x0-this.pos.x,this.y0-this.pos.y).div(10).add(this.oldMove);
    this.oldMove=this.move.div(1.02);
    this.move.add(createVector(random()-0.5,random()-0.5).div(6));
    this.move.add(createVector(mX-this.pos.x,mY-this.pos.y).normalize().mult(6).div(max(1,sqrt(abs(mX-particles[c].pos.x)+abs(mY-particles[c].pos.y)))));
    this.pos.add(this.move);
  }

  this.show=function(){

    strokeWeight(random(9.6,10.));
    point(this.pos.x,this.pos.y);
  }

}

function mousePressed(){
  for (c=particles.length-1;c>0;c--){
    particles[c].oldMove.add(createVector(mX-particles[c].pos.x,mY-particles[c].pos.y).normalize().mult(-20).div(max(1,sqrt(abs(mX-particles[c].pos.x)+abs(mY-particles[c].pos.y)))/2.));
  }
}





// Interactive additions; original core retained above.

Lab.installP5({before(){if(Lab.pointer.down)for(let p of particles){let dx=p.pos.x-mouseX,dy=p.pos.y-mouseY,d=Math.hypot(dx,dy);if(d<130&&d>1)p.oldMove.add(dx/d*.22,dy/d*.22);}},after(){Lab.collect(particles,p=>p.pos,p=>Lab.pointer.down&&Math.hypot(p.pos.x-p.x0,p.pos.y-p.y0)>5,2,4);Lab.drawTarget();}});
