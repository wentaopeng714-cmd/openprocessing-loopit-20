var R={x:0,y:0,px:0,py:0,pressed:false,touched:false,held:0,mode:0,palette:0,rate:1,amount:1,sign:1,paused:false,ink:0,init:()=>{},frame:()=>{},down:()=>{},move:()=>{},up:()=>{},action:()=>{}};
// Original tab: circle.js
function Circle(x, y, diam, h) {
  this.pos = new p5.Vector(x, y);
  this.diam = diam;
  this.sizeRate = random(0.25, 1);
  this.hue = h;
}

// Original tab: main.js
/*
Circles nebula

Uses an algorithm to find the intersection points between 2 circles, and
creates a shape from it.

I only converted the algorithm, I'm not smart enough to solve it myself!

Inspired by a sketch from Keith Peters (https://bit101.github.io/lab/dailies/170414.html)

Controls:
  - Move the mouse.
  - Use the on-screen controls to change settings.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

// Public variables
var maxDiam = 400;
var count = 24;

// Private variables
var allCircles = [];
var smoothed = true;
var debug = false;

var bgColor = 0;
var labelColor = 255

var hueSlider;
var hueRangeSlider;
var speedSlider;
var smoothButton;
var invertButton;
var debugButton;
var resetButton;


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  colorMode(HSB, 255);
  
  hueSlider = new SliderLayout("Hue", 0, 255, 160, 0.1, 100, 100);
  
  hueRangeSlider = new SliderLayout("Hue range", 0, 2, 1, 0.1, 100, hueSlider.slider.position().y+70);
  
  speedSlider = new SliderLayout("Speed", 0, 5, 1, 0.5, 100, hueRangeSlider.slider.position().y+70);
  
  smoothButton = createButton("Toggle smooth");
  smoothButton.position(100, speedSlider.slider.position().y+40);
  smoothButton.mousePressed(toggleSmooth);
  
  invertButton = createButton("Invert background");
  invertButton.position(100, smoothButton.position().y+40);
  invertButton.mousePressed(toggleInvert);
  
  debugButton = createButton("Toggle debug");
  debugButton.position(100, invertButton.position().y+40);
  debugButton.mousePressed(toggleDebugDisplay);
  
  resetButton = createButton("Reset");
  resetButton.position(100, debugButton.position().y+40);
  resetButton.mousePressed(reset);
  
  reset();
} 


function draw() {
  background(bgColor);
  
  // Forces first circle to follow the mouse.
  allCircles[0].pos.set(mouseX, mouseY); if(R.pressed)allCircles[0].diam=lerp(allCircles[0].diam,min(width*.8,100+R.held*2),.1);
  
  for (var i = 0; i < allCircles.length; i++) {
    for (var j = 0; j < allCircles.length; j++) {
      // Skips if it's itself.
      if (i == j) {
        continue;
      }
      
      var intersections = getIntersections(allCircles[i], allCircles[j]);
      
      // Display if there's intersections.
      if (intersections[0] != null && intersections[1] != null) {
        noStroke();

        var hueValue = hueSlider.slider.value()+allCircles[i].hue*hueRangeSlider.slider.value();

        // Display the circle.
        var alphaValue1 = map(allCircles[i].diam, 0, maxDiam, 5, 0);
        fill(hueValue, 255, 255, alphaValue1);
        ellipse(allCircles[i].pos.x, allCircles[i].pos.y, allCircles[i].diam, allCircles[i].diam);

        // Create and display a shape with intersection points.
        var alphaValue2 = map(allCircles[i].diam, 0, maxDiam, 100, 0);
        fill(hueValue, 255, 255, alphaValue2);

        beginShape();
        if (smoothed) {
          curveVertex(allCircles[i].pos.x, allCircles[i].pos.y);
          curveVertex(intersections[0].x, intersections[0].y);
          curveVertex(intersections[1].x, intersections[1].y);
        } else {
          vertex(allCircles[i].pos.x, allCircles[i].pos.y);
          vertex(intersections[0].x, intersections[0].y);
          vertex(intersections[1].x, intersections[1].y);
        }
        endShape(CLOSE);
      }
    }
    
    // Display circle outline for debugging.
    if (debug) {
      stroke(labelColor);
      strokeWeight(1);
      noFill();
      ellipse(allCircles[i].pos.x, allCircles[i].pos.y, allCircles[i].diam, allCircles[i].diam);
    }
    
    // Animate its size.
    allCircles[i].diam += allCircles[i].sizeRate*speedSlider.slider.value();
    
    // Reverse size rate if it exceeds its range.
    if (allCircles[i].diam > maxDiam || allCircles[i].diam < 0) {
      allCircles[i].sizeRate *= -1;
    }
  }
  
  // Display sliders.
  hueSlider.display();
  hueRangeSlider.display();
  speedSlider.display();
}


// Toggles background between black and white.
function toggleInvert() {
  labelColor = bgColor;
  bgColor = 255-bgColor;
}


// Checks intersections between 2 circles and returns a list of its collision points.
// Converted from Robert King's answer:
//   http://stackoverflow.com/questions/3349125/circle-circle-intersection-points
function getIntersections(circle1, circle2) {
  var rad1 = circle1.diam*0.5;
  var rad2 = circle2.diam*0.5;
  
  var distance = dist(circle1.pos.x, circle1.pos.y, circle2.pos.x, circle2.pos.y);
  
  // Reduce calculations if they clearly don't collide.
  if (distance > rad1+rad2) {
    return [null, null];
  }
  
  var seg = (rad1*rad1-rad2*rad2+distance*distance)/(2*distance);
  var radical = sqrt(rad1*rad1-seg*seg);
  
  var radicalCenter = new p5.Vector(circle2.pos.x, circle2.pos.y);
  radicalCenter.sub(circle1.pos);
  radicalCenter.mult(seg/distance);
  radicalCenter.add(circle1.pos);
  
  var x3 = radicalCenter.x + radical*(circle2.pos.y-circle1.pos.y)/distance;
  var y3 = radicalCenter.y - radical*(circle2.pos.x-circle1.pos.x)/distance;
  
  var x4 = radicalCenter.x - radical*(circle2.pos.y-circle1.pos.y)/distance;
  var y4 = radicalCenter.y + radical*(circle2.pos.x-circle1.pos.x)/distance;
  
  if (debug) {
    if (! isNaN(x3) || ! isNaN(y3) || ! isNaN(x4) || ! isNaN(y4)) {
      stroke(70, 255, 255);
      strokeWeight(1);
      line(x3, y3, x4, y4);

      strokeWeight(5);
      point(radicalCenter.x, radicalCenter.y);
      
	  stroke(255);
      point(x3, y3);
      point(x4, y4);
    }
  }
  
  if (isNaN(x3) || isNaN(y3)) {
    var int1 = null;
  } else {
  	var int1 = new p5.Vector(x3, y3);
  }
  
  if (isNaN(x4) || isNaN(y4)) {
    var int2 = null;
  } else {
  	var int2 = new p5.Vector(x4, y4);
  }
  
  return [int1, int2];
}


// Re-creates a new collection of circles.
function reset() {
  allCircles = [];
  
  for (var i = 0; i < count; i++) {
    allCircles.push(new Circle(random(width/4, width-width/4), 
                               random(height/4, height-height/4), 
                               random(maxDiam), random(-50, 50)));
  }
}


function toggleDebugDisplay() {
  debug = ! debug;
}


function toggleSmooth() {
  smoothed = ! smoothed;
}

// Original tab: sliderLayout.js
// A slider with labels for its title and value.
function SliderLayout(label, minValue, maxValue, defaultValue, steps, posx, posy) {
  
  this.label = label;
  this.slider = createSlider(minValue, maxValue, defaultValue, steps);
  this.slider.position(posx, posy);
  
  this.display = function() {
    var sliderPos = this.slider.position();
    
    noStroke();
    fill(labelColor);
    textSize(15);
    text(this.label, sliderPos.x, sliderPos.y-10);

    fill(labelColor);
    text(this.slider.value(), sliderPos.x+this.slider.width+10, sliderPos.y+10);
  }
}

// Touch and UI adaptation; original visual algorithm above.
R.init=()=>{maxDiam=min(width*.92,450);reset();[hueSlider,hueRangeSlider,speedSlider].forEach(s=>s.display=()=>{});hueSlider.slider.value(142);};
R.frame=()=>{};
R.down=()=>{};
R.move=()=>{};
R.up=()=>{};
R.action=(a,v)=>{if(a==="facets")toggleSmooth();if(a==="invert")toggleInvert();if(a==="seed")reset();if(a==="hue")hueSlider.slider.value(+v);};


const originalSetup=setup,originalDraw=draw;
setup=function(){pixelDensity(1);const cc=window.createCanvas;window.createCanvas=(w,h,...args)=>cc(windowWidth,windowHeight,...args);originalSetup();window.createCanvas=cc;R.x=width*.5;R.y=height*.48;R.px=R.x;R.py=R.y;R.init();
 const c=document.querySelector('canvas');c.setAttribute('aria-label','Interactive artwork');c.style.touchAction='none';
 document.querySelectorAll('body > input,body > button').forEach(e=>e.hidden=true);
 const sync=e=>{const b=c.getBoundingClientRect();R.x=(e.clientX-b.left)*width/b.width;R.y=(e.clientY-b.top)*height/b.height;mouseX=R.x;mouseY=R.y;pmouseX=R.px;pmouseY=R.py;};
 c.addEventListener('pointerdown',e=>{e.preventDefault();if(R.pointer!=null)return;R.pointer=e.pointerId;c.setPointerCapture?.(e.pointerId);sync(e);R.pressed=true;R.touched=true;R.held=0;R.px=R.x;R.py=R.y;mouseIsPressed=true;R.down();});
 c.addEventListener('pointermove',e=>{if(R.pointer!=null&&e.pointerId!==R.pointer)return;sync(e);R.touched=true;if(R.pressed)R.move();});
 const end=e=>{if(R.pointer!=null&&e.pointerId!==R.pointer)return;R.pressed=false;R.pointer=null;mouseIsPressed=false;R.up();};
 c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);c.addEventListener('lostpointercapture',end);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){R.pressed=false;R.pointer=null;mouseIsPressed=false;R.up();}});
 document.querySelectorAll('button[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='quiet'){document.body.classList.toggle('quiet');b.textContent=document.body.classList.contains('quiet')?'Show UI':'Hide UI';return;}if(a==='pause'){R.paused=!R.paused;b.textContent=R.paused?'Resume':'Pause';return;}R.action(a);if(b.dataset.toggle!==undefined){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');}});
 document.querySelectorAll('input[data-action]').forEach(i=>{i.addEventListener('input',()=>{R.action(i.dataset.action,i.value);const o=i.parentNode.querySelector('output');if(o)o.textContent=i.value;});});
};
draw=function(){if(R.paused)return;if(!R.touched){R.x=width*(.5+.22*Math.sin(frameCount*.013));R.y=height*(.48+.13*Math.cos(frameCount*.019));}mouseX=R.x;mouseY=R.y;pmouseX=R.px;pmouseY=R.py;mouseIsPressed=R.pressed;if(R.pressed)R.held++;R.frame();originalDraw();R.px=R.x;R.py=R.y;};
// Pointer Events own input; prevent p5 synthesised clicks from resetting the artwork.
mousePressed=()=>false;mouseReleased=()=>false;mouseClicked=()=>false;mouseMoved=()=>false;mouseDragged=()=>false;touchStarted=()=>false;touchMoved=()=>false;touchEnded=()=>false;keyPressed=()=>false;
windowResized=function(){const ox=width,oy=height;resizeCanvas(windowWidth,windowHeight);R.x=R.x/ox*width;R.y=R.y/oy*height;R.px=R.x;R.py=R.y;R.resize?.(ox,oy);};

R.resize=(ox,oy)=>{maxDiam=min(width*.92,450);reset();};
