/* Original: Attraction Particles — YellowFellow
Source: https://openprocessing.org/@u293491/3022367
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
let num = 160;
let pos = [];
let vel = [];

let framesDown = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	strokeWeight(2);
	textAlign(LEFT, TOP);
	resetParticles();
}

function draw() {
	background(0);
	noStroke();
	fill(255);
	text(round(frameRate()), 10, 10);
	text(num, 10, 25);
	
	for(let i = 0; i < num; i++) {
		pos[i].add(vel[i]);
		pos[i].x = (pos[i].x + width) % width;
		pos[i].y = (pos[i].y + height) % height;
		vel[i].add(createVector(random(-1, 1), random(-1, 1)).mult(0.2));
		vel[i].mult(1.0001);
		stroke((frameCount*3+i/num*255)%55, 255, 255);
		line(pos[i].x, pos[i].y, pos[i].x - vel[i].x * 5, pos[i].y - vel[i].y * 5);
		// circle(pos[i].x, pos[i].y, 5);
		
		if (mouseIsPressed) {
			let baseAttraction = sqrt(framesDown)/10;
			let attraction = baseAttraction / pow(dist(mouseX, mouseY, pos[i].x, pos[i].y), -0.1);
			let attractionVector = createVector(mouseX - pos[i].x, mouseY - pos[i].y).setMag(attraction);
			vel[i].add(attractionVector);
		}
	}
	
	if (mouseIsPressed) {
		framesDown++;
	} else {
		framesDown = 0;
	}
}

function resetParticles() {
	background(0);
	pos = [];
	vel = [];
	for(let i = 0; i < num; i++) {
		pos[i] = createVector(width/2, height/2);
		vel[i] = createVector(random(-1, 1), random(-1, 1));
	}
}

// Interactive additions; original core retained above.

Lab.installP5({before(){for(let v of vel)v.limit(7);},after(){Lab.collect(pos,p=>p,()=>Lab.pointer.down,1,12);Lab.drawTarget();},actions:[{label:'散开粒子',run(){for(let v of vel)v.set(random(-5,5),random(-5,5));Lab.toast('重新散开，用引力收集');}}]});
