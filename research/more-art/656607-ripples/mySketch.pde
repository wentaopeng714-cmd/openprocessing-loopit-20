/*
Mutable ripples

Controls:
	- Move the mouse to rotate the camera.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/


// Global variables.
int cubeSize = 150;
int blockSize = 10;


void setup() {
	// Make a 3d sketch to match the window's dimensions.
	size(window.innerWidth, window.innerHeight, P3D);
	colorMode(HSB, 255);
}


void draw() {
	background(0);
	
	noStroke();
	
	// Center the scene and map the mouse's input to rotate the camera.
	translate(width / 2, height / 2, 200);
	rotateX(radians(map(mouseY, 0, height, 180, -180)));
	rotateY(radians(map(mouseX, 0, width, -180, 180)));
	
	// Translate the center of the ripple effect through the cube.
	let noiseMult = 0.01;
	float nx = noise(frameCount * noiseMult) * cubeSize;
	float ny = noise(1000 + frameCount * noiseMult) * cubeSize;
	float nz = noise(5000 + frameCount * noiseMult) * cubeSize;
	
	// We're building a cube of spheres so we need to loop through all three x, y, and z axes.
	for (int x = 0; x < cubeSize; x+=blockSize) {
		for (int y = 0; y < cubeSize; y+=blockSize) {
			for (int z = 0; z < cubeSize; z+=blockSize) {
				// Define what offset in time each sphere will be in by using their position.
				float mult = dist(x, y, z, nx, ny, nz);
				float offset = (frameCount + mult) * 0.1;
				float wave = sin(offset);
				
				pushMatrix();
				
				// Move the sphere in place.
				translate(x - cubeSize / 2, y - cubeSize / 2, z - cubeSize / 2);
				scale(wave);
				
				// Use its wave value to determine its brightness.
				fill(frameCount % 255, 255, map(wave, -1, 1, 255, 0));
				
				sphere(blockSize * 0.8);
				
				popMatrix();
			}
		}
	}
}