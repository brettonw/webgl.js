// standard declarations for gradient information and precision
#extension GL_OES_standard_derivatives : enable
#extension GL_EXT_shader_texture_lod : enable
precision mediump float;

uniform float blendAlpha;

varying vec4 color;

void main(void) {

    gl_FragColor = color * blendAlpha;

    /*
    // get the gradients
    vec4 x = dFdx(vColor);
    vec4 y = dFdy(vColor);

    float pi = 3.141592654;
    float gridLineValue = max (sin ((pi * 0.5) + (vColor.x * 10.0 * pi)) - 0.95, 0.0) * 20.0;
    vec4 gridLineColor = vec4 (gridLineValue, gridLineValue, gridLineValue, 1);
    gl_FragColor = clamp (vColor + gridLineColor, vec4 (0, 0, 0, 0), vec4 (1, 1, 1, 1));
    */
}
