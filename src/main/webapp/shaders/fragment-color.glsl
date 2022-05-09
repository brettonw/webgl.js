#version 300 es

precision highp float;

uniform float outputAlpha;
uniform vec3 modelColor;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vec4 (modelColor, outputAlpha);
}
