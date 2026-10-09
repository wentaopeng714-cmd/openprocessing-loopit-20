function Path() {
	
	this.vertices = [];
	
	let count = 6;
	for (let i = 0; i < count; i++) {
		let x = map(i, 0, count, width / 4, width - width / 4);
		let y = random(100, height - 100);
		this.vertices.push(new p5.Vector(x, y))
	}
	
}