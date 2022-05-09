#version 300 es

precision highp float;

uniform float outputAlpha;

in vec4 color;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vec4 (color.r, color.g, color.b, color.a * outputAlpha);
}
