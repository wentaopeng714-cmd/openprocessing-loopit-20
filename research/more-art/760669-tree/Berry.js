// A berry's position is always relative to its parent branch.
function Berry() {
	this.hue = random(0, 25);
	this.sat = random(200, 255);
	this.val = random(200, 230);
	this.opacity = random(150, 200);
	this.size = random(3, 8);
	this.offsetX = random(-5, 5);
	this.offsetY = random(-5, 5);
}