/*
Splash!

When a particle exceeds a certain velocity it splits to new particles to create a water effect.

Controls:
  - Move the mouse over the word.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var word = "SPLASH!";
var font;
var tPoints;

var particles = [];
var velThreshold = 3;
var splitCount = 4;

var h = 115;
var minh = 115;
var maxh = 150;


function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  colorMode(HSB, 255);
  
  // Get positions to assign particles to.
  tPoints = font.textToPoints(word, width/2, height/2, 100, {sampleFactor:0.6});
  
  // Try to find out the text's width to offset it to the scene's center.
  let start = tPoints[0].x;
  let end = tPoints[tPoints.length-1].x;
  let centerX = (start-end)*0.5;
  
  // Create particles.
  for (let i = 0; i < tPoints.length; i++) {
    let j = int(random(tPoints.length));
    particles.push(new Particle(tPoints[j].x+centerX, tPoints[j].y, tPoints[j].x+centerX, tPoints[j].y));
  }
  
  background(0);
}


function draw() {
  background(0, 100);
  
  for (let i = particles.length-1; i > -1; i--) {
    let p = particles[i];
    
    p.move();
    
    if (p.activate) {
    	stroke(p.pColor);
    } else {
      // Turns blue the more it moves.
      stroke(120, p.vel.mag()*50, 255);
    }
    
    strokeWeight(p.pSize);
    
    point(p.pos.x, p.pos.y);
    
    // Remove particles that are out of bounds.
    if (p.pos.y > height || p.pos.x < 0 || p.pos.x > width) {
      particles.splice(i, 1);
    }
  }
}