/* Vamoss, Organic Trail Tutorial, final page. CC BY-SA 3.0.
 * https://openprocessing.org/@u65884/1036179
 * Copied from the visible final-page Code editor.
 */
const TOTAL=1000;let points=[];
function setup(){
 createCanvas(windowWidth,windowHeight);colorMode(HSL,100);background(100);noStroke();
 for(var i=0;i<TOTAL;i++)points.push({pos:createVector(width/2,height/2),dir:random(TWO_PI),size:random(.5,5),color:{h:random(10,13),s:random(60,100),l:50}});
}
function draw(){
 var time=millis()/1000;
 for(var i=0;i<TOTAL;i++){
  var point=points[i];point.dir+=noise(point.pos.x,point.pos.y,time)-.477;
  var mouseAngle=atan2(mouseY-point.pos.y,mouseX-point.pos.x);point.dir+=(mouseAngle-point.dir)*.05;
  point.size*=.99;
  if(point.size<2){point.size=random(2,5);point.pos.x=mouseX+random(-50,50);point.pos.y=mouseY+random(-50,50)}
  point.pos.x+=cos(point.dir)/(point.size+2.5)*10;point.pos.y+=sin(point.dir)/(point.size+2.5)*10;
  var bri=(noise(point.pos.x/30,point.pos.y/30,time*2+i*.005)-.3)*(140-point.size*20);
  fill(point.color.h,point.color.s,point.color.l+bri);circle(point.pos.x,point.pos.y,point.size);
 }
}
