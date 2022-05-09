#version 300 es

precision highp float;

uniform float outputAlpha;
uniform vec3 cameraPosition;

in vec3 model;
in vec3 normal;

out vec4 fragmentColor;

void main(void) {
	vec3 viewVector = normalize (cameraPosition - model);
    vec3 normalVector = normalize (normal);
	float cosViewNormalAngle = clamp (dot(normalVector, viewVector), 0.0, 1.0);
	float scale = 0.7 + (cosViewNormalAngle * 0.3);

    fragmentColor = vec4 (model * scale, outputAlpha);
}
