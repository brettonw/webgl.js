precision mediump float;

uniform float blendAlpha;

varying vec3 model;
varying vec3 normal;
varying vec2 texture;

void main(void) {
    float lighting = dot (normal, normalize (vec3 (0.5, 0.8, 1.0)));
    gl_FragColor = vec4 (lighting, lighting, lighting, blendAlpha);//vec4 (model * blendAlpha, blendAlpha);
}
