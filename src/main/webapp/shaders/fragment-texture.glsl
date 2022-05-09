#version 300 es

precision highp float;

uniform sampler2D textureSampler;
uniform float outputAlpha;

in vec2 uv;

out vec4 fragmentColor;

void main(void) {
    vec3 textureColor = texture(textureSampler, uv).rgb;
    fragmentColor = vec4 (textureColor, outputAlpha);
}
