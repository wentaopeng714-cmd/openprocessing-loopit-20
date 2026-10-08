/* Original: Bi Grid — maks
Source: https://openprocessing.org/@maksss/3003818
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let Step=30;
let Square=true;
let squareLenght;

function setup() {
  if (Square==true){
	  createCanvas(windowWidth, windowHeight);
  }else{
	  squareLenght=min(windowWidth, windowHeight);
	  createCanvas(squareLenght, squareLenght);
  }
  bColor=color(155/5,79/5,150/5);
  background(bColor);
  particles=[];
  for (let i=60; i<width-60; i+=Step){
    if (random()>0.315){
      particles.push(new particle(i,20,'vert'))
    }
  }
  for (let i=60; i<height-60; i+=Step){
    if (random()>0.315){
    particles.push(new particle(20,i,'hor'))
    }
  }
}

function draw() {
  for (let i=0; i<particles.length; i++){
    particles[i].update();
    particles[i].show();

    if (particles[i].finished()==true){
      particles.splice(i,1)
    }
  }
}

function particle(x,y,type){
  this.pos=createVector(x,y);
  this.randWait=random(0,max(height,width));
  if (type=='vert'){
    this.update=function(){
      if (this.randWait>0){
        this.randWait--;
        return;
      }
      let colors=get(this.pos.x,this.pos.y+Step/3);
      if (colors[0]!==red(bColor)){
        this.pos.add(0,Step);
        strokeWeight(Step/2.4);
        return;
      }
      this.pos.add(0,Step/10);
    }

    this.show=function(){
	   if (this.randWait>0){
        this.randWait--;
        return
      }
      stroke(214,2,112,120);
      point(this.pos.x,this.pos.y);
      strokeWeight(Step/2);
    }
  }

  if (type=='hor'){
    this.update=function(){
      if (this.randWait>0){
        this.randWait--;
        return
      }
      let colors=get(this.pos.x+Step/3,this.pos.y);
      if (colors[0]!==red(bColor)){
        this.pos.add(Step,0);
        strokeWeight(Step/2.4);
        return;
      }
      this.pos.add(Step/10,0);
    }

    this.show=function(){
		if (this.randWait>0){
        this.randWait--;
        return
      }
      strokeWeight(Step/2);
      stroke(0,56,168,120);
      point(this.pos.x,this.pos.y);
      
    }
  }

  this.finished=function(){
    if (this.pos.x>width-35 || this.pos.y>height-35){
      return true
    }
    return false
  }
}

function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("BiGrid", "png");
  }
  if (key === "a" || key === "A") {
	 Square=-Square
    setup();
  }
}

// Interactive additions; original core retained above.

let gridMode='vert',lastGridSpawn=-1;
function manualParticle(x,y){let p=new particle(x,y,gridMode);p.randWait=0;p._manual=true;particles.push(p);lastGridSpawn=Lab.elapsed;}
Lab.installP5({start(){particles=[];background(bColor);},tap(x,y){manualParticle(x,y);},before(){if(Lab.pointer.down&&Lab.elapsed-lastGridSpawn>.22)manualParticle(mouseX,mouseY);},after(){Lab.collect(particles,p=>p.pos,p=>p._manual&&!p._hit,10,1);for(let p of particles)if(p._labEpoch)p._hit=true;Lab.drawDomTarget();},actions:[{label:'切换横 / 纵',run(){gridMode=gridMode==='vert'?'hor':'vert';Lab.toast(gridMode==='vert'?'粉色粒子向下':'蓝色粒子向右');}}]});
