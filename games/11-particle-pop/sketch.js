/* Original: Mouse Pop — maks
Source: https://openprocessing.org/@maksss/3026796
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let particles=[];
let parNum=360;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i=-1;i<parNum;i++){
    particles.push(new particle(random(width),random(height)));
  }
  background(9,18,32);stroke(122,237,205)
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
  background(9,18,32,35);

}

function particle(x,y){
  this.pos=createVector(x,y);
  this.oldMove=createVector(0,0);
  this.rand=random(0.95,1.);

  this.update=function (){
    this.move=createVector(mX-this.pos.x,mY-this.pos.y).normalize().div(7).add(this.oldMove);
    this.oldMove=this.move.div(1.01);
    this.move.add(createVector(random()-0.5,random()-0.5).div(4));
    this.pos.add(this.move);
  }

  this.show=function(){

    strokeWeight(random(6.6,7.));
    point(this.pos.x,this.pos.y);
  }

}

function mousePressed(){
  for (c=particles.length-1;c>0;c--){
    particles[c].oldMove.add(createVector(mX-particles[c].pos.x,mY-particles[c].pos.y).normalize().mult(-80).div(max(1,sqrt(abs(mX-particles[c].pos.x)+abs(mY-particles[c].pos.y)))));
  }
}





// Interactive additions; original core retained above.

Lab.installP5({after(){Lab.collect(particles,p=>p.pos,()=>true,1,12);Lab.drawTarget();},actions:[{label:'聚拢中心',run(){Lab.pointer.x=width/2;Lab.pointer.y=height/2;Lab.pointer.has=true;}}]});
