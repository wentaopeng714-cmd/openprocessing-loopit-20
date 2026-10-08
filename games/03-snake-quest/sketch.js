/* Original: MySnake — jarrn
Source: https://openprocessing.org/@u84142/3021406
License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
Adapted on 2026-10-08; see CHANGES.diff and README.md. */
class Tupel {
	constructor(i, j) {
		this.i = i;
		this.j = j;
	}

	toString() {
		return `(${this.i}, ${this.j})`;
	}

	copy() {
		return new Tupel(this.i, this.j);
	}

	add(other) {
		this.i += other.i;
		this.j += other.j;
	}

	eq(other) {
		if (other instanceof Tupel)
			return this.i == other.i && this.j == other.j;
		return false
	}

	find_in(list) {
		for(let n = 0; n < list.length; n++) {
			if (this.eq(list[n]))
				return n;
		}
		return -1;
	}
}

FOOD_COLORS = null

class Food extends Tupel {
	constructor(i, j, grid, max_type) {
		super(i, j);
		this.grid = grid;
		this.type = min(floor(random(max_type) + 1), 5);
		if (!FOOD_COLORS) {
			FOOD_COLORS = [
				color(130, 140, 40), // SNAKE_BODY
				color(200, 0, 0), // APPLE
				color(140, 30, 75), // CHERRIES
				color(200, 100, 0),// APPLES
				color(0, 200, 75),// GRAPES
				color(200, 200, 0) // BANANA
			];
		}
	}

	draw_banana(x, y) {
		stroke(150, 150, 0);
		strokeWeight(2);
		fill(200, 200, 0);
		beginShape();
		vertex(
			x + 0.1*this.grid.size,
			y + 0.1*this.grid.size);
		vertex(
			x + 0.15*this.grid.size,
			y + 0.5*this.grid.size);		
		vertex(
			x + 0.3*this.grid.size,
			y + 0.7*this.grid.size);		
		vertex(
			x + 0.5*this.grid.size,
			y + 0.85*this.grid.size);		
		vertex(
			x + 0.9*this.grid.size,
			y + 0.9*this.grid.size);
		endShape(CLOSE);
	}
	
	draw_grapes(x, y) {
		stroke(0, 150, 55);
		strokeWeight(1);
		fill(0, 200, 75);
		circle(
			x + 0.5*this.grid.size,
			y + 0.85*this.grid.size,
			0.3 * this.grid.size
		);
		fill(10, 200, 50);
		circle(
			x + 0.4*this.grid.size,
			y + 0.65*this.grid.size,
			0.3 * this.grid.size
		);
		fill(10, 180, 75);
		circle(
			x + 0.6*this.grid.size,
			y + 0.65*this.grid.size,
			0.3 * this.grid.size
		);
		fill(0, 190, 95);
		circle(
			x + 0.3*this.grid.size,
			y + 0.45*this.grid.size,
			0.3 * this.grid.size
		);		
		fill(0, 200, 55);
		circle(
			x + 0.7*this.grid.size,
			y + 0.45*this.grid.size,
			0.3 * this.grid.size
		);		
		fill(10, 210, 55);
		circle(
			x + 0.5*this.grid.size,
			y + 0.45*this.grid.size,
			0.3 * this.grid.size
		);		
		fill(0, 190, 95);
		circle(
			x + 0.2*this.grid.size,
			y + 0.25*this.grid.size,
			0.3 * this.grid.size
		);		
		fill(10, 200, 80);
		circle(
			x + 0.8*this.grid.size,
			y + 0.25*this.grid.size,
			0.3 * this.grid.size
		);		
		fill(0, 190, 95);
		circle(
			x + 0.4*this.grid.size,
			y + 0.25*this.grid.size,
			0.3 * this.grid.size
		);		
		fill(10, 200, 75);
		circle(
			x + 0.6*this.grid.size,
			y + 0.25*this.grid.size,
			0.3 * this.grid.size
		);		
	}
	
	draw_apples(x, y) {
		stroke(150, 0, 0);
		strokeWeight(2);
		fill(200, 0, 0);
		circle(
			x + 0.35 * this.grid.size,
			y + this.grid.size/2,
			0.65 * this.grid.size
		);
		stroke(150, 75, 0);
		fill(200, 100, 0);
		circle(
			x + 0.65 * this.grid.size,
			y + this.grid.size/2,
			0.7 * this.grid.size
		);		
	}
	
	draw_cherries(x, y) {
		stroke(120, 20, 55);
		strokeWeight(1.5);
		fill(140, 30, 75);
		circle(
			x + this.grid.size/4,
			y + this.grid.size/2,
			0.5 * this.grid.size
		);
		circle(
			x + this.grid.size/2,
			y + 3*this.grid.size/4,
			0.5 * this.grid.size
		);
	}
	
	draw_apple(x, y) {
		stroke(150, 0, 0);
		strokeWeight(2);
		fill(200, 0, 0);
		circle(
			x + this.grid.size/2,
			y + this.grid.size/2,
			0.7 * this.grid.size
		);
	}
	
	draw() {
		let x = this.grid.x0 + this.i*this.grid.size;
		let y = this.grid.y0 + this.j*this.grid.size;

		
		switch(this.type) {
			default:	
			case 1:
				this.draw_apple(x, y);
				break;
			case 2:
				this.draw_cherries(x, y);
				break;
			case 3:
				this.draw_apples(x, y);
				break;
			case 4:
				this.draw_grapes(x, y);
				break;
			case 5:
				this.draw_banana(x, y);
				break;				
		}
	}	
}

COLOR_SNAKE_BODY = null;
COLOR_SNAKE_HEAD = null;
COLOR_SNAKE_STROKE = null;

DIRS = null

class Snake {
	constructor(grid) {
		if(!COLOR_SNAKE_BODY)
			COLOR_SNAKE_BODY = color(130, 140, 40);
		if(!COLOR_SNAKE_HEAD)
			COLOR_SNAKE_HEAD = color(170, 180, 20);
		if(!COLOR_SNAKE_STROKE)
			COLOR_SNAKE_STROKE = color(70, 160, 6);
		if (!DIRS) {
			DIRS = [];
			DIRS['left'] = new Tupel(-1, 0);
			DIRS['right'] = new Tupel(1, 0);
			DIRS['up'] = new Tupel(0, -1);
			DIRS['down'] = new Tupel(0, 1);
		}
		this.grid = grid;
		this.dir = 'right';
		this.head = new Tupel(floor(grid.w / 2), floor(grid.h / 2));
		// elements at the front of this array are at the front of the snake
		this.body = [this.head.copy()];
		this.body[0].add(DIRS['left']);
		this.colors = [COLOR_SNAKE_BODY]
		this.speed = 30;
		this.time = 0;
		this.commands = [];
		this.food_eaten = [];
		this.size = 1 + this.body.length;
	}

	draw_head() {
		noStroke();
		switch(this.dir) {
			case 'up':
				fill(150, 50, 0);
				beginShape();
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.5*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size - 0.05*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.3*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.2*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.7*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.2*this.grid.size
				);
				endShape(CLOSE);
				break;	
		}
		stroke(COLOR_SNAKE_STROKE);
		strokeWeight(2);
		fill(COLOR_SNAKE_HEAD);
		circle(
			this.grid.x0 + this.head.i*this.grid.size + this.grid.size/2,
			this.grid.y0 + this.head.j*this.grid.size + this.grid.size/2,
			0.8 * this.grid.size
		);
		noStroke();
		switch(this.dir) {
			case 'right':
				fill(255);
				ellipse(
					this.grid.x0 + this.head.i*this.grid.size + 0.7*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.3*this.grid.size,
					0.3 * this.grid.size,
					0.15 * this.grid.size,
				)
				fill(0, 30, 100);
				circle(
					this.grid.x0 + this.head.i*this.grid.size + 0.7*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.3*this.grid.size,
					0.15 * this.grid.size
				)
				fill(150, 50, 0);
				beginShape();
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.75*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.55*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.75*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.75*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.95*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.65*this.grid.size
				);
				endShape(CLOSE);
				break;
			case 'left':
				fill(255);
				ellipse(
					this.grid.x0 + this.head.i*this.grid.size + 0.3*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.3*this.grid.size,
					0.3 * this.grid.size,
					0.15 * this.grid.size,
				)
				fill(0, 30, 100);
				circle(
					this.grid.x0 + this.head.i*this.grid.size + 0.3*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.3*this.grid.size,
					0.15 * this.grid.size
				)
				fill(150, 50, 0);
				beginShape();
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.25*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.55*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.25*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.75*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.05*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.65*this.grid.size
				);
				endShape(CLOSE);
				break;	
			case 'down':
				fill(255);
				ellipse(
					this.grid.x0 + this.head.i*this.grid.size + 0.3*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.4*this.grid.size,
					0.3 * this.grid.size,
					0.15 * this.grid.size,
				)
				ellipse(
					this.grid.x0 + this.head.i*this.grid.size + 0.7*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.4*this.grid.size,
					0.3 * this.grid.size,
					0.15 * this.grid.size,
				)
				fill(0, 30, 100);
				circle(
					this.grid.x0 + this.head.i*this.grid.size + 0.3*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.4*this.grid.size,
					0.15 * this.grid.size
				)
				circle(
					this.grid.x0 + this.head.i*this.grid.size + 0.7*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.4*this.grid.size,
					0.15 * this.grid.size
				)
				fill(150, 50, 0);
				beginShape();
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.3*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.65*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.7*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.65*this.grid.size
				);
				vertex(
					this.grid.x0 + this.head.i*this.grid.size + 0.5*this.grid.size,
					this.grid.y0 + this.head.j*this.grid.size + 0.85*this.grid.size
				);
				endShape(CLOSE);
				break;					
		}
	}

	draw_tail() {
		let last = null;
		stroke(COLOR_SNAKE_STROKE);
		strokeWeight(2);
		for (let n = this.body.length-1; n >= 0; n--) {
			fill(COLOR_SNAKE_BODY);
			if (last)
				circle(
					this.grid.x0 + (this.body[n].i+last.i)*this.grid.size/2 + this.grid.size/2,
					this.grid.y0 + (this.body[n].j+last.j)*this.grid.size/2 + this.grid.size/2,
					0.6 * this.grid.size
				);
			fill(this.colors[n]);
			circle(
				this.grid.x0 + this.body[n].i*this.grid.size + this.grid.size/2,
				this.grid.y0 + this.body[n].j*this.grid.size + this.grid.size/2,
				0.8 * this.grid.size
			);
			last = this.body[n];
		}
		fill(COLOR_SNAKE_BODY);
		circle(
			this.grid.x0 + (this.head.i+last.i)*this.grid.size/2 + this.grid.size/2,
			this.grid.y0 + (this.head.j+last.j)*this.grid.size/2 + this.grid.size/2,
			0.6 * this.grid.size
		);
	}
	
	draw() {
		this.draw_tail();
		this.draw_head();
	}

	speedup(amt) {
		this.speed = max(this.speed-amt, 5);
	}

	command(cmd) {
		let last = (this.commands.length == 0) ? this.dir : this.commands[this.commands.length - 1];
		if ((cmd == 'up' && last != 'down' && last != 'up') ||
			 (cmd == 'down' && last != 'up' && last != 'down') ||
			 (cmd == 'left' && last != 'right' && last != 'left') ||
			 (cmd == 'right' && last != 'left' && last != 'right'))
			this.commands.push(cmd);
	}

	collides() {
		if (this.head.i < 0 || this.head.i >= this.grid.w || this.head.j < 0 || this.head.j >= this.grid.h)
			return true;
		if (this.head.find_in(this.body) != -1)
			return true;
		return false;
	}

	move() {
		this.time++;
		if(this.time < this.speed)
			return;
		this.time = 0;

		if(this.commands.length > 0) {
			this.dir = this.commands.shift();
		}

		if(this.food_eaten.length > 0) {
			let food = this.food_eaten.shift();
			let new_color = lerpColor(FOOD_COLORS[food], COLOR_SNAKE_BODY, random(0.6,1));
			this.colors.unshift(new_color);
		} else {
			this.body.pop();
		}
		
		this.body.unshift(this.head.copy());
		this.head.add(DIRS[this.dir]);
	}
}

SIZE = 20;
COLOR_LIGHT = 240;
COLOR_DARK = 210;

class Grid {
	constructor(w, h) {
		this.orig_w = w;
		this.orig_h = h;
		this.running = false;
		this.pause = true;
		this.restart()
	}

	recalc_position() {
		let w_goal = 0.9 * width / (this.w + 1);
		let h_goal = 0.9 * height / (this.h + 2);
		this.size_goal = min(w_goal, h_goal);
		this.x0_goal = width/2 - (this.size_goal * this.w / 2);
		this.y0_goal = height/2 - (this.size_goal * this.h / 2);
				
	}
	
	restart() {
		if (this.running) {
			this.pause = !this.pause;
			return;
		}
		this.w = this.orig_w;
		this.h = this.orig_h;
		this.recalc_position();
		this.size = this.size_goal;
		this.x0 = this.x0_goal;
		this.y0 = this.y0_goal;
		this.level = 1;
		this.snake = new Snake(this);
		this.food = [];
		let food_amount = ceil(sqrt(this.h*this.w) / 5);
		for (let n = 0; n < food_amount; n++) {
			this.spawn_food()
		}
		this.running = true;		
	}

	level_up() {
		this.level ++;
		if (this.w == this.h) {
			this.w *= 2;
			this.x0_goal = width/2 - (this.size * this.w / 2);
		} else {
			this.h *= 2;
			this.y0_goal = height/2 - (this.size * this.h / 2);
		}
		this.recalc_position();
		for(let n = 0; n < 2*this.level - 2; n++)
			this.spawn_food();
		this.snake.speedup(2*this.level);
	}

	spawn_food() {
		let done = false;
		let pos = null;
		let maxfood = floor((this.level - 1) / 2 + 1);
		while(!done) {
			done = true;
			pos = new Food(floor(random(this.w)), floor(random(this.h)), this, maxfood);
			if (pos.eq(this.snake.head))
				done = false;
			if (pos.find_in(this.snake.body) != -1) {
				done = false;
			}
			if (pos.find_in(this.food) != -1) {
				done = false;
			}
		}
		this.food.push(pos);		
	}

	eat() {
		let n = this.snake.head.find_in(this.food)
		if(n == -1)
			return;
		let [food] = this.food.splice(n, 1);
		for (let i = 0; i < food.type; i++)
			this.snake.food_eaten.push(food.type);
		this.snake.size += food.type;
		if(this.snake.size > (this.h)*this.level)
			this.level_up();
		this.spawn_food();
	}

	draw_elem(i, j) {
		rectMode(CORNER);
		let col = ((i + j) % 2) ? COLOR_LIGHT : COLOR_DARK;
		noStroke();
		fill(col);
		rect(this.x0 + i*this.size, this.y0 + j*this.size, this.size, this.size);
	}

	draw_game_over() {
		rectMode(CORNER)
		let col = color(200, 0, 0, 150);
		noStroke();
		fill(col);
		rect(this.x0 - this.size, this.y0 - this.size, (this.w + 2)*this.size, (this.h + 2)*this.size);		
		fill(200, 0, 0);
		stroke(0);
		strokeWeight(3);
		textSize(50);
		textAlign(CENTER, CENTER);
		text("Game Over", width/2, height/2 - 50);
		textSize(20);
		text(`Level: ${this.level}, Total: ${this.snake.size}`, width/2, height/2);
		text("Press ENTER to restart.", width/2, height/2 + 50);		
	}

	draw_pause() {
		rectMode(CORNER)
		let col = color(0, 0, 200, 150);
		noStroke();
		fill(col);
		rect(this.x0 - this.size, this.y0 - this.size, (this.w + 2)*this.size, (this.h + 2)*this.size);		
		fill(150, 150, 230);
		stroke(0);
		strokeWeight(3);
		textSize(50);
		textAlign(CENTER, CENTER);
		text("PAUSE", width/2, height/2 - 50);		
		textSize(20);
		text(`Level: ${this.level}, Total: ${this.snake.size}`, width/2, height/2);
		text("Use WASD to steer.\nPress ENTER to play/pause.", width/2, height/2 + 50);		
	}
	
	draw() {
		if(this.running && !this.pause) {
			if(this.x0 > this.x0_goal)
				this.x0 -= 0.01 * this.size;
			if(this.y0 > this.y0_goal)
				this.y0 -= 0.01 * this.size;
			if(this.size > this.size_goal)
				this.size -= 0.05;

			this.snake.move();
			this.eat();
		}
		if (this.snake.collides()) {
			this.running = false;
		}
		for(let i = 0; i < this.w; i++) {
			for(let j = 0; j < this.h; j++) {
				this.draw_elem(i, j);
			}
		}
		this.snake.draw();
		if (!this.pause)
			for(let f of this.food)
				f.draw();
		if(this.running && !this.pause) {
			fill(255);
			stroke(0);
			strokeWeight(1);
			textSize(this.size);
			textAlign(LEFT, BOTTOM);
			text(`Level: ${this.level}`, this.x0, this.y0);
			textAlign(RIGHT, BOTTOM);
			text(`${this.snake.size}`, this.x0 + this.w*this.size, this.y0);
		} 
		if(!this.running)
			this.draw_game_over();
		if (this.pause)
			this.draw_pause();
	}
}

grid = null;

function setup() {
	createCanvas(windowWidth-20, windowHeight-20);
	grid = new Grid(6, 6);
}

function draw() {
	background(100);
	grid.draw();
}

function keyPressed() {
	switch(key) {
		case 'ArrowUp':
		case 'w':
		case 'W':
			grid.snake.command('up');
			break;
		case 'ArrowDown':
		case 's':
		case 'S':
			grid.snake.command('down');
			break;
		case 'ArrowLeft':
		case 'a':
		case 'A':
			grid.snake.command('left');
			break;
		case 'ArrowRight':
		case 'd':
		case 'D':
			grid.snake.command('right');
			break;
		case 'Enter':
		case ' ':
			grid.restart();
			break;
	}
}

// Interactive additions; original core retained above.

Lab.installP5({start(){grid.pause=false;grid.snake.speed=18;},after(){Lab.score=grid.snake.size-2;if(!grid.running)Lab.end(false,'吃到 '+Lab.score+' 份食物。留意自己的身体！');else if(Lab.score>=10)Lab.end(true,'十份食物收集完成，关卡 '+grid.level+'！');},release(x,y){let p=Lab.downPos;if(!p)return;let dx=x-p.x,dy=y-p.y;if(Math.max(Math.abs(dx),Math.abs(dy))>18)grid.snake.command(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');},actions:[{label:'←',run(){grid.snake.command('left');}},{label:'↑',run(){grid.snake.command('up');}},{label:'↓',run(){grid.snake.command('down');}},{label:'→',run(){grid.snake.command('right');}}]});
