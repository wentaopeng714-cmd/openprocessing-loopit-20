/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/2256135

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var SIZE;
var colors = ["#FFC30F", "#581845", "#900C3F", "#C70039", "#FF5733", "#1AC7C4"];
var seed;

function setup() {
	SIZE = min(windowWidth, windowHeight);
	createCanvas(windowWidth, windowHeight);
	initDrag(width/2, height/2);
	
	seed = random() * 10000;
}

function draw() {
	randomSeed(seed);
	background(0);

	noStroke();
	const valX = dragabble.map(d => d.x);
	const valY = dragabble.map(d => d.y);
	const minX = Math.min(...valX);
	const maxX = Math.max(...valX);
	const minY = Math.min(...valY);
	const maxY = Math.max(...valY);
	const centerX = (maxX - minX) / 2 + minX;
	const centerY = (maxY - minY) / 2 + minY;
	randomFill(centerX, centerY);
	
	//createHobbyBezier by @arnoson https://github.com/arnoson/hobby-curve
	var hobbyPoints = createHobbyBezier(dragabble, { tension: 1, cyclic: true });
	beginShape();
	vertex(dragabble[0].x, dragabble[0].y);
	hobbyPoints.forEach(({ startControl, endControl, point }) => {
		bezierVertex(startControl.x, startControl.y, endControl.x, endControl.y, point.x, point.y);
	});
	endShape();
	
	let polygon = createPolygon(dragabble);
  const area = sqrt(pow(polygon.maxX - polygon.minX, 2) + pow(polygon.maxY - polygon.minY, 2));
	//console.log(area);
	for(var i = 1; i <= 3; i++){
		noStroke();
		randomFill(centerX, centerY);
		const vertices = getPaddingVertices(polygon, area / 30);
		hobbyPoints = createHobbyBezier(vertices, { tension: 1, cyclic: true });
		beginShape();
		vertex(vertices[0].x, vertices[0].y);
		hobbyPoints.forEach(({ startControl, endControl, point }) => {
			bezierVertex(startControl.x, startControl.y, endControl.x, endControl.y, point.x, point.y);
		});
		endShape();
		polygon = createPolygon(vertices);
	}
	
	drawingContext.fillStyle = "#FFF";
	stroke(0);
	drawDrag();
}

function randomFill(x, y){
	const ctx = drawingContext;
	const gradient = ctx.createConicGradient(0, x, y);
	const iniColor = random(colors);
	const amount = floor(random(3, 6));
	gradient.addColorStop(0, iniColor);
	for(var i = 0; i < amount; i++){
		gradient.addColorStop(1/(amount+2) * (i+1), random(colors));
	}
	gradient.addColorStop(1, iniColor);

	// Set the fill style and draw a rectangle
	ctx.fillStyle = gradient;
}

function initDrag(x, y){
	dragabble = [];
	const amount = floor(random(3, 15));
	for(var a = 0; a < TWO_PI; a += TWO_PI/amount) {
		const rA =  random(-PI/amount*0.8, PI/amount*0.8);//random angle
		const rR =  random(SIZE * 0.1, SIZE * 0.5);//random radius
		const xx = sin(-a + rA) * rR + x;
		const yy = cos(-a + rA) * rR + y;
		addDrag(createVector(xx, yy));
	}
}
 
function mousePressed() {
  if(!dragMousePressed()){
		// simple solution
		// just create a point at the end of polygon
		//addDrag(createVector(mouseX, mouseY));

		// complex solution
		// look for the closest avarage point between two points
		let closest = 99999;
		let closestIndex = -1;
		for (let i=0; i < dragabble.length; i++) {
			let nextIndex = (i+1)%dragabble.length;

			let avarageX = dragabble[i].x + (dragabble[nextIndex].x - dragabble[i].x) / 2;
			let avarageY = dragabble[i].y + (dragabble[nextIndex].y - dragabble[i].y) / 2;

			let distX = avarageX - mouseX;
			let distY = avarageY - mouseY;
			let distance = distX * distX + distY * distY;
			if(distance < closest){
				closest = distance;
				closestIndex = i;
			}
		}
		if(closestIndex>=0){
			addDrag(createVector(mouseX, mouseY), closestIndex+1);
		}
	}
}
 
function mouseReleased() {
  dragMouseReleased();
}
 
function mouseDragged() {
  dragMouseDragged();
}

function keyPressed(){
	seed = random() * 1000;
	initDrag(width/2, height/2);
}


function createPolygon(vertices)
{
    var polygon = {vertices: vertices};

    var edges = [];
    var minX = (vertices.length > 0) ? vertices[0].x : undefined;
    var minY = (vertices.length > 0) ? vertices[0].y : undefined;
    var maxX = minX;
    var maxY = minY;

    for (var i = 0; i < polygon.vertices.length; i++) {
        var edge = {
            vertex1: vertices[i], 
            vertex2: vertices[(i + 1) % vertices.length], 
            polygon: polygon, 
            index: i
        };
        edge.outwardNormal = outwardEdgeNormal(edge);
        edge.inwardNormal = inwardEdgeNormal(edge);
        edges.push(edge);
        var x = vertices[i].x;
        var y = vertices[i].y;
        minX = Math.min(x, minX);
        minY = Math.min(y, minY);
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);
    }                       
    
    polygon.edges = edges;
    polygon.minX = minX;
    polygon.minY = minY;
    polygon.maxX = maxX;
    polygon.maxY = maxY;

    return polygon;
}

function inwardEdgeNormal(edge)
{
    // Assuming that polygon vertices are in clockwise order
    var dx = edge.vertex2.x - edge.vertex1.x;
    var dy = edge.vertex2.y - edge.vertex1.y;
    var edgeLength = Math.sqrt(dx*dx + dy*dy);
    return {x: -dy/edgeLength, y: dx/edgeLength};
}

function outwardEdgeNormal(edge)
{
    var n = inwardEdgeNormal(edge);
    return {x: -n.x, y: -n.y};
}

function getPaddingVertices(polygon, shapePadding)
{
		var offsetEdges = [];
    for (var i = 0; i < polygon.edges.length; i++) {
        var edge = polygon.edges[i];
        var dx = edge.inwardNormal.x * shapePadding;
        var dy = edge.inwardNormal.y * shapePadding;
        offsetEdges.push(createOffsetEdge(edge, dx, dy));
    }
    var vertices = [];
    for (var i = 0; i < offsetEdges.length; i++) {
        var thisEdge = offsetEdges[i];
        var prevEdge = offsetEdges[(i + offsetEdges.length - 1) % offsetEdges.length];
        var vertex = edgesIntersection(prevEdge, thisEdge);
        if (vertex)
            vertices.push(vertex);
        else {
            //we dont need extra curves in this case
            //var arcCenter = polygon.edges[i].vertex1;
            //appendArc(vertices, arcCenter, shapePadding, prevEdge.vertex2, thisEdge.vertex1, true);
					
					  // Calculate midpoint between the edges
            var midPoint = {
                x: (prevEdge.vertex2.x + thisEdge.vertex1.x) / 2,
                y: (prevEdge.vertex2.y + thisEdge.vertex1.y) / 2
            };
            vertices.push(midPoint);
        }
    }

    return vertices;
}


function createOffsetEdge(edge, dx, dy)
{
    return {
        vertex1: {x: edge.vertex1.x + dx, y: edge.vertex1.y + dy},
        vertex2: {x: edge.vertex2.x + dx, y: edge.vertex2.y + dy}
    };
}

// based on http://local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/, edgeA => "line a", edgeB => "line b"
function edgesIntersection(edgeA, edgeB)
{
    var den = (edgeB.vertex2.y - edgeB.vertex1.y) * (edgeA.vertex2.x - edgeA.vertex1.x) - (edgeB.vertex2.x - edgeB.vertex1.x) * (edgeA.vertex2.y - edgeA.vertex1.y);
    if (den == 0)
        return null;  // lines are parallel or conincident

    var ua = ((edgeB.vertex2.x - edgeB.vertex1.x) * (edgeA.vertex1.y - edgeB.vertex1.y) - (edgeB.vertex2.y - edgeB.vertex1.y) * (edgeA.vertex1.x - edgeB.vertex1.x)) / den;
    var ub = ((edgeA.vertex2.x - edgeA.vertex1.x) * (edgeA.vertex1.y - edgeB.vertex1.y) - (edgeA.vertex2.y - edgeA.vertex1.y) * (edgeA.vertex1.x - edgeB.vertex1.x)) / den;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1)
        return null;

    return {x: edgeA.vertex1.x + ua * (edgeA.vertex2.x - edgeA.vertex1.x),  y: edgeA.vertex1.y + ua * (edgeA.vertex2.y - edgeA.vertex1.y)};
}

function appendArc(vertices, center, radius, startVertex, endVertex, isPaddingBoundary)
{
    const twoPI = Math.PI * 2;
    var startAngle = Math.atan2(startVertex.y - center.y, startVertex.x - center.x);
    var endAngle = Math.atan2(endVertex.y - center.y, endVertex.x - center.x);
    if (startAngle < 0)
        startAngle += twoPI;
    if (endAngle < 0)
        endAngle += twoPI;
    var arcSegmentCount = 5; // An odd number so that one arc vertex will be eactly arcRadius from center.
    var angle = ((startAngle > endAngle) ? (startAngle - endAngle) : (startAngle + twoPI - endAngle));
    var angle5 =  ((isPaddingBoundary) ? -angle : twoPI - angle) / arcSegmentCount;

    vertices.push(startVertex);
    for (var i = 1; i < arcSegmentCount; ++i) {
        var angle = startAngle + angle5 * i;
        var vertex = {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
        };
        vertices.push(vertex);
    }
    vertices.push(endVertex);
}