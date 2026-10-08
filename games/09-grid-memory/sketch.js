/* Original: 10 by 10 gird — Amer7
Source: https://openprocessing.org/@Numberblocks7amer/3028289
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let size = 50;
let clicked = [];

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background("#111f35");

  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {

      let col = x / size;
      let row = y / size;

      // If this square was clicked, make it blue
      if (clicked[col] && clicked[col][row]) {
        fill(0, 100, 255);
      } else {
        fill("#172940");
      }

      stroke("#405570");
      rect(x, y, size, size);
    }
  }
}

function mousePressed() {
  let col = floor(mouseX / size);
  let row = floor(mouseY / size);

  // Make sure the click is inside the grid
  if (col >= 0 && col < 10 && row >= 0 && row < 10) {
    if (!clicked[col]) {
      clicked[col] = [];
    }

    clicked[col][row] = true;
  }
}


// Interactive additions; original core retained above.

let memoryRound=1,memoryCells=[],showUntil=0,wasShowing=false,mistakes=0;
function newPattern(){clicked=[];memoryCells=[];while(memoryCells.length<3+memoryRound){let n=Math.floor(Math.random()*100);if(!memoryCells.includes(n))memoryCells.push(n);}showUntil=Lab.elapsed+2.5;wasShowing=true;}
function submitPattern(){if(Lab.elapsed<showUntil)return;let chosen=[];for(let c=0;c<10;c++)for(let r=0;r<10;r++)if(clicked[c]?.[r])chosen.push(c*10+r);let ok=chosen.length===memoryCells.length&&chosen.every(n=>memoryCells.includes(n));if(ok){Lab.score+=10;Lab.toast('第 '+memoryRound+' 关完成');memoryRound++;if(memoryRound>5)Lab.end(true,'五关记忆挑战完成！');else newPattern();}else{mistakes++;Lab.toast('还有 '+(3-mistakes)+' 次机会');if(mistakes>=3)Lab.end(false,'选中的格子要与记忆图案完全一致。');else newPattern();}}
Lab.installP5({start(){newPattern();},before(){if(Lab.elapsed<showUntil){clicked=[];for(let n of memoryCells){let c=Math.floor(n/10),r=n%10;if(!clicked[c])clicked[c]=[];clicked[c][r]=true;}}else if(wasShowing){clicked=[];wasShowing=false;Lab.toast('轮到你复现图案');}},tap(x,y){if(Lab.elapsed<showUntil)return;let c=Math.floor(x/size),r=Math.floor(y/size);if(c<0||c>=10||r<0||r>=10)return;if(!clicked[c])clicked[c]=[];clicked[c][r]=!clicked[c][r];},actions:[{label:'提交图案',run:submitPattern}]});
