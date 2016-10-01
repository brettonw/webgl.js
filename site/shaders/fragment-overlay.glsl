precision highp float;

uniform sampler2D textureSampler;
uniform float outputAlpha;

varying vec3 model;
varying vec3 normal;
varying vec2 texture;

void main(void) {
    vec3 textureColor = texture2D(textureSampler, texture).rgb;
    float alpha = outputAlpha * dot (textureColor, textureColor) / 3.0;
    gl_FragColor = vec4 (textureColor, alpha);
}
