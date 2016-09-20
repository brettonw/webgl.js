precision mediump float;

uniform float blendAlpha;

varying vec4 color;

void main(void) {
    gl_FragColor = color * blendAlpha;
}
