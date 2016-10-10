"use strict;"

let scene;
let currentPosition = [0, 0];

let standardUniforms = Object.create(null);

let showConstellationsCheckbox;
let showCloudsCheckbox;
let showAtmosphereCheckbox;
let fovRange;
let framingRange;

let constellationsNode;
let cloudsNode;
let atmosphereNode;

let draw = function (deltaPosition) {
    // update the current position and clamp or wrap accordingly
    currentPosition = Float2.add (currentPosition, deltaPosition);
    while (currentPosition[0] > 1) {
        currentPosition[0] -= 2;
    }
    while (currentPosition[0] < -1) {
        currentPosition[0] += 2;
    }
    currentPosition[1] = Math.min (currentPosition[1], 0.9);
    currentPosition[1] = Math.max (currentPosition[1], -0.9);

    // set up the projection matrix (earth radius is 1 and we want it to occupy about 75% of the
    // view in the vertical direction - the view is probably wider than that)
    let fovRangeValue = fovRange.value;
    fovRangeValue *= 0.01;
    fovRangeValue *= fovRangeValue;
    fovRangeValue = 1.0 - fovRangeValue;
    fovRangeValue = 10 + (50 * fovRangeValue);

    let framingRangeValue = framingRange.value;
    framingRangeValue *= 0.01;
    framingRangeValue = 0.1 + (0.9 * framingRangeValue);

    let fov = fovRangeValue;
    let halfFov = fov / 2.0;
    let goalOpposite = 1.0 / framingRangeValue;
    let sinTheta = Math.sin(Utility.degreesToRadians (halfFov));
    let hypotenuse = goalOpposite / sinTheta;
    console.log("Setting Projection at: " + hypotenuse);
    let nearPlane = 0.1;
    let farPlane = hypotenuse + 220.0;
    standardUniforms.PROJECTION_MATRIX_PARAMETER = Float4x4.perspective (fov, context.viewportWidth / context.viewportHeight, nearPlane, farPlane, Float4x4.create ());

    // compute the view parameters as up or down, and left or right
    let upAngle = currentPosition[1] * Math.PI * 0.5;
    let viewOffset = Float2.scale ([Math.cos (upAngle), Math.sin (upAngle)], -hypotenuse);

    // setup the view matrix
    let viewMatrix = Float4x4.identity ();
    Float4x4.rotateX (viewMatrix, upAngle);
    viewMatrix  = Float4x4.multiply (Float4x4.translate ([0, viewOffset[1], viewOffset[0]]), viewMatrix);
    Float4x4.rotateY (viewMatrix,currentPosition[0] * Math.PI);
    //viewMatrix = Float4x4.multiply (Float4x4.scale ([ 2, 2, 2 ]), viewMatrix);
    //viewMatrix  = Float4x4.multiply (Float4x4.translate ([ -0.5, -0.5, -0.5 ]), viewMatrix);
    standardUniforms.VIEW_MATRIX_PARAMETER = viewMatrix;
    standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.identity ();

    // compute the camera position and set it in the standard uniforms
    let vmi = Float4x4.inverse (viewMatrix);
    standardUniforms.CAMERA_POSITION = [vmi[12], vmi[13], vmi[14]];

    // update the visibility layers
    constellationsNode.enabled = showConstellationsCheckbox.checked;
    cloudsNode.enabled = showCloudsCheckbox.checked;
    atmosphereNode.enabled = showAtmosphereCheckbox.checked;

    // draw the scene
    scene.traverse (standardUniforms);
};

