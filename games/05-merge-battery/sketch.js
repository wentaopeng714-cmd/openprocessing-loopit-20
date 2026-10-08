/* Original: Merge Battery! — Memphis
Source: https://openprocessing.org/@memphisq/3013202
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let blobs = [];
let gravity = 0.4;
let score = 10;
let spawnTimer = 0;
let spawnInterval = 30; // every 0.5 seconds
let spawnLevel = 1;
let upgradeCost = 100;
let showMessage = "";    
let messageTimer = 0;   
let milestones = [
  { value: 1e6, name: "Millionaire", triggered: false },
  { value: 1e9, name: "Billionaire", triggered: false },
  { value: 1e12, name: "Trillionaire", triggered: false },
  { value: 1e15, name: "Quadrillionaire", triggered: false },
  { value: 1e18, name: "Quintillionaire", triggered: false },
  { value: 1e21, name: "Sextillionaire", triggered: false },
  { value: 1e24, name: "Septillionaire", triggered: false },
  { value: 1e27, name: "Octillionaire", triggered: false },
  { value: 1e30, name: "Nonillionaire", triggered: false },
  { value: 1e33, name: "Decillionaire", triggered: false },
  { value: 1e36, name: "Undecillionaire", triggered: false },
  { value: 1e39, name: "Duodecillionaire", triggered: false },
  { value: 1e42, name: "Tredecillionaire", triggered: false },
  { value: 1e45, name: "Quattuordecillionaire", triggered: false },
  { value: 1e48, name: "Quindecillionaire", triggered: false },
  { value: 1e51, name: "Sexdecillionaire", triggered: false },
  { value: 1e54, name: "Septendecillionaire", triggered: false },
  { value: 1e57, name: "Octodecillionaire", triggered: false },
  { value: 1e60, name: "Novemdecillionaire", triggered: false },
  { value: 1e63, name: "Vigintillionaire", triggered: false },
  { value: 1e303, name: "Uncentillionaire", triggered: false },
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame();
}

function resetGame() {
  blobs = [];
  score = 0;
  spawnLevel = 1;
  upgradeCost = 25;
  for (let i = 0; i < 10; i++) spawnBlob();
}

function mouseReleased() {
  // Upgrade button click
  if (mouseX > 100 && mouseX < 200 && mouseY > 200 && mouseY < 250) {
    if (score >= upgradeCost) {
      score -= upgradeCost;
      spawnLevel++;
      upgradeCost = Math.ceil(upgradeCost * 1.8);
      // 10% chance message
      if (random(100) < 10) {
        showMessage = "连锁能量已点亮！";
        messageTimer = 180; 
      }
    }
  }
}

function draw() {
  background(30);
  frameRate(60);

  // Smooth income per frame
  let totalIncome = 0;
  for (let b of blobs) totalIncome += pow(4, b.level - 1);
  score += totalIncome / 60;

  // Check milestones
  for (let m of milestones) {
    if (!m.triggered && score >= m.value) {
      console.log(m.name + " achieved! 🎉");
      m.triggered = true;
    }
  }

  // Draw score
  fill("white");
  textSize(28);
  textAlign(LEFT, TOP);
  text('$' + floor(score).toLocaleString(), 20, 20);

  // Draw upgrade button
  fill("red");
  rect(100, 200, 100, 50, 10);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Upgrade\n$" + upgradeCost.toLocaleString(), 150, 225);

  // Draw blobs
  for (let b of blobs) b.show();

  // Spawn new blob
  spawnTimer++;
  if (spawnTimer > spawnInterval) {
    spawnBlob();
    spawnTimer = 0;
  }

  // Update blobs and collisions
  handleBlobs();

  // Show Dom message
  if (messageTimer > 0) {
    fill("yellow");
    textSize(48);
    textAlign(CENTER, CENTER);
    text(showMessage, width / 2, height / 2);
    messageTimer--;
  }
}

// ----------------------
// Blob Logic
// ----------------------
function spawnBlob() {
  let b = new Blob(random(width), random(height * 0.1), 30, spawnLevel);
  blobs.push(b);
}

function handleBlobs() {
  for (let b of blobs) b.update();

  // Collisions
  for (let i = blobs.length - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      let b1 = blobs[i];
      let b2 = blobs[j];
      if (!b1 || !b2) continue;
      if (b1.intersects(b2)) {
        if (b1.level === b2.level) {
          b1.level++;
          blobs.splice(j, 1);
          break;
        } else {
          let overlap = (b1.r + b2.r) - p5.Vector.dist(b1.pos, b2.pos);
          let dir = p5.Vector.sub(b1.pos, b2.pos).normalize();
          let totalMass = b1.mass() + b2.mass();
          b1.pos.add(dir.copy().mult(overlap * (b2.mass() / totalMass)));
          b2.pos.sub(dir.copy().mult(overlap * (b1.mass() / totalMass)));
          b1.vel.mult(0.9);
          b2.vel.mult(0.9);
        }
      }
    }
  }
}

// ----------------------
// Blob Class
// ----------------------
class Blob {
  constructor(x, y, r, level) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 0));
    this.r = r;
    this.level = level;
  }

  mass() { return this.level * this.level; }

  update() {
    this.vel.y += gravity * this.level * 0.3;
    this.pos.add(this.vel);
    if (this.pos.y + this.r > height) {
      this.pos.y = height - this.r;
      this.vel.y *= -0.2 / this.level;
      if (abs(this.vel.y) < 0.2) this.vel.y = 0;
    }
    if (this.pos.x - this.r < 0 || this.pos.x + this.r > width) {
      this.vel.x *= -0.8;
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    }
  }

  intersects(other) {
    let d = p5.Vector.dist(this.pos, other.pos);
    return d < (this.r + other.r);
  }

  show() {
    let c1 = color("red");
    let c2 = color("lime");
    let col = lerpColor(c1, c2, this.level / 100);
    noStroke();
    fill(col);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.r * 0.9);
    text(this.level, this.pos.x, this.pos.y);
  }
}


// Interactive additions; original core retained above.

let lastDrop=-1,merges=0;const nativeHandle=handleBlobs;
handleBlobs=function(){let n=blobs.length;nativeHandle();if(blobs.length<n){merges+=n-blobs.length;Lab.toast('合并成功 ×'+merges);}};
Lab.installP5({start(){blobs=[];merges=0;spawnTimer=0;spawnInterval=100000000;score=0;},tap(x,y){if(y>290&&Lab.elapsed-lastDrop>.35&&blobs.length<55){blobs.push(new Blob(constrain(x,30,width-30),Math.min(y,350),30,spawnLevel));lastDrop=Lab.elapsed;}},release(x,y){if(x>100&&x<200&&y>200&&y<250)Lab.source.released?.();},after(){Lab.score=merges*10;if(Lab.score>=100)Lab.end(true,'完成了 10 次合并！');},actions:[{label:'投放电池',run(){if(Lab.elapsed-lastDrop>.35&&blobs.length<55){blobs.push(new Blob(Lab.pointer.x,320,30,spawnLevel));lastDrop=Lab.elapsed;}}}]});
