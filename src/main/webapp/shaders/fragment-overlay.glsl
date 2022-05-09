#version 300 es

precision highp float;

uniform sampler2D textureSampler;
uniform float outputAlpha;

in vec3 model;
in vec3 normal;
in vec2 uv;

out vec4 fragmentColor;

void main(void) {
    vec3 textureColor = texture(textureSampler, uv).rgb;
    float alpha = sqrt (dot (textureColor, textureColor)) / sqrt (3.0);
    fragmentColor = vec4 (textureColor, outputAlpha * alpha);
}
