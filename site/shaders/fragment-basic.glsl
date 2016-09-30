precision highp float;

uniform sampler2D textureSampler;
uniform float outputAlpha;

varying vec3 model;
varying vec3 normal;
varying vec2 texture;

void main(void) {
    // basic ambient + lambertian
    float lighting = 1.0; //(dot (normal, normalize (vec3 (0.5, 0.8, 1.0))) * 0.2) + 0.8;
    vec3 textureColor = texture2D(textureSampler, texture).rgb;
    vec3 litTextureColor = lighting * textureColor;
    gl_FragColor = vec4 (litTextureColor, outputAlpha);
}
