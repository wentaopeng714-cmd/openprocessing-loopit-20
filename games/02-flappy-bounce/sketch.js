/* Original: Flappy Bird — Amer7
Source: https://openprocessing.org/@Numberblocks7amer/3028298
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let flappyBird;
let pipes = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(500, 600);
  flappyBird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(135, 206, 235);

  // Clouds
  fill(255);
  noStroke();
  ellipse(100, 100, 70, 40);
  ellipse(130, 100, 80, 50);
  ellipse(160, 100, 60, 35);

  // Ground
  fill(100, 200, 70);
  rect(0, height - 50, width, 50);

  if (!gameOver) {
    flappyBird.update();

    if (frameCount % 100 === 0) {
      pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // Pipes still kill you!
      if (pipes[i].hits(flappyBird)) {
        gameOver = true;
      }

      if (
        !pipes[i].counted &&
        pipes[i].x + pipes[i].width < flappyBird.x
      ) {
        pipes[i].counted = true;
        score++;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    // =========================
    // BOUNCE OFF THE GROUND!
    // =========================
    if (flappyBird.y + flappyBird.size / 2 >= height - 50) {
      flappyBird.y = height - 50 - flappyBird.size / 2;

      // Bounce!
      flappyBird.velocity = -10;
    }

    // Ceiling
    if (flappyBird.y - flappyBird.size / 2 <= 0) {
      flappyBird.y = flappyBird.size / 2;
      flappyBird.velocity = 2;
    }
  }

  flappyBird.show();

  // Score
  fill(255);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER);
  textSize(40);
  text(score, width / 2, 55);
  noStroke();

  // Game Over
  if (gameOver) {
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(45);
    text("GAME OVER", width / 2, height / 2);

    textSize(20);
    text("Click or press SPACE", width / 2, height / 2 + 45);
    text("to restart", width / 2, height / 2 + 72);

    noStroke();
  }
}


// ====================
// BIRD
// ====================

class Bird {
  constructor() {
    this.x = 100;
    this.y = height / 2;
    this.velocity = 0;
    this.gravity = 0.5;
    this.jump = -9;
    this.size = 30;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }

  flap() {
    this.velocity = this.jump;
  }

  show() {
    // Body
    fill(255, 220, 0);
    stroke(0);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size, this.size);

    // Eye
    fill(255);
    ellipse(this.x + 8, this.y - 7, 10, 10);

    fill(0);
    ellipse(this.x + 10, this.y - 7, 4, 4);

    // Beak
    fill(255, 120, 0);
    triangle(
      this.x + 13,
      this.y,
      this.x + 28,
      this.y + 6,
      this.x + 13,
      this.y + 10
    );
  }
}


// ====================
// PIPES
// ====================

class Pipe {
  constructor() {
    this.x = width;
    this.width = 70;
    this.speed = 3;

    this.gap = 160;

    this.topHeight = random(
      60,
      height - this.gap - 100
    );

    this.bottomY = this.topHeight + this.gap;

    this.counted = false;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(0, 180, 0);
    stroke(0);
    strokeWeight(2);

    // Top pipe
    rect(
      this.x,
      0,
      this.width,
      this.topHeight
    );

    // Bottom pipe
    rect(
      this.x,
      this.bottomY,
      this.width,
      height - this.bottomY - 50
    );

    // Pipe caps
    rect(
      this.x - 5,
      this.topHeight - 20,
      this.width + 10,
      20
    );

    rect(
      this.x - 5,
      this.bottomY,
      this.width + 10,
      20
    );
  }

  hits(birdObject) {
    let birdLeft = birdObject.x - birdObject.size / 2;
    let birdRight = birdObject.x + birdObject.size / 2;
    let birdTop = birdObject.y - birdObject.size / 2;
    let birdBottom = birdObject.y + birdObject.size / 2;

    let pipeLeft = this.x;
    let pipeRight = this.x + this.width;

    let touchingPipe =
      birdRight > pipeLeft &&
      birdLeft < pipeRight;

    if (!touchingPipe) {
      return false;
    }

    if (birdTop < this.topHeight) {
      return true;
    }

    if (birdBottom > this.bottomY) {
      return true;
    }

    return false;
  }

  offscreen() {
    return this.x + this.width < 0;
  }
}


// ====================
// CONTROLS
// ====================

function keyPressed() {
  if (key === " " || keyCode === UP_ARROW) {
    if (gameOver) {
      restartGame();
    } else {
      flappyBird.flap();
    }
  }
}

function mousePressed() {
  if (gameOver) {
    restartGame();
  } else {
    flappyBird.flap();
  }
}


// ====================
// RESTART
// ====================

function restartGame() {
  flappyBird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
  score = 0;
  gameOver = false;
}

// Interactive additions; original core retained above.

let starsCaught=0;
Lab.installP5({after(){for(let p of pipes){if(!p._tuned){p._tuned=true;p.speed=3+Math.min(score*.15,2);p.gap=Math.max(120,160-score*3);p.bottomY=p.topHeight+p.gap;}let x=p.x+p.width/2,y=p.topHeight+p.gap/2;if(!p.coinGot){push();noStroke();fill('#ffdb62');circle(x,y,15);pop();if(dist(flappyBird.x,flappyBird.y,x,y)<26){p.coinGot=true;starsCaught++;Lab.toast('奖励星 +1 · 共 '+starsCaught+' 颗');}}}Lab.score=score;if(gameOver)Lab.end(false,'穿过 '+score+' 道管道，收集 '+starsCaught+' 颗奖励星。');else if(score>=10)Lab.end(true,'穿过 10 道管道！奖励星 '+starsCaught+' 颗。');}});
