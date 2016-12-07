precision highp float;

uniform mat4 normalMatrix;
uniform float outputAlpha;
uniform vec3 cameraPosition;

varying vec3 model;
varying vec3 normal;

void main(void) {
	vec3 viewVector = normalize (cameraPosition - model);
    vec3 normalVector = normalize ((normalMatrix * vec4 (normal, 0.0)).xyz);
	float cosViewNormalAngle = clamp (dot(normalVector, viewVector), 0.0, 1.0);
	float scale = 0.25 + (cosViewNormalAngle * 0.75);

    /*
    vec3 red = vec3 (1.0, 0.0, 0.0);
    vec3 blue = vec3 (0.0, 0.0, 1.0);
    gl_FragColor = vec4 ((red * cosViewNormalAngle) + (blue * (1.0 - cosViewNormalAngle)), outputAlpha);
    */

    gl_FragColor = vec4 (model * scale, outputAlpha);
}