let buildScene = function () {
    makeRevolve ("cylinder",
        [[ 1.0,  1.0], [ 1.0, -1.0], [ 1.0, -1.0], [ 0.8, -1.0], [ 0.8, -1.0], [ 0.8,  1.0], [ 0.8,  1.0], [ 1.0,  1.0]],
        [[ 1.0,  0.0], [ 1.0,  0.0], [ 0.0, -1.0], [ 0.0, -1.0], [-1.0,  0.0], [-1.0,  0.0], [ 0.0,  1.0], [ 0.0,  1.0]],
        36);
    makeBall ("ball", 72);
    makeBall ("ball-small", 36);

    scene = Node.new ({
        name: "root",
        state: function (standardUniforms) {
            // ordinarily, webGl will automatically present and clear when we return control to the
            // event loop from the draw function, but we overrode that to have explicit control.
            // webGl still presents the buffer automatically, but the back buffer is not cleared
            // until we do it...
            context.clearColor (0.0, 0.0, 0.0, 1.0);
            context.clear (context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

            // extensions I want for getting gradient infomation inside the fragment shaders
            //context.getExtension ("OES_standard_derivatives");
            //context.getExtension ("EXT_shader_texture_lod");

            // oh for &#^%'s sake, alpha blending should be standard
            context.blendFunc (context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
            context.enable (context.BLEND);

            // a little bit of setup for lighting
            standardUniforms.AMBIENT_LIGHT_COLOR = [1.0, 1.0, 1.0];
            standardUniforms.LIGHT_COLOR = [1.0, 1.0, 1.0];
            standardUniforms.LIGHT_DIRECTION = Float3.normalize ([0, 0, -100]);
        }
    });

    let starfieldNode = Node.new ({
        name: "starfield",
        transform: Float4x4.multiply(Float4x4.rotateX (Float4x4.identity (), Math.PI), Float4x4.scale (-210)),
        state: function (standardUniforms) {
            Program.get ("texture").use ();
            context.disable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 1.0;
            standardUniforms.TEXTURE_SAMPLER = "starfield";
        },
        shape: "ball"
    });
    scene.addChild (starfieldNode);

    constellationsNode = Node.new ({
        name: "constellations",
        state: function (standardUniforms) {
            Program.get ("overlay").use ();
            context.disable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 0.25;
            standardUniforms.TEXTURE_SAMPLER = "constellations";
        },
        shape: "ball",
        children: false
    });
    starfieldNode.addChild (constellationsNode);

    let moonNode = Node.new ({
        name: "moon",
        transform: Float4x4.multiply (Float4x4.scale (0.273), Float4x4.translate ([60.2682, 0, 0])),
        state: function (standardUniforms) {
            Program.get ("ads").use ();
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 1.0;
            standardUniforms.TEXTURE_SAMPLER = "moon";
            standardUniforms.MODEL_COLOR = [1.1, 1.1, 1.1];
            standardUniforms.AMBIENT_CONTRIBUTION = 0.05;
            standardUniforms.DIFFUSE_CONTRIBUTION = 0.95;
            standardUniforms.SPECULAR_CONTRIBUTION = 0.05;
            standardUniforms.SPECULAR_EXPONENT = 8.0;
        },
        shape: "ball-small"
    });
    scene.addChild (moonNode);

    let sunNode = Node.new ({
        name: "sun",
        transform: Float4x4.multiply (Float4x4.scale (0.930), Float4x4.translate ([0, 0, -200])),
        state: function (standardUniforms) {
            Program.get ("color").use ();
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 1.0;
            standardUniforms.MODEL_COLOR = [255, 241, 234];
        },
        shape: "sphere2"
    });
    scene.addChild (sunNode);

    let earthRadius = 6378.1370;
    let earthNode = Node.new ({
        name: "earth",
        state: function (standardUniforms) {
            Program.get ("earth").use ()
                .setDayTxSampler ("earth-day")
                .setNightTxSampler ("earth-night")
                .setSpecularMapTxSampler ("earth-specular-map");
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 1.0;
        },
        shape: "ball"
    });
    scene.addChild (earthNode);

    let cloudHeight = (40 + earthRadius) / earthRadius;
    cloudsNode = Node.new ({
        name: "clouds",
        transform: Float4x4.scale (cloudHeight),
        state: function (standardUniforms) {
            Program.get ("clouds").use ();
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 0.90;
            standardUniforms.TEXTURE_SAMPLER = "clouds";
        },
        shape: "ball"
    });
    scene.addChild (cloudsNode);

    let atmosphereDepth = (160 + earthRadius) / earthRadius;
    atmosphereNode = Node.new ({
        name: "clouds",
        transform: Float4x4.scale (atmosphereDepth),
        state: function (standardUniforms) {
            Program.get ("atmosphere").use ()
                .setAtmosphereDepth (atmosphereDepth - 1.0);
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 0.5;
        },
        shape: "ball"
    });
    scene.addChild (atmosphereNode);

    draw ([0, 0]);
};

let onBodyLoad = function () {
    MouseTracker.new ("render-canvas", OnReady.new (null, function (deltaPosition) {
        draw (deltaPosition);
    }), 0.01);
    Render.new ("render-canvas");

    showConstellationsCheckbox = document.getElementById("showConstellationsCheckbox");
    showCloudsCheckbox = document.getElementById("showCloudsCheckbox");
    showAtmosphereCheckbox = document.getElementById("showAtmosphereCheckbox");
    fovRange = document.getElementById("fovRange");
    framingRange = document.getElementById("framingRange");

    // load the shaders, and build the programs
    LoaderPath.new ({ type:Shader, path: "shaders/@.glsl"})
        .addItem ("vertex-basic", { type: context.VERTEX_SHADER })
        .addItems ([ "fragment-basic", "fragment-ads", "fragment-overlay", "fragment-texture", "fragment-color", "fragment-earth", "fragment-clouds", "fragment-atmosphere" ], { type: context.FRAGMENT_SHADER })
        .go (null, OnReady.new (null, function (x) {
            Program.new ("basic", { vertexShader: "vertex-basic", fragmentShader: "fragment-basic" });
            Program.new ("ads", { vertexShader: "vertex-basic", fragmentShader: "fragment-ads" });
            Program.new ("overlay", { vertexShader: "vertex-basic", fragmentShader: "fragment-overlay" });
            Program.new ("texture", { vertexShader: "vertex-basic", fragmentShader: "fragment-texture" });
            Program.new ("color", { vertexShader: "vertex-basic", fragmentShader: "fragment-color" });
            Program.new ("earth", { vertexShader: "vertex-basic", fragmentShader: "fragment-earth" });
            Program.new ("clouds", { vertexShader: "vertex-basic", fragmentShader: "fragment-clouds" });
            Program.new ("atmosphere", { vertexShader: "vertex-basic", fragmentShader: "fragment-atmosphere" });

            // load the textures
            LoaderPath.new ({ type:Texture, path:"textures/@.png"})
                .addItems (["clouds", "earth-day", "earth-night", "earth-specular-map", "moon"], { generateMipMap: true })
                .addItems (["starfield", "constellations"])
                .go (null, OnReady.new (null, function (x) {
                    buildScene ();
                }));

        }));
};
