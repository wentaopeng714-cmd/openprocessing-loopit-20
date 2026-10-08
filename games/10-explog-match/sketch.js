/* Original: ExpLog Match — Kyla H
Source: https://openprocessing.org/@KylaDoesMath3375/3012059
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */

// --- Game Configuration & Constants ---
const ROWS = 12;
const COLS = 12;
const CELL_SIZE = 40;
const BOARD_WIDTH = COLS * CELL_SIZE;
const BOARD_HEIGHT = ROWS * CELL_SIZE;

// L-Piece configurations relative to a center point.
// Defined by offsets: [Block 1, Block 2, Block 3]
const L_PIECE_OFFSETS = [
  [[0, 0], [0, 1], [1, 1]],   // IRO 0
  [[0, 0], [1, 0], [1, -1]],  // IRO 1
  [[0, 0], [0, -1], [-1, -1]],// IRO 2
  [[0, 0], [-1, 0], [-1, 1]]   // IRO 3
];

// --- Game State Variables ---
let board = [];
let score = 0;
let level = 1;
let currentPiece = null;
let gameOver = false;
let gameWon = false;

// Number pool management
let spawnPool = [2, 3, 4, 8, 9, 16, 27];
let clearedCounts = {}; 

// Gravity & Timing System
let lastFallTime = 0;
let isChainReactionActive = false;
let chainCount = 0;
let state = "PLAYING"; // "PLAYING", "ANIMATING_MATCH", "GAME_OVER"
let matchAnimationTimer = 0;
let blocksToClear = []; 

function setup() {
  createCanvas(BOARD_WIDTH + 240, BOARD_HEIGHT + 40);
  initBoard();
  spawnPool.forEach(n => clearedCounts[n] = 0);
  spawnNewPiece();
  lastFallTime = millis();
}

function draw() {
  background(30);
  
  // Center grid layout
  push();
  translate(20, 20);
  
  updateGameLogic();
  
  drawGrid();
  drawBoardBlocks();
  if (state === "PLAYING" && currentPiece) {
    drawCurrentPiece();
  }
  
  drawWarnings();
  pop();
  
  drawSidebar();
}

// --- Initialization & Mechanics ---
function initBoard() {
  board = [];
  for (let r = 0; r < ROWS; r++) {
    board[r] = new Array(COLS).fill(null);
  }
}

function spawnNewPiece() {
  let iro = floor(random(0, 4));
  let blockValues = [
    random(spawnPool),
    random(spawnPool),
    random(spawnPool)
  ];
  
  // Pieces start at the top middle
  currentPiece = {
    row: 0,
    col: 5,
    iro: iro,
    values: blockValues
  };
  
  // Check immediate Top Out collision
  if (checkCollision(currentPiece.row, currentPiece.col, currentPiece.iro)) {
    gameOver = true;
    state = "GAME_OVER";
  }
}

// Get the current gravity delay in milliseconds based on level
function getGravityDelay() {
  // Logarithmic progression: earlier levels scale fast, later levels plateau.
  // Level 1 ~ 1000ms. Level 243 ~ 50ms.
  let baseDelay = 1000;
  let factor = Math.log(level) / Math.log(243); 
  return max(50, baseDelay - factor * 950);
}

function countTotalBlocks() {
  let count = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null) count++;
    }
  }
  return count;
}

// --- Game Logic Update Loop ---
function updateGameLogic() {
  if (gameOver || gameWon) return;

  if (state === "ANIMATING_MATCH") {
    if (millis() - matchAnimationTimer > 400) {
      // Clear matched blocks
      blocksToClear.forEach(b => {
        if (board[b.r][b.c]) {
          clearedCounts[board[b.r][b.c]]++;
          checkLevelUp(board[b.r][b.c]);
          board[b.r][b.c] = null;
        }
      });
      
      // Calculate scores: exponential rewards based on combo chains
      score += blocksToClear.length * 100 * Math.pow(2, chainCount);
      blocksToClear = [];
      
      applyBoardGravity();
      
      // Look for next chain reaction match
      let matches = findMatches();
      if (matches.length > 0) {
        chainCount++;
        blocksToClear = matches;
        state = "ANIMATING_MATCH";
        matchAnimationTimer = millis();
      } else {
        // Chain ends, resume spawning
        chainCount = 0;
        isChainReactionActive = false;
        state = "PLAYING";
        
        // Post-gravity top out verification (middle columns 6 and 7, index 5 and 6)
        if (board[0][5] !== null || board[0][6] !== null) {
          gameOver = true;
          state = "GAME_OVER";
        } else {
          spawnNewPiece();
        }
      }
    }
    return;
  }

  // Regular piece downward step
  if (millis() - lastFallTime > getGravityDelay()) {
    movePieceDown();
    lastFallTime = millis();
  }
}

function movePieceDown() {
  if (!currentPiece) return;
  if (!checkCollision(currentPiece.row + 1, currentPiece.col, currentPiece.iro)) {
    currentPiece.row++;
  } else {
    lockPiece();
  }
}

function lockPiece() {
  let offsets = L_PIECE_OFFSETS[currentPiece.iro];
  for (let i = 0; i < 3; i++) {
    let r = currentPiece.row + offsets[i][0];
    let c = currentPiece.col + offsets[i][1];
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      board[r][c] = currentPiece.values[i];
    }
  }
  
  currentPiece = null;
  
  // Check for Top Out triggers on middle columns
  if (board[0][5] !== null || board[0][6] !== null) {
    gameOver = true;
    state = "GAME_OVER";
    return;
  }

  // Scan matching parameters
  let matches = findMatches();
  if (matches.length > 0) {
    chainCount = 0;
    isChainReactionActive = true;
    blocksToClear = matches;
    state = "ANIMATING_MATCH";
    matchAnimationTimer = millis();
  } else {
    spawnNewPiece();
  }
}

function applyBoardGravity() {
  // Let floating blocks collapse downward column-by-column
  for (let c = 0; c < COLS; c++) {
    let availableRow = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] !== null) {
        let val = board[r][c];
        board[r][c] = null;
        board[availableRow][c] = val;
        availableRow--;
      }
    }
  }
}

// --- Progression Systems ---
function checkLevelUp(numberCleared) {
  // Trigger mutation if a targeted block value thresholds 15 clears
  if (clearedCounts[numberCleared] >= 15) {
    clearedCounts[numberCleared] = 0; 
    level++;
    
    if (level >= 243) {
      gameWon = true;
      state = "GAME_OVER";
      return;
    }

    // Generate dynamic scaling parameters
    let nextNum1 = max(spawnPool) + 1;
    while (!isValidSpawnNum(nextNum1)) nextNum1++;
    let nextNum2 = nextNum1 + 1;
    while (!isValidSpawnNum(nextNum2)) nextNum2++;
    
    // Replace targeted value with escalated items inside pool
    spawnPool = spawnPool.filter(n => n !== numberCleared);
    if (!spawnPool.includes(nextNum1)) spawnPool.push(nextNum1);
    if (!spawnPool.includes(nextNum2)) spawnPool.push(nextNum2);
    
    clearedCounts[nextNum1] = 0;
    clearedCounts[nextNum2] = 0;

    // Mutate preexisting board values matching previous baseline
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] === numberCleared) {
          board[r][c] = random([nextNum1, nextNum2]);
        }
      }
    }
  }
}

function isValidSpawnNum(n) {
  if (n <= 1) return false;
  return true;
}

// --- Matrix Collision System ---
function checkCollision(targetRow, targetCol, targetIro) {
  let offsets = L_PIECE_OFFSETS[targetIro];
  for (let i = 0; i < 3; i++) {
    let r = targetRow + offsets[i][0];
    let c = targetCol + offsets[i][1];
    
    if (c < 0 || c >= COLS || r >= ROWS) return true;
    if (r >= 0 && board[r][c] !== null) return true;
  }
  return false;
}

