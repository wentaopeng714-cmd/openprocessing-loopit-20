/*
Facial Rig

Ray character rig by CGTarian Online School (from Maya)

jasonlabbe3d.com
twitter.com/russetPotato
*/

const MODEL_HEIGHT = 40;

var canvas;
var myFont;
var drawEdges = false;
var drawControls = true;
var controls = [];
var blendMeshes = {};

var meshes = {
	normal: null,
	hair: null,
	brows: null,
	eyes: null,
	iris: null,
	pupils: null,

	head_jawUp: null,
	head_jawDown: null,
	head_jawLeft: null,
	head_jawRight: null,

	head_L_mouthCornerUp: null,
	head_L_mouthCornerDown: null,
	head_L_mouthCornerIn: null,
	head_L_mouthCornerOut: null,

	head_R_mouthCornerUp: null,
	head_R_mouthCornerDown: null,
	head_R_mouthCornerIn: null,
	head_R_mouthCornerOut: null,

	head_L_upperLidUp: null,
	head_L_upperLidDown: null,

	head_R_upperLidUp: null,
	head_R_upperLidDown: null,

	head_L_lowerLidUp: null,
	head_L_lowerLidDown: null,

	head_R_lowerLidUp: null,
	head_R_lowerLidDown: null,

	head_L_browUp: null,
	head_L_browDown: null,
	head_L_browIn: null,
	head_L_browOut: null,

	brows_L_browUp: null,
	brows_L_browDown: null,
	brows_L_browIn: null,
	brows_L_browOut: null,

	head_R_browUp: null,
	head_R_browDown: null,
	head_R_browIn: null,
	head_R_browOut: null,

	brows_R_browUp: null,
	brows_R_browDown: null,
	brows_R_browIn: null,
	brows_R_browOut: null,

	head_L_cheeksUp: null,
	head_L_cheeksDown: null,
	head_L_cheeksIn: null,
	head_L_cheeksOut: null,

	head_R_cheeksUp: null,
	head_R_cheeksDown: null,
	head_R_cheeksIn: null,
	head_R_cheeksOut: null,

	head_upperLipsUp: null,
	head_upperLipsDown: null,
	head_upperLipsLeft: null,
	head_upperLipsRight: null,

	head_lowerLipsUp: null,
	head_lowerLipsDown: null,
	head_lowerLipsLeft: null,
	head_lowerLipsRight: null
};

function preload() {
	myFont = loadFont('Roboto-Black.ttf');
	
	// Procedurally load in obj files.
	for (let name in meshes) {
		meshes[name] = loadModel(name + '.obj');
	}
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	
	ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
	
	background(50);
	textFont(myFont);
	
	// Determine which meshes will be blending to targets.
	blendMeshes.normal = new BlendMesh(meshes.normal);
	blendMeshes.brows = new BlendMesh(meshes.brows);
	
	// Create controls that will drive the mesh.
	
	// Jaw control
	controls.push(
		new Control(
			45, 105, 15,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_jawUp, 
					meshes.head_jawDown, 
					meshes.head_jawLeft, 
					meshes.head_jawRight
				)
			]
		));
	
	// L corner mouth control
	controls.push(
		new Control(
			70, 65, 10,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_L_mouthCornerUp, 
					meshes.head_L_mouthCornerDown, 
					meshes.head_L_mouthCornerOut, 
					meshes.head_L_mouthCornerIn)
			]
		));
	
	// R corner mouth control
	controls.push(
		new Control(
			10, 65, 10,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_R_mouthCornerUp, 
					meshes.head_R_mouthCornerDown, 
					meshes.head_R_mouthCornerIn, 
					meshes.head_R_mouthCornerOut
				)
			]
		));
	
	// L upper eyelid control
	controls.push(
		new Control(
			75, -28, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_L_upperLidUp, 
					meshes.head_L_upperLidDown, 
					null, 
					null
				)
			]
		));
	
	// R upper eyelid control
	controls.push(
		new Control(
			0, -28, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_R_upperLidUp, 
					meshes.head_R_upperLidDown, 
					null, 
					null
				)
			]
		));
	
	// L lower eyelid control
	controls.push(
		new Control(
			75, 12, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_L_lowerLidUp, 
					meshes.head_L_lowerLidDown, 
					null, 
					null
				)
			]
		));
	
	// R lower eyelid control
	controls.push(
		new Control(
			0, 12, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_R_lowerLidUp, 
					meshes.head_R_lowerLidDown, 
					null, 
					null
				)
			]
		));
	
	// L brow control
	controls.push(
		new Control(
			75, -50, 10,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_L_browUp, 
					meshes.head_L_browDown, 
					meshes.head_L_browOut, 
					meshes.head_L_browIn
				),
				new TargetGroup(
					blendMeshes.brows, 
					meshes.brows_L_browUp, 
					meshes.brows_L_browDown, 
					meshes.brows_L_browOut, 
					meshes.brows_L_browIn
				)
			]
		));
	
	// R brow control
	controls.push(
		new Control(
			0, -50, 10,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_R_browUp, 
					meshes.head_R_browDown, 
					meshes.head_R_browOut, 
					meshes.head_R_browIn
				),
				new TargetGroup(
					blendMeshes.brows, 
					meshes.brows_R_browUp, 
					meshes.brows_R_browDown, 
					meshes.brows_R_browOut, 
					meshes.brows_R_browIn
				)
			]
		));
	
	// L cheeks control
	controls.push(
		new Control(
			90, 40, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_L_cheeksUp, 
					meshes.head_L_cheeksDown, 
					meshes.head_L_cheeksOut, 
					meshes.head_L_cheeksIn
				)
			]
		));
	
	// R cheeks control
	controls.push(
		new Control(
			-20, 40, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_R_cheeksUp, 
					meshes.head_R_cheeksDown, 
					meshes.head_R_cheeksIn, 
					meshes.head_R_cheeksOut
				)
			]
		));
	
	// Upper lips control
	controls.push(
		new Control(
			45, 55, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_upperLipsUp, 
					meshes.head_upperLipsDown, 
					meshes.head_upperLipsLeft, 
					meshes.head_upperLipsRight
				)
			]
		));
	
	// Lower lips control
	controls.push(
		new Control(
			45, 80, 8,
			[
				new TargetGroup(
					blendMeshes.normal, 
					meshes.head_lowerLipsUp, 
					meshes.head_lowerLipsDown, 
					meshes.head_lowerLipsLeft, 
					meshes.head_lowerLipsRight
				)
			]
		));
}

