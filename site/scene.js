"use strict;"

let scene;
let currentAngle = 0;

let standardParameters = Object.create(null);

let draw = function (delta) {
    // update the rotation around the scene
    currentAngle += (delta * 180);

    // setup the view matrix
    let viewMatrix = Float4x4.identity ();
    Float4x4.rotateX (viewMatrix, Utility.degreesToRadians (27.5));
    viewMatrix  = Float4x4.multiply (Float4x4.translate ([ 0, -1.5, -3.5 ]), viewMatrix);
    Float4x4.rotateY (viewMatrix, Utility.degreesToRadians (currentAngle));
    viewMatrix = Float4x4.multiply (Float4x4.scale ([ 2, 2, 2 ]), viewMatrix);
    viewMatrix  = Float4x4.multiply (Float4x4.translate ([ -0.5, -0.5, -0.5 ]), viewMatrix);

    standardParameters.VIEW_MATRIX_PARAMETER = viewMatrix;
    Shader.getCurrentShader ().setStandardParameters (standardParameters);

    // draw the scene
    scene.traverse (Float4x4.identity ());
};

let buildScene = function (canvasId, points) {
    Render.new (canvasId).use ();

    Sphere.parameters.subdivisions = 3;
    Sphere.make ();
    makeRevolve ("cylinder", [[1, 1], [1, -1], [0.5, -1]], 36);
    makeBall ("ball", 36);
    Tetrahedron.make();
    Hexahedron.make();
    Octahedron.make();
    Icosahedron.make();
    Square.make();

    scene = Node.new ({
        name: "root",
        state: function () {
            // ordinarily, webGl will automatically present and clear when we return control to the
            // event loop from the draw function, but we overrode that to have explicit control.
            // webGl still presents the buffer automatically, but the back buffer is not cleared
            // until we do it...
            context.clearColor (1.0, 1.0, 1.0, 1.0);
            context.clear (context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

            // extensions I want for getting gradient infomation inside the fragment shaders
            //context.getExtension ("OES_standard_derivatives");
            //context.getExtension ("EXT_shader_texture_lod");

            // oh for &#^%'s sake, alpha blending should be standard
            context.blendFunc (context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
            context.enable (context.BLEND);
        }
    });

    let transform = Float4x4.multiply (Float4x4.translate ([ 1, 1, 1 ]), Float4x4.scale ([ 0.5, 0.5, 0.5 ]));
    let background = Node.new ({
        name: "background",
        transform: transform,
        state: function () {
            Shader.getCurrentShader ().setOutputAlpha (0.85);
            context.disable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.FRONT);
        },
        shape: "cube",
        children: false
    });
    scene.addChild (background);

    let cloud = Cloud.new ({
        name: "cloud",
        state: function () {
            Shader.getCurrentShader ().setOutputAlpha (1.0);
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
        }
    });
    for (let point of points) {
        cloud.addPoint (point);
    }
    scene.addChild (cloud);

    let projectionMatrix = Float4x4.create ();
    Float4x4.perspective (45, context.viewportWidth / context.viewportHeight, 0.1, 100.0, projectionMatrix);
    Shader.new ("rgb", "shaders/vertex-basic.glsl", "shaders/fragment-rgb.glsl")
        .use ();
    standardParameters.PROJECTION_MATRIX_PARAMETER = projectionMatrix;
    standardParameters.OUTPUT_ALPHA_PARAMETER = 1.0;

    draw (0);
};
