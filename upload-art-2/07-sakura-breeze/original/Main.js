/*
Dynamic tree

An interactive tree that uses dynamics to drive the branches' angles.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/


var maxLevel = 7; // The amount of nested branches it will subdivide to. More is slower!
var branchForce = 0.5; // The branch's resistance against the mouse. A lower value will make it feel sluggish, while a bigger value will make it spring-like.
var rootBranch = null;
var debug = false;


function setup() {
	createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  generateNewTree();
}


function draw() {
  background(255);
	
	push();
		translate(width / 2, height - 20);
		treeIterator(rootBranch, 0, 0, 0);
	pop();
	
	fill(0);
	noStroke();
	
	text(
	"".concat(
		"Click to change to a new tree.\n",
		"Middle-click to toggle debug mode.\n",
		"Move the mouse over the tree to interact with it.\n",
		"\n",
		"Debug mode: ", debug), 
	50, 50);
}


function mousePressed() {
	if (mouseButton == CENTER) {
		debug = !debug;
	} else {
		generateNewTree();
	}
}