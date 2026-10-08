/* Original: Infinite Clicker — Xavier Fonda
Source: https://openprocessing.org/@xman123/3026096
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let clicks = 0;
let clicksPerSecond = 0;
let clicksPerClick = 1;
let upgrades = [];
let ascended = false;

function setup() {
  createCanvas(700, 500);
  generateUpgrades();
}

function draw() {
  background(220);

  // Draw the main circle
  fill(255, 200, 200);
  ellipse(width / 2, height / 2, 100, 100);

  // Draw the current number of clicks
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(clicks.toFixed(0), width / 2, height / 2);

  // Draw upgrade options
  for (let i = 0; i < upgrades.length; i++) {
    let upgrade = upgrades[i];
    fill(200, 255, 200);
    rect(50 + i * 150, height - 50, 100, 40);
    fill(0);
    textSize(12);
    text(upgrade.description, 50 + i * 150 + 50, height - 40);
    text('Cost: ' + upgrade.cost, 50 + i * 150 + 50, height - 25);
  }

  // Draw reroll button
  fill(200, 200, 255);
  rect(width - 100, height - 50, 80, 40);
  fill(0);
  text('Reroll', width - 60, height - 30);

  // Update clicks based on clicks per second
  clicks += clicksPerSecond * deltaTime / 1000;

  // Check for ascension
  if (clicks >= 500000000000009 && !ascended) {
    alert('You have ascended to a new universe to generate more micros, and feed your evil boss, JP Forgan');
    ascended = true;
    clicks = 0;
    clicksPerSecond = 0;

    generateUpgrades(true);
		ascended = false;
  }
}

function mouseClicked() {
  // Check if the main circle was clicked
  if (dist(mouseX, mouseY, width / 2, height / 2) <= 50) {
    clicks += clicksPerClick;
  }

  // Check if an upgrade option was clicked
  for (let i = 0; i < upgrades.length; i++) {
    let upgrade = upgrades[i];
    if (mouseX >= 50 + i * 150 && mouseX <= 150 + i * 150 && mouseY >= height - 50 && mouseY <= height - 10) {
      if (clicks >= upgrade.cost) {
        clicks -= upgrade.cost;
        upgrade.effect();
        generateUpgrades();
        break;
      }
    }
  }

  // Check if the reroll button was clicked
  if (mouseX >= width - 100 && mouseX <= width - 20 && mouseY >= height - 50 && mouseY <= height - 10) {
    generateUpgrades();
  }
}

function generateUpgrades(ascension = false) {
  upgrades = [];
  let numUpgrades = ascension ? 4 : 3;
  for (let i = 0; i < numUpgrades; i++) {
    let type = random(['cps', 'cpc', 'minion']);
    let cost = Math.floor(random([random(8,25), random(30,60), random(70,110)]));
    let effect;
    let description;
    switch (type) {
      case 'cps':
        let cpsBoost = Math.floor(cost / 5);
        effect = () => { clicksPerSecond += cpsBoost; };
        description = `+${cpsBoost} clicks/sec`;
        break;
      case 'cpc':
        let cpcBoost = Math.max(1, Math.floor(cost / 20));
        effect = () => { clicksPerClick += cpcBoost; };
        description = `+${cpcBoost} clicks/click`;
        break;
      case 'minion':
        let minionBoost = Math.max(1, Math.floor(cost / 8));
        effect = () => { clicksPerSecond += minionBoost; };
        description = `Minion: +${minionBoost} clicks/sec`;
        break;
    }
    upgrades.push({ cost, effect, description });
  }
}



// Interactive additions; original core retained above.

let tappedAt=-5,tapCombo=0,totalEnergy=0;const nativeClick=mouseClicked;
mouseClicked=function(){let old=clicks;nativeClick();if(dist(mouseX,mouseY,width/2,height/2)<=50){tapCombo=Lab.elapsed-tappedAt<.65?Math.min(tapCombo+1,8):1;tappedAt=Lab.elapsed;let bonus=tapCombo>2?tapCombo:0;clicks+=bonus;totalEnergy+=Math.max(0,clicks-old);if(tapCombo>2)Lab.toast('连击 ×'+tapCombo+' · 能量 +'+bonus);}};
Lab.installP5({after(){Lab.score=Math.floor(totalEnergy+clicksPerSecond*Lab.elapsed);if(Lab.score>=500)Lab.end(true,'能量工坊达到目标！');},actions:[{label:'点击蓄能',run(){let x=mouseX,y=mouseY;window.mouseX=width/2;window.mouseY=height/2;Lab.source.clicked?.();window.mouseX=x;window.mouseY=y;}}]});
