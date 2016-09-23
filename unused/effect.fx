matrix World;
matrix WorldViewProj;
matrix WorldInverseTranspose;
float3 CameraPosition;

#define TEXTURE(name) Texture2D name; sampler2D name##Sampler = sampler_state { Texture = <name>; MagFilter = LINEAR; MinFilter = LINEAR; MipFilter = LINEAR; }
#define TEXTURE_FILTER(name, filter) Texture2D name; sampler2D name##Sampler = sampler_state { Texture = <name>; MagFilter = LINEAR; MinFilter = LINEAR; MipFilter = filter; }

TEXTURE(DaytimeTexture);
TEXTURE(NighttimeTexture);
TEXTURE(GeoPoliticalBoundariesTexture);
TEXTURE(GridTexture);
TEXTURE(CloudsTexture);
TEXTURE_FILTER(NormalMapTexture, NONE);
TEXTURE_FILTER(SpecularMapTexture, NONE);

struct VertexShaderInput {
	float4 position : SV_POSITION0;
	float3 normal   : NORMAL0;
	float2 uvCoordinate : TEXCOORD0;
};

struct PixelShaderInput {
	float4 position : SV_POSITION0;
	float3 normal   : NORMAL0;
	float2 uvCoordinate : TEXCOORD0;
	float3 worldPosition : TEXCOORD1;
};

PixelShaderInput vertexShader(VertexShaderInput input) {
	PixelShaderInput output;

	output.position = mul(input.position, WorldViewProj);
	output.normal = input.normal;
	output.uvCoordinate = input.uvCoordinate;
	output.worldPosition = mul(input.position, World).xyz;

	return output;
}

float3 DirectionalLight0Direction;
float3 DirectionalLight0Color;

float useGridOverlay = 1;
float useGeopoliticalBoundariesOverlay = 0;
float useCloudsOverlay = 1;

struct PixelShaderCommon {
	float3 worldPosition;
	float3 viewVector;
	float3 lightVector;
	float3 normalVector;
	float cosLightNormalAngle;
	float cosViewNormalAngle;
	float daytimeScale;
	float2 uvCoordinate;
};

float3 blend(float interpolant, float3 left, float3 right) {
	return (left * interpolant) + (right * (1 - interpolant));
}

PixelShaderCommon computeCommon(PixelShaderInput input) {
	PixelShaderCommon output;

	output.worldPosition = input.worldPosition;
	output.viewVector = normalize(CameraPosition - output.worldPosition);

	// the light direction is passed in backwards...
	output.lightVector = -normalize(DirectionalLight0Direction);

	output.normalVector = normalize(mul(float4(input.normal, 0), WorldInverseTranspose).xyz);
	output.cosLightNormalAngle = dot(output.normalVector, output.lightVector);
	output.cosViewNormalAngle = dot(output.normalVector, output.viewVector);

	// compute the daytime lighting color based on the angles, with falloff only toward the boundary
	output.daytimeScale = clamp((output.cosLightNormalAngle + 0.2) * 2.5, 0, 1);

	output.uvCoordinate = input.uvCoordinate;
	return output;
}

float3 specularLighting(PixelShaderCommon psc) {
	float specularExp = tex2D(SpecularMapTextureSampler, psc.uvCoordinate).r;
	if (specularExp > 0.5) {
		specularExp = specularExp * 5;
		float3 reflection = reflect(-psc.lightVector, psc.normalVector);
		float specularMultiplier = clamp(dot(reflection, psc.viewVector), 0, 1);
		return DirectionalLight0Color * pow(specularMultiplier, specularExp);
	}
	return float3 (0, 0, 0);
}

float3 perturbedNormal(float3 normal, float2 uvCoordinate) {
	// compute a perturbed normal in world space using the normal in model space. A generated 
	// tangent space is used to perturb the model space normal vector, which is then transformed to 
	// world space before being returned
	float3 up = float3(0, 0, 1);
	float3 right = cross(up, normal);
	up = cross(normal, right);

	float3 map = (2.0 * tex2D(NormalMapTextureSampler, uvCoordinate).xyz) - 1.0;

	float3 normalOut = normalize((right * map.x) + (up * map.y) + (normal * map.z));
	return normalize (mul(float4(normalOut, 0), WorldInverseTranspose).xyz);
}

float4 pixelShader(PixelShaderInput input) : COLOR {
	PixelShaderCommon psc = computeCommon(input);

	// the daytime color is computed as a falloff from white to orange at the day/night boundary and
	// then multipled byt the ground texture color
	float3 daytimeLightColor = blend(psc.daytimeScale, float3 (1, 1, 1), float3 (1.0, 0.8, 0.6));
	float3 daytimeColor = psc.daytimeScale * daytimeLightColor * tex2D(DaytimeTextureSampler, psc.uvCoordinate).rgb;

	// add a bit of lighting in for the normal map, this blends the map a bit, otherwise it's a bit 
	// harsh looking. note this uses the INPUT normal vector, NOT the PSC corrected one, as it works
	// in model space, not in world space
	float3 N = perturbedNormal(input.normal, input.uvCoordinate);
	daytimeColor = 0.5 * (1 + clamp (dot(N, psc.lightVector), 0, 1)) * daytimeColor;

	// compute the nighttime color and a bit of falloff for atmospheric attenuation
	float3 nighttimeColor = tex2D(NighttimeTextureSampler, psc.uvCoordinate).rgb * psc.cosViewNormalAngle;

	// compute the final color as a blend of the daytime and nighttime...
	float3 finalColor = blend(psc.daytimeScale, daytimeColor, nighttimeColor);

	// add a specular lighting component, with a little scale down
	finalColor += specularLighting(psc) * daytimeLightColor * 0.5;

	// and the geopolitical boundaries, scaled by the cosviewnormal angle to reduce aliasing
	if (useGeopoliticalBoundariesOverlay > 0) {
		finalColor += tex2D(GeoPoliticalBoundariesTextureSampler, psc.uvCoordinate).rgb * psc.cosViewNormalAngle * useGeopoliticalBoundariesOverlay;
	}

	// grids overlay everything, but we alpha blend them down in the range 0 .. 1 .. 0, multiplied 
	// to 8, clamped, and squared to make the falloff only happen in the poles. it is also scaled by
	// the cosviewnormal angle to reduce aliasing
	if (useGridOverlay > 0) {
		float gridAlpha = 1.0 - abs((psc.uvCoordinate.y - 0.5) * 2);
		gridAlpha = pow(clamp(gridAlpha * 5, 0, 1), 2);
		finalColor += tex2D(GridTextureSampler, psc.uvCoordinate).rgb * psc.cosViewNormalAngle * useGridOverlay * gridAlpha;
	}

	// clouds are the last addition, lightening if they should, darkening otherwise
	if (useCloudsOverlay > 0) {
		float3 cloudColor = tex2D(CloudsTextureSampler, psc.uvCoordinate).rgb * daytimeLightColor;
		finalColor = blend(useCloudsOverlay * cloudColor.r, psc.daytimeScale * cloudColor, finalColor);
	}

	return float4(clamp(finalColor, 0, 1), 1);
}

float atmosphereDepth = 0.025;

float4 pixelShaderAtmosphere(PixelShaderInput input) : COLOR {
	PixelShaderCommon psc = computeCommon(input);

	// compute an approximation to how much air the view vector goes through, so we can use that to 
	// fog the pixel with the daytime blend color
	float earthRadius = 1.0;
	float totalRadius = earthRadius + atmosphereDepth;
	float earthEdgeAtmosphereTravelDistance = sqrt((totalRadius * totalRadius) - (earthRadius * earthRadius));
	float delta = earthEdgeAtmosphereTravelDistance - atmosphereDepth;
	float cosEarthEdgeAngle = earthEdgeAtmosphereTravelDistance / totalRadius;
	float atmosphereTravelDistance = 1 - ((psc.cosViewNormalAngle - cosEarthEdgeAngle) / (1 - cosEarthEdgeAngle));
	if (atmosphereTravelDistance > 1) {
		atmosphereTravelDistance = psc.cosViewNormalAngle / cosEarthEdgeAngle;
	}

	// the sky color is faded out according to the proximity to the day/night boundary
	float3 daytimeLightColor = blend(psc.daytimeScale, float3 (0.6, 0.8, 1.0), float3 (1.0, 0.8, 0.6));
	float atmosphere = atmosphereTravelDistance * atmosphereTravelDistance * 0.85 * psc.daytimeScale;
	return float4 (daytimeLightColor, atmosphere);
}

technique Kramllah {
	pass {
		VertexShader = compile vs_4_0 vertexShader();
		PixelShader = compile ps_4_0 pixelShader();
	}
}

technique KramllahAtmosphere {
	pass {
		AlphaBlendEnable = true;
		SrcBlend = SRCALPHA;
		DestBlend = INVSRCALPHA;
		//ZWriteEnable = false;
		//ZEnable = true;
		CullMode = CCW;
		VertexShader = compile vs_4_0 vertexShader();
		PixelShader = compile ps_4_0 pixelShaderAtmosphere();
	}
}
