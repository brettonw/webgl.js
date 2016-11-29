precision highp float;

uniform float outputAlpha;

varying vec4 vertexColor;

void main(void) {
    gl_FragColor = vec4 (vertexColor.r, vertexColor.g, vertexColor.b, vertexColor.a * outputAlpha);
}
