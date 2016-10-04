precision highp float;

uniform mat4 normalMatrix;
uniform sampler2D textureSampler;
uniform float outputAlpha;
uniform vec3 lightDirection;
uniform vec3 cameraPosition;


varying vec3 model;
varying vec3 normal;
varying vec2 texture;

void main(void) {
    // basic ambient + lambertian
    vec3 n = normalize ((normalMatrix * vec4 (normal, 0)).xyz);
    //float lighting = (clamp (dot (normal, lightDirection), 0.0, 1.0) * 0.95) + 0.05;
    float lighting = clamp (dot (normal, lightDirection), 0.0, 1.0);
    vec3 textureColor = texture2D(textureSampler, texture).rgb;
    vec3 litTextureColor = lighting * textureColor;
    gl_FragColor = vec4 (litTextureColor, outputAlpha);
}
