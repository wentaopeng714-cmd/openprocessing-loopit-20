/*
Sea creatures

A creature consists of dynamic ropes that iterate around to form itself.
Each rope has gravity pulling from the angle it was built in to maintain its shape.
As the root of it moves around, the dynamics react.

Controls:
  - Use the on-screen controls to change the sim.
  - Move the mouse to interact with them.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var creatures = [];
var ropes = [];
var collisionSize;
var debugMode = false;

var gravitySlider;
var airDragSlider;
var elasticitySlider;
var frizzSlider;
var thicknessSlider;
var collisionSizeSlider;
var debugButton;


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create on-screen controls.
  gravitySlider = new SliderLayout("Gravity", 0.1, 1, 0.5, 0.1, 100, 100);
  airDragSlider = new SliderLayout("Air drag", 0.1, 0.5, 0.2, 0.1, 100, 170);
  elasticitySlider = new SliderLayout("Elasticity", 0.01, 0.2, 0.1, 0.01, 100, 240);
  frizzSlider = new SliderLayout("Frizz", 0, 1, 0.5, 0.05, 100, 310);
  collisionSizeSlider = new SliderLayout("Collision size", 50, 150, 100, 1, 100, 380);
  debugButton = createButton("Toggle debug display");
  debugButton.position(100, collisionSizeSlider.slider.position().y+40);
  debugButton.mousePressed(debugButtonOnClick);
  
  // Create creatures.
  creatures.push(new Creature(width/4, height/4));
  creatures.push(new Creature(width-width/4, height/4));
  creatures.push(new Creature(width/2, height-height/4));
} 


function draw() {
  background(100, 100, 255);
  
  collisionSize = collisionSizeSlider.value();
  
  // Display collision object.
  noStroke();
  fill(0, 50);
  ellipse(mouseX, mouseY, collisionSize*2, collisionSize*2);
  
  var nFreq = 0.05;
  var nSpeed = 50;
  
  for (var c = 0; c < creatures.length; c++) {
    var cre = creatures[c];
    
    // Move creature randomly.
    var nx = noise(cre.fOffset+frameCount*nFreq)*nSpeed-nSpeed*0.5;
    var ny = noise(cre.fOffset+1000+frameCount*nFreq)*nSpeed-nSpeed*0.5;
    
    if (cre.dir.x > 0) {
      cre.pos.x += nx;
    } else {
      cre.pos.x -= nx;
    }
    
    if (cre.dir.y > 0) {
      cre.pos.y += ny;
    } else {
      cre.pos.y -= ny;
    }
    
    // Keep it in-bounds.
    if (cre.pos.x < 0) {
      cre.pos.x = 0;
      cre.dir.x *= -1;
    } else if (cre.pos.x > width) {
      cre.pos.x = width;
      cre.dir.x *= -1;
    }

    if (cre.pos.y < 0) {
      cre.pos.y = 0;
      cre.dir.y *= -1;
    } else if (cre.pos.y > height) {
      cre.pos.y = height;
      cre.dir.y *= -1;
    }

    // React against collision object.
    for (var i = 0; i < cre.ropes.length; i++) {
      for (var j = 0; j < cre.ropes[i].objs.length; j++) {
        var d = dist(mouseX, mouseY, cre.ropes[i].objs[j].pos.x, cre.ropes[i].objs[j].pos.y);

        if (d < collisionSize) {
          // Push ball away from collision object.
          var force = new p5.Vector(cre.ropes[i].objs[j].pos.x, cre.ropes[i].objs[j].pos.y);
          force.sub(mouseX, mouseY);
          force.normalize();
          force.mult(2);
          cre.ropes[i].objs[j].acc.add(force);
        }
      }
      
      p5.Vector.lerp(cre.ropes[i].objs[0].pos, cre.pos, 0.02, cre.ropes[i].objs[0].pos);

      cre.ropes[i].display();
    }
  }
  
  // Display on-screen controls.
  gravitySlider.display();
  airDragSlider.display();
  elasticitySlider.display();
  frizzSlider.display();
  collisionSizeSlider.display();
}


function debugButtonOnClick() {
  debugMode = ! debugMode;
}