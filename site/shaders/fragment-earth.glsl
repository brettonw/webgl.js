precision highp float;

uniform mat4 normalMatrix;
uniform float outputAlpha;

uniform vec3 lightDirection;
uniform vec3 cameraPosition;

uniform sampler2D dayTxSampler;
uniform sampler2D nightTxSampler;
uniform sampler2D specularMapTxSampler;

varying vec3 model;
varying vec3 normal;
varying vec2 texture;

void main(void) {
    // compute the core vectors we'll need
	vec3 viewVector = normalize (cameraPosition - model);
    vec3 normalVector = normalize ((normalMatrix * vec4 (normal, 0.0)).xyz);

    // standard cosines we'll need
	float cosLightNormalAngle = dot(normalVector, lightDirection);
	float cosViewNormalAngle = dot(normalVector, viewVector);

    // the mapping from day to night
    float daytimeScale = clamp((cosLightNormalAngle + 0.2) * 2.5, 0.0, 1.0);

    // get the texture map samples we'll need
    vec3 dayTxColor = texture2D(dayTxSampler, texture).rgb;
    vec3 nightTxColor = texture2D(nightTxSampler, texture).rgb * cosViewNormalAngle;
    float specularMapTxValue = texture2D(specularMapTxSampler, texture).r;

    // compute the specular contribution
    float specularExp = 5.0;
    vec3 reflection = reflect(-lightDirection, normalVector);
    float specularMultiplier = clamp(dot(reflection, viewVector), 0.0, 1.0);
    vec3 specularColor = vec3(1.0, 0.9, 0.8) * (pow(specularMultiplier, specularExp) * 0.4 * specularMapTxValue);

    vec3 groundColor = mix (nightTxColor, dayTxColor, daytimeScale);
    vec3 finalColor = clamp (groundColor + specularColor, 0.0, 1.0);

    gl_FragColor = vec4 (finalColor, outputAlpha);
}