function draw() {
  background(50);
	
	strokeWeight(1);
	
	if (drawEdges) {
		stroke(25);
	} else {
		noStroke();
	}
	
	lights();
	
	fill(255);
	textAlign(CENTER);
	text(`
	Drag the control points to pose the face
	Press space to toggle edges (slow playback!)
	Press any other key to toggle controls display`, 
			 0, height / 2 - 80);
	
	push();
	translate(0, 50);
	scale(100);
	rotateX(radians(180));
	rotateY(radians(160));
	
	blendMeshToTargets();
	
	for (let blendMesh of Object.values(blendMeshes)) {
		blendMesh.refreshMesh();
	}
	
	displayMeshes();
	pop();
	
	for (let control of controls) {
		control.slideControl();
		if (drawControls) {
			control.display();
		}
	}
}

function displayMeshes() {
	ambientLight(50);
	directionalLight(80, 80, 80, -0.6, 0.55, -1);
	directionalLight(200, 50, 50, 0.2, -0.48, 0.5);
	
	ambientMaterial(180, 125, 110);
  model(blendMeshes.normal.mesh);
	
	ambientMaterial(75, 60, 50);
	model(blendMeshes.brows.mesh);
	model(meshes.hair);
	
	ambientMaterial(255, 255, 255);
	model(meshes.eyes);
	
	ambientMaterial(155, 208, 235);
	model(meshes.iris);
	
	ambientMaterial(0, 0, 0);
	model(meshes.pupils);
}

// Maps the verts to their targets based on the controls' offset.
function blendMeshToTargets() {
	for (let control of controls) {
		control.storeOutputs();
	}
	
	for (let blendMesh of Object.values(blendMeshes)) {
		for (let vertIndex = 0; vertIndex < blendMesh.mesh.vertices.length; vertIndex++) {
			// Reset vert to default pose.
			blendMesh.resetPoint(vertIndex);

			// Add on all deltas to verts.
			for (let control of controls) {
				for (let targetGroup of control.targetGroups) {
					if (blendMesh.mesh == targetGroup.blendMesh.mesh) {
						if (targetGroup.yawTarget != null) {
							targetGroup.blendMesh.addDelta(targetGroup.yawTarget, control.outputs.x, vertIndex);
						}

						if (targetGroup.pitchTarget != null) {
							targetGroup.blendMesh.addDelta(targetGroup.pitchTarget, control.outputs.y, vertIndex);
						}
					}
				}
			}
		}
	}
}

function keyPressed() {
	if (key == ' ') {
		drawEdges = !drawEdges;
	} else {
		drawControls = !drawControls;
	}
}

function mousePressed() {
	// Activate control the mouse is hovering over.
	for (let control of controls) {
		if (control.isHoverOver()) {
			control.active = true;
			break;
		}
	}
}

function mouseReleased() {
	for (let control of controls) {
		control.active = false;
	}
}