// A leaf's position is always relative to its parent branch.
function Leaf() {
	this.hue = random(70, 90);
	this.sat = random(130, 150);
	this.val = random(150, 220);
	this.opacity = random(20, 70);
	this.size = random(10, 60);
	this.offsetX = random(-10, 10);
	this.offsetY = random(-10, 10);
}