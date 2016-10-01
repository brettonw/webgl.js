"use strict;"

let scene;
let currentAngle = 0;

let standardParameters = Object.create(null);

let draw = function (delta) {
    // update the rotation around the scene
    currentAngle += (delta * 180);

    // setup the view matrix
    let viewMatrix = Float4x4.identity ();
    Float4x4.rotateX (viewMatrix, Utility.degreesToRadians (10));
    viewMatrix  = Float4x4.multiply (Float4x4.translate ([ 0, -1, -5.0 ]), viewMatrix);
    Float4x4.rotateY (viewMatrix, Utility.degreesToRadians (currentAngle));
    //viewMatrix = Float4x4.multiply (Float4x4.scale ([ 2, 2, 2 ]), viewMatrix);
    //viewMatrix  = Float4x4.multiply (Float4x4.translate ([ -0.5, -0.5, -0.5 ]), viewMatrix);
    standardParameters.VIEW_MATRIX_PARAMETER = viewMatrix;
    standardParameters.MODEL_MATRIX_PARAMETER = Float4x4.identity ();;

    // draw the scene
    scene.traverse (standardParameters);
};

let buildScene = function (points) {
    makeRevolve ("cylinder",
        [[ 1.0,  1.0], [ 1.0, -1.0], [ 1.0, -1.0], [ 0.8, -1.0], [ 0.8, -1.0], [ 0.8,  1.0], [ 0.8,  1.0], [ 1.0,  1.0]],
        [[ 1.0,  0.0], [ 1.0,  0.0], [ 0.0, -1.0], [ 0.0, -1.0], [-1.0,  0.0], [-1.0,  0.0], [ 0.0,  1.0], [ 0.0,  1.0]],
        36);
    makeBall ("ball", 36);

    scene = Node.new ({
        name: "root",
        state: function (standardParameters) {
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
        }
    });

    let starfield = Node.new ({
        name: "starfield",
        transform: Float4x4.multiply(Float4x4.rotateX (Float4x4.identity (), Math.PI), Float4x4.scale ([-150, -150, -150])),
        state: function (standardParameters) {
            Shader.get ("basic").use ();
            context.disable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardParameters.OUTPUT_ALPHA_PARAMETER = 1.0;
            standardParameters.TEXTURE_SAMPLER = "starfield";
        },
        shape: "ball"
    });
    scene.addChild (starfield);

    let constellations = Node.new ({
        name: "constellations",
        transform: Float4x4.multiply (Float4x4.rotateX (Float4x4.identity (), Math.PI), Float4x4.scale ([-150, -150, -150])),
        state: function (standardParameters) {
            Shader.get ("overlay").use ();
            context.disable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardParameters.OUTPUT_ALPHA_PARAMETER = 0.5;
            standardParameters.TEXTURE_SAMPLER = "constellations";
        },
        shape: "ball",
        children: false
    });
    scene.addChild (constellations);

    let earth = Node.new ({
        name: "earth",
        state: function (standardParameters) {
            Shader.get ("basic").use ();
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            standardParameters.OUTPUT_ALPHA_PARAMETER = 1.0;
            standardParameters.TEXTURE_SAMPLER = "earth";
        },
        shape: "ball"
    });
    scene.addChild (earth);

    let projectionMatrix = Float4x4.create ();
    Float4x4.perspective (60, context.viewportWidth / context.viewportHeight, 0.1, 200.0, projectionMatrix);
    standardParameters.PROJECTION_MATRIX_PARAMETER = projectionMatrix;
    standardParameters.OUTPUT_ALPHA_PARAMETER = 1.0;


    draw (0);
};
