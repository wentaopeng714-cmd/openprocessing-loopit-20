let dragging = false;
let selectedIndex = -1;
let dragabble = [];
let startDragPos;
const DRAG_SIZE = 30;

function addDrag(vec, index) 
{
	if(index === undefined) index = dragabble.length;
	dragabble.splice(index, 0, vec);
}
 
function drawDrag() 
{
	for (let i=0; i < dragabble.length; i++) {
    fill(selectedIndex==i ? 100 : 255);
    circle(dragabble[i].x, dragabble[i].y, DRAG_SIZE) ;
  }
}
 
function dragMousePressed() {
  return findSelected();
}
 
function dragMouseReleased() {
  selectedIndex = -1;
}
 
//bugfix, this function is called more than once
let lastFrameCount;
function dragMouseDragged() {
  if (selectedIndex == -1 || lastFrameCount == frameCount) return;
	lastFrameCount = frameCount;
  dragabble[selectedIndex].add(mouseX - startDragPos.x, mouseY - startDragPos.y, 0);
	startDragPos.x = mouseX;
	startDragPos.y = mouseY;
}

function findSelected() {
	selectedIndex = -1;
	let mX = getMouseX();
	let mY = getMouseY();
	let closest = DRAG_SIZE * DRAG_SIZE;
  for (let i=0; i < dragabble.length; i++) {
 		let distX = dragabble[i].x - mX;
		let distY = dragabble[i].y - mY;
		let distance = distX * distX + distY * distY;
		if(distance < closest){
			closest = distance;
			selectedIndex = i;
			startDragPos = createVector(mouseX, mouseY);
		}
  }
	if(selectedIndex >= 0)
		return true;
	return false;
}

function getMouseX(){
	//return mouseX - width/2;//WEBGL
	return mouseX;//P2D
}

function getMouseY(){
	//return mouseY - height/2;//WEBGL
	return mouseY;//P2D
}

function getPmouseX(){
	//return pmouseX - width/2;//WEBGL
	return pmouseX;//P2D
}

function getPmouseY(){
	//return pmouseY - height/2;//WEBGL
	return pmouseY;//P2D
}