/* Code by Vamoss. https://openprocessing.org/sketch/624879
 * CC BY-SA 3.0. Copied from the platform's visible Code editor.
 * The preview/false endpoint returned a different sketch; this is the reviewed original.
 */
var circles = [];
var total = 100;
var img;
function preload(){img=loadImage('profile.jpg')}
function setup(){
 createCanvas(img.width,img.height);background(0);
 for(var i=0;i<total;i++){
  circles[i]={prevPos:{x:width/2,y:height/2},pos:{x:width/2,y:height/2},dir:random()>.5?1:-1,radius:random(3,10),angle:0};
 }
}
function draw(){
 for(var i=0;i<total;i++){
  var circle=circles[i];circle.angle+=1/circle.radius*circle.dir;
  circle.pos.x+=cos(circle.angle)*circle.radius;circle.pos.y+=sin(circle.angle)*circle.radius;
  if(brightness(img.get(round(circle.pos.x),round(circle.pos.y)))>70||circle.pos.x<0||circle.pos.x>width||circle.pos.y<0||circle.pos.y>height){circle.dir*=-1;circle.radius=random(3,10);circle.angle+=PI}
  stroke(img.get(circle.pos.x,circle.pos.y));line(circle.prevPos.x,circle.prevPos.y,circle.pos.x,circle.pos.y);
  circle.prevPos.x=circle.pos.x;circle.prevPos.y=circle.pos.y;
 }
}