// --- Dynamic Input Handlers ---
function keyPressed() {
  if (state !== "PLAYING" || !currentPiece) return;

  if (keyCode === LEFT_ARROW) {
    if (!checkCollision(currentPiece.row, currentPiece.col - 1, currentPiece.iro)) {
      currentPiece.col--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!checkCollision(currentPiece.row, currentPiece.col + 1, currentPiece.iro)) {
      currentPiece.col++;
    }
  } else if (keyCode === DOWN_ARROW) {
    // Soft drop
    movePieceDown();
    score += 1; 
  } else if (keyCode === UP_ARROW) {
    // Hard drop
    while (!checkCollision(currentPiece.row + 1, currentPiece.col, currentPiece.iro)) {
      currentPiece.row++;
      score += 2;
    }
    lockPiece();
  } else if (key === 'z' || key === 'Z') {
    // Rotate Clockwise
    let nextIro = (currentPiece.iro + 1) % 4;
    if (!checkCollision(currentPiece.row, currentPiece.col, nextIro)) currentPiece.iro = nextIro;
  } else if (key === 'c' || key === 'C') {
    // Rotate Counter-Clockwise
    let nextIro = (currentPiece.iro + 3) % 4;
    if (!checkCollision(currentPiece.row, currentPiece.col, nextIro)) currentPiece.iro = nextIro;
  } else if (key === 'x' || key === 'X') {
    // Rotate 180
    let nextIro = (currentPiece.iro + 2) % 4;
    if (!checkCollision(currentPiece.row, currentPiece.col, nextIro)) currentPiece.iro = nextIro;
  }
}

// --- Math Match Verification Engine ---
function findMatches() {
  let marked = new Set();
  let directions = [
    {dr: 0, dc: 1},  // Horizontal
    {dr: 1, dc: 0},  // Vertical
    {dr: 1, dc: 1},  // Diagonal Down-Right
    {dr: 1, dc: -1}  // Diagonal Down-Left
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === null) continue;

      directions.forEach(d => {
        let r1 = r + d.dr, c1 = c + d.dc;
        let r2 = r + d.dr * 2, c2 = c + d.dc * 2;

        if (r2 >= 0 && r2 < ROWS && c2 >= 0 && c2 < COLS) {
          let v1 = board[r][c];
          let v2 = board[r1][c1];
          let v3 = board[r2][c2];

          if (v2 !== null && v3 !== null) {
            if (verifyExpLogRelationship(v1, v2, v3)) {
              marked.add(`${r},${c}`);
              marked.add(`${r1},${c1}`);
              marked.add(`${r2},${c2}`);
            }
          }
        }
      });
    }
  }

  let matchArray = [];
  marked.forEach(coords => {
    let [r, c] = coords.split(',').map(Number);
    matchArray.push({r: r, c: c});
  });
  return matchArray;
}

function verifyExpLogRelationship(n1, n2, n3) {
  // Check Exponent permutations: [Exponent, Base, Power] or [Base, Power, Exponent]
  if (checkExp(n1, n2, n3) || checkExp(n3, n2, n1) || checkExp(n2, n1, n3) || checkExp(n2, n3, n1)) return true;
  
  // Check Logarithmic permutations: [Base, Arg, Log] or [Log, Base, Arg]
  if (checkLog(n1, n2, n3) || checkLog(n2, n1, n3) || checkLog(n3, n2, n1) || checkLog(n2, n3, n1)) return true;

  return false;
}

function checkExp(base, power, result) {
  if (base === 0 && power === 0) return false; 
  return Math.abs(Math.pow(base, power) - result) < 0.0001;
}

function checkLog(base, arg, logVal) {
  if (base <= 0 || base === 1 || arg <= 0) return false;
  return Math.abs(Math.pow(base, logVal) - arg) < 0.0001;
}

// --- Graphical Rendering Components ---
function drawGrid() {
  stroke(60);
  strokeWeight(1);
  for (let r = 0; r <= ROWS; r++) {
    line(0, r * CELL_SIZE, BOARD_WIDTH, r * CELL_SIZE);
  }
  for (let c = 0; c <= COLS; c++) {
    if (c === 5 || c === 6 || c === 7) {
      stroke(90, 40, 40);
    } else {
      stroke(60);
    }
    line(c * CELL_SIZE, 0, c * CELL_SIZE, BOARD_HEIGHT);
  }
}

function drawBlock(r, c, val, isAnimating = false) {
  push();
  translate(c * CELL_SIZE, r * CELL_SIZE);
  
  fill(52, 152, 219, isAnimating ? 150 : 255);
  stroke(41, 128, 185);
  strokeWeight(2);
  rect(2, 2, CELL_SIZE - 4, CELL_SIZE - 4, 6);
  
  textAlign(CENTER, CENTER);
  noStroke();
  fill(255);
  textSize(val > 99 ? 12 : 16);
  text(val, CELL_SIZE / 2, CELL_SIZE / 2);
  pop();
}

