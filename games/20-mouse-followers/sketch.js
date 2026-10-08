/* Original: Mouse Followers — maks
Source: https://openprocessing.org/@maksss/3003719
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

let multMous=1;
let mX=0;
let mY=0;

function draw() {
  mX=mouseX;
  mY=mouseY;
  for (c=particles.length-1;c>0;c--){
    particles[c].update();
    particles[c].show();
  }
  background(9,18,32,35)
}

function particle(x,y){
  this.pos=createVector(x,y);
  this.oldMove=createVector(0,0);
  this.rand=random(0.95,1.);

  this.update=function (){
    this.move=createVector(mX-this.pos.x,mY-this.pos.y).normalize().div(10*multMous).add(this.oldMove);
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
  multMous=-1;
}

function mouseReleased(){
  multMous=1;
}



// Interactive additions; original core retained above.

Lab.installP5({after(){Lab.collect(particles,p=>p.pos,()=>!Lab.pointer.down,1,16);Lab.drawTarget();},actions:[{label:'引导到光圈',run(){Lab.pointer.x=Lab.target.x;Lab.pointer.y=Lab.target.y;Lab.pointer.has=true;Lab.toast('目标已标记，松手引导粒子');}}]});
