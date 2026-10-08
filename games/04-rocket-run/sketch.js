/* Original: Rocket Run 3 with More Planets — Sam Ellis
Source: https://openprocessing.org/@sellis/3016946
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let rocketx = 200;
let rockety = 300;
let death = 0;
let ob1x = 300;
let ob1y = -200;
let ob1s = 1;
let ob2x = 150;
let ob2y = -600;
let ob2s = 1;
let speed = 4.5;
let lvl = 1;
let score = 0;
let highscore = 0;
let hb = -1;

function setup() {
	createCanvas(400, 400);
	background(100);
}

function draw() {
	if (death === 0) { if (keyIsDown(65)||keyIsDown(LEFT_ARROW)) rocketx-=speed; if(keyIsDown(68)||keyIsDown(RIGHT_ARROW)) rocketx+=speed; }
	background("black");
	rocket();
	if (ob1s === 0) {
		planet(ob1x,ob1y);
	}
	else {
		asteroid(ob1x, ob1y);
	}
	if (ob2s === 0) {
		planet(ob2x,ob2y);
	}
	else {
		asteroid(ob2x, ob2y);
	}
	fill("white");
	stroke("white");
	textSize(30);
	text(round(score),185,35);
	if (death === 1) {
		text("GAME OVER!",120,175);
		text("HIGHSCORE:",90,215);
		text(highscore,285,215);
	}
	if (rocketx < 10) {
		death = 1;
	}
	if (rocketx > 390) {
		death = 1;
	}
	if (death === 1){
		if (rockety < 450) {
			rockety = rockety + (rockety - 299) / 5;
		}
		
	}
	if (death === 0) {
		ob1y = ob1y + speed;
		ob2y = ob2y + speed;
		score = score + 0.1;
	}
	if (ob1y > 600) {
		ob1y = -200;
		ob1x = random(75,325);
		if (lvl === 2) {
			ob1s = round(random(0,13));
		}
		if (lvl === 3) {
			ob1s = round(random(0,9));
		}
		if (lvl === 4) {
			ob1s = round(random(0,7));
		}
		if (lvl === 5) {
			ob1s = round(random(0,5));
		}
		if (ob1s === 0) {
			if (round(random(0,1)) === 0) {
				ob1x = random(-25,50);
			}
			else {
				ob1x = random(350,425);
			}
		}
	}
	if (ob2y > 600) {
		ob2y = -200;
		ob2x = random(75,325);
		if (lvl === 2) {
			ob2s = round(random(0,13));
		}
		if (lvl === 3) {
			ob2s = round(random(0,9));
		}
		if (lvl === 4) {
			ob2s = round(random(0,7));
		}
		if (lvl === 5) {
			ob2s = round(random(0,5));
		}
		if (ob2s === 0) {
			if (round(random(0,1)) === 0) {
				ob2x = random(-25,50);
			}
			else {
				ob2x = random(350,425);
			}
		}
	}
	if (score > 250) {
		lvl = 2;
	}
	if (score > 500) {
		lvl = 3;
	}
	if (score > 750) {
		lvl = 4;
	}
	if (score > 1000) {
		lvl = 5;
	}
	if (lvl === 2) {
		speed = 5;
	}
	if (lvl === 3) {
		speed = 6;
	}
	if (lvl === 4) {
		speed = 7.5;
	}
	if (lvl === 5) {
		speed = 9;
	}
	if (ob1s === 0) {
		collide(rocketx,rockety,30,37,ob1x,ob1y,325,325);
	}
	else {
		collide(rocketx,rockety,30,37,ob1x,ob1y,115,135);
	}
	if (ob2s === 0) {
		collide(rocketx,rockety,30,37,ob2x,ob2y,325,325);
	}
	else {
		collide(rocketx,rockety,30,37,ob2x,ob2y,115,135);
	}
	if (round(score) > highscore) {
		highscore = round(score)
	}
}

function rocket() {
		if (death === 0) {
		fill("orange");
		stroke("red");
		circle(rocketx, rockety + 7, random(8,10));	
	}
	fill("lightgray");
	noStroke();
	triangle(rocketx,rockety - 30,rocketx - 15,rockety + 5,rocketx + 15,rockety +5);
	fill("darkgray");
	stroke("black");
	triangle(rocketx - 15,rockety + 5,rocketx - 10,rockety - 7,rocketx - 8,rockety +5);
	triangle(rocketx + 15,rockety + 5,rocketx + 10,rockety - 7,rocketx + 8,rockety +5);
	circle(rocketx,rockety - 10, 7);
}

function asteroid(x,y) {
	fill("sienna");
	noStroke();
	circle(x,y,125);
	circle(x - 20,y - 50,50);
	circle(x + 30,y + 40,70);
	fill("saddlebrown");
	circle(x,y,85);
	circle(x - 15,y - 30,40);
	circle(x + 20,y + 25,50);
	fill(120,60,30);
	circle(x,y,60);
}

function planet(x,y) {
	fill("powderblue");
	noStroke();
	circle(x,y,375);
	fill("skyblue");
	circle(x,y,325);
	fill("cornflowerblue");
	circle(x,y,250);
}

function collide(x1,y1,w1,h1,x2,y2,w2,h2) {
	if (hb === 1) {
		stroke("green");
		noFill();
		rect(x1 - 0.5 * w1, y1 - 0.5 * h1, w1, h1);
		rect(x2 - 0.5 * w2, y2 - 0.5 * h2, w2, h2);
	}
	if (x1 + 0.5 * w1 > x2 - 0.5 * w2 && x1 - 0.5 * w1 < x2 + 0.5 * w2 && y1 + 0.5 * h1 > y2 - 0.5 * h2 && y1 - 0.5 * h1 < y2 + 0.5 * h2) {
		death = 1;
	}
}

function keyPressed() {
	if (death === 0) {
		if (key === 'a') {
	   	rocketx = rocketx - speed;
		}
		  if (key === 'd') {
	   	rocketx = rocketx + speed;
		}
	}
	if (key === 'r') {
	   rocketx = 200;
		rockety = 300;
		death = 0;
		ob1x = 300;
		ob1y = -200;
		ob1s = 1;
		ob2x = 150;
		ob2y = -600;
		ob2s = 1;
		speed = 4.5;
		lvl = 1;
		score = 0;
	}
}

// Interactive additions; original core retained above.

let energyOrbs=[],shieldUntil=-1,shieldReady=0;const nativeCollide=collide;
collide=function(...a){if(Lab.elapsed<shieldUntil)return;nativeCollide(...a);};
Lab.installP5({before(){if(Lab.pointer.has&&death===0)rocketx=constrain(Lab.pointer.x,20,width-20);if(frameCount%100===0)energyOrbs.push({x:random(30,370),y:-20});},after(){for(let o of energyOrbs){o.y+=3;push();noFill();stroke('#97f6d0');strokeWeight(3);circle(o.x,o.y,18);pop();if(dist(o.x,o.y,rocketx,rockety)<26){o.y=500;score+=8;Lab.toast('能量 +8');}}energyOrbs=energyOrbs.filter(o=>o.y<440);if(Lab.elapsed<shieldUntil){push();noFill();stroke('#8ffbd0');strokeWeight(3);circle(rocketx,rockety-10,70);pop();}Lab.score=Math.floor(score);if(death===1)Lab.end(false,'坚持了 '+Math.floor(Lab.elapsed)+' 秒，得分 '+Lab.score+'。');else if(Lab.score>=150)Lab.end(true);},actions:[{label:'短时护盾',run(){if(Lab.elapsed<shieldReady){Lab.toast('护盾冷却中');return;}shieldUntil=Lab.elapsed+2;shieldReady=Lab.elapsed+8;Lab.toast('护盾保护 2 秒');}}]});
