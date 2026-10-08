// Jason Labbe inverse-distance light shader, adapted under CC BY-SA 3.0.
let vertShader = `
	#ifdef GL_ES
	precision mediump float;
	#endif

	attribute vec3 aPosition;

	void main() {
		vec4 positionVec4 = vec4(aPosition, 1.0);
		positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
		gl_Position = positionVec4;
	}
`;

let fragShader = `
	#ifdef GL_ES
	precision mediump float;
	#endif
	
	uniform vec2 resolution;
 uniform vec3 inkTint;
	uniform int trailCount;
	uniform vec2 trail[${MAX_TRAIL_COUNT}];
	uniform int particleCount;
	uniform vec3 particles[${MAX_PARTICLE_COUNT}];
	uniform vec3 colors[${MAX_PARTICLE_COUNT}];

	void main() {
			vec2 st = gl_FragCoord.xy / resolution.xy;  // Warning! This is causing non-uniform scaling.

			vec2 aspect=vec2(resolution.x/resolution.y,1.0);
 vec2 gradient=vec2(0.0);
 float r = 0.0;
			float g = 0.0;
			float b = 0.0;

			for (int i = 0; i < ${MAX_TRAIL_COUNT}; i++) {
				if (i < trailCount) {
					vec2 trailPos = trail[i];
					vec2 delta=(st-trailPos.xy)*aspect;
 float d=max(.008,length(delta));
 gradient-=2.0*delta/(d*d*d*d)*float(i)*.000002;
 float value = float(i) / pow(max(.006,distance(st*aspect, trailPos.xy*aspect)),2.0) * 0.000002;  // Multiplier may need to be adjusted if max trail count is tweaked.
					g += value * 0.5;
					b += value;
				}
			}

			float mult = 0.0000016;
			
			for (int i = 0; i < ${MAX_PARTICLE_COUNT}; i++) {
				if (i < particleCount) {
					vec3 particle = particles[i];
					vec2 pos = particle.xy;
					float mass = particle.z;
					vec3 color = colors[i];
 vec2 delta=(st-pos)*aspect;
 float d=max(.008,length(delta));
 gradient-=2.0*delta/(d*d*d*d)*mult*mass*length(color);

					r += color.r / pow(max(.006,distance(st*aspect, pos*aspect)),2.0) * mult * mass;
					g += color.g / pow(max(.006,distance(st*aspect, pos*aspect)),2.0) * mult * mass;
					b += color.b / pow(max(.006,distance(st*aspect, pos*aspect)),2.0) * mult * mass;
				}
			}

			vec3 light=vec3(r,g,b);
 float energy=length(light);
 // Retain Labbe's inverse-distance light accumulation; give it a pearlescent core.
 vec3 hue=light/max(.001,energy);
 vec3 normal=normalize(vec3(gradient*.004,1.0));
 vec3 lamp=normalize(vec3(-.55,.7,1.1));
 float diffuse=max(.0,dot(normal,lamp));
 float spec=pow(max(.0,dot(reflect(-lamp,normal),vec3(0.,0.,1.))),28.0);
 float liquid=smoothstep(.54,.57,energy);
 float rim=pow(1.0-normal.z,2.0);
 vec3 sheen=.55+.45*cos(vec3(0.,2.,4.)+normal.z*5.0);
 vec3 surface=hue*(.16+diffuse*.9)+vec3(.85,.93,1.)*spec*.8+sheen*rim*.5;
 vec3 glow=(1.0-exp(-light*.25))*.4;
 vec3 col=mix(glow,surface,liquid);
 gl_FragColor = vec4(col+vec3(.015,.022,.032),1.0);
	}
`;