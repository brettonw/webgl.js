attribute vec3 inputABC;
attribute vec3 inputXYZ;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec4 color;

void main(void) {
    vec4 vertexPosition = vec4(inputXYZ, 1.0);
    vec4 modelPosition = modelMatrix * vertexPosition;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    color = modelPosition;
}