function drawBoardBlocks() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null) {
        let isAnimating = blocksToClear.some(b => b.r === r && b.c === c);
        drawBlock(r, c, board[r][c], isAnimating);
      }
    }
  }
}

function drawCurrentPiece() {
  let offsets = L_PIECE_OFFSETS[currentPiece.iro];
  for (let i = 0; i < 3; i++) {
    let r = currentPiece.row + offsets[i][0];
    let c = currentPiece.col + offsets[i][1];
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      drawBlock(r, c, currentPiece.values[i], false);
    }
  }
}

function drawWarnings() {
  if (countTotalBlocks() >= 100) {
    noFill();
    stroke(231, 76, 60, 150 + sin(frameCount * 0.1) * 100);
    strokeWeight(4);
    rect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
  }
}

function drawSidebar() {
  push();
  translate(BOARD_WIDTH + 40, 40);
  
  textAlign(LEFT, TOP);
  fill(241, 196, 15);
  textSize(24);
  text("ExpLog Match", 0, 0);
  
  fill(255);
  textSize(16);
  text(`Score: ${score}`, 0, 40);
  text(`Level: ${level} / 243`, 0, 65);
  text(`Blocks on Board: ${countTotalBlocks()}`, 0, 90);
  
  if (chainCount > 0) {
    fill(46, 204, 113);
    text(`Combo Chain: x${chainCount}`, 0, 120);
  }
  
  fill(200);
  textSize(14);
  text("Active Spawn Pool:", 0, 160);
  let poolStr = spawnPool.join(", ");
  textSize(12);
  fill(140, 200, 255);
  text(poolStr, 0, 185, 180, 50);

  if (countTotalBlocks() >= 100) {
    fill(231, 76, 60);
    textSize(14);
    text("⚠️ DANGER: 100+ BLOCKS!", 0, 240);
  }
  
  fill(180);
  textSize(12);
  let ctrlY = 280;
  text("CONTROLS:", 0, ctrlY);
  text("Left/Right Arrow: Move", 0, ctrlY + 20);
  text("Down Arrow: Soft Drop", 0, ctrlY + 40);
  text("Up Arrow: Hard Drop", 0, ctrlY + 60);
  text("Z / C: Rotate L/R", 0, ctrlY + 80);
  text("X: Rotate 180°", 0, ctrlY + 100);

  if (state === "GAME_OVER") {
    fill(0, 0, 0, 200);
    rect(-BOARD_WIDTH - 20, -20, width, height);
    
    textAlign(CENTER, CENTER);
    textSize(28);
    if (gameWon) {
      fill(46, 204, 113);
      text("VICTORY!", -100, BOARD_HEIGHT / 2 - 20);
    } else {
      fill(231, 76, 60);
      text("GAME OVER (Top Out)", -100, BOARD_HEIGHT / 2 - 20);
    }
    fill(255);
    textSize(20);
    text(`Final Score: ${score}`, -100, BOARD_HEIGHT / 2 + 20);
  }
  pop();
}


// Interactive additions; original core retained above.

function pieceAction(type){if(state!=='PLAYING'||!currentPiece)return;if(type==='left'||type==='right'){let d=type==='left'?-1:1;if(!checkCollision(currentPiece.row,currentPiece.col+d,currentPiece.iro))currentPiece.col+=d;}else if(type==='rotate'){let r=(currentPiece.iro+1)%4;if(!checkCollision(currentPiece.row,currentPiece.col,r))currentPiece.iro=r;}else{while(currentPiece&&!checkCollision(currentPiece.row+1,currentPiece.col,currentPiece.iro)){currentPiece.row++;score+=2;}if(currentPiece)lockPiece();}}
Lab.installP5({after(){Lab.score=score;if(gameOver)Lab.end(false,'棋盘堆满了。用 2、3、8 等指数关系清除方块。');else if(score>=600||gameWon)Lab.end(true);},actions:[{label:'←',run(){pieceAction('left');}},{label:'旋转',run(){pieceAction('rotate');}},{label:'→',run(){pieceAction('right');}},{label:'快速落下',run(){pieceAction('drop');}}]});
