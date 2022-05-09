#version 300 es

precision highp float;

uniform float outputAlpha;

in vec3 model;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vec4 (model, outputAlpha);
}
