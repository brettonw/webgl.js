"use strict;"

let scene;
let standardUniforms = Object.create(null);

let draw = function (deltaPosition) {
    // set up the projection matrix (earth radius is 1 and we want it to occupy about 75% of the
    // view in the vertical direction - the view is probably wider than that)
    let fovRangeValue = 50;
    fovRangeValue *= 0.01;
    fovRangeValue *= fovRangeValue;
    fovRangeValue = 1.0 - fovRangeValue;
    fovRangeValue = 0.5 + (59.5 * fovRangeValue);

    let framingRangeValue = 20;
    framingRangeValue *= 0.01;
    framingRangeValue = 0.1 + (0.9 * framingRangeValue);

    let fov = fovRangeValue;
    let halfFov = fov / 2.0;
    let goalOpposite = 1.0 / framingRangeValue;
    let sinTheta = Math.sin(Utility.degreesToRadians (halfFov));
    let hypotenuse = goalOpposite / sinTheta;
    //console.log("Setting Projection at: " + hypotenuse);
    // I'm cheating with the near/far, I know the moon and anything orbiting it is the farthest out
    // we'll want to see on the near side, and the starfield on the far side
    let nearPlane = Math.max (0.1, hypotenuse - 80.0);
    let farPlane = hypotenuse + 211.0;
    standardUniforms.PROJECTION_MATRIX_PARAMETER = Float4x4.perspective (fov, context.viewportWidth / context.viewportHeight, nearPlane, farPlane, Float4x4.create ());

    // compute the view parameters as up or down, and left or right
    let upAngle = 0.1 * Math.PI * 0.5;
    let viewOffset = Float2.scale ([Math.cos (upAngle), Math.sin (upAngle)], -hypotenuse);

    // setup the view matrix
    let viewMatrix = Float4x4.identity ();
    Float4x4.rotateX (viewMatrix, upAngle);
    viewMatrix  = Float4x4.multiply (Float4x4.translate ([0, viewOffset[1], viewOffset[0]]), viewMatrix);
    standardUniforms.VIEW_MATRIX_PARAMETER = viewMatrix;
    standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.identity ();

    // compute the camera position and set it in the standard uniforms
    let vmi = Float4x4.inverse (viewMatrix);
    standardUniforms.CAMERA_POSITION = [vmi[12], vmi[13], vmi[14]];

    // draw the scene
    scene.traverse (standardUniforms);
};

let buildScene = function () {
    makeRevolve ("cylinder",
        [[1.0, 1.0], [1.0, -1.0], [1.0, -1.0], [0.8, -1.0], [0.8, -1.0], [0.8, 1.0], [0.8, 1.0], [1.0, 1.0]],
        [[1.0, 0.0], [1.0, 0.0], [0.0, -1.0], [0.0, -1.0], [-1.0, 0.0], [-1.0, 0.0], [0.0, 1.0], [0.0, 1.0]],
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

            // back face culling enabled, and full z-buffer utilization
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
            context.enable (context.DEPTH_TEST);
            context.depthMask (true);

            // extensions I want for getting gradient infomation inside the fragment shaders
            //context.getExtension ("OES_standard_derivatives");
            //context.getExtension ("EXT_shader_texture_lod");

            // oh for &#^%'s sake, alpha blending should be standard
            context.blendFunc (context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
            context.enable (context.BLEND);

            // a little bit of setup for lighting
            standardUniforms.OUTPUT_ALPHA_PARAMETER = 1.0;
            standardUniforms.AMBIENT_LIGHT_COLOR = [0.8, 0.8, 1.0];
            standardUniforms.LIGHT_COLOR = [1.0, 1.0, 0.95];
            standardUniforms.LIGHT_DIRECTION = [1.0, 1.0, 1.0];
            standardUniforms.AMBIENT_CONTRIBUTION = 0.15;
            standardUniforms.DIFFUSE_CONTRIBUTION = 0.85;
            standardUniforms.SPECULAR_CONTRIBUTION = 0.05;
            standardUniforms.SPECULAR_EXPONENT = 8.0;
        }
    });

    // just put down the platonic solids...
    scene.addChild (Node.new ({
        name: "moon",
        transform: Float4x4.translate([-3, 1.5, 0]),
        state: function (standardUniforms) {
            Program.get ("basic-texture").use ();
            standardUniforms.TEXTURE_SAMPLER = "moon";
            standardUniforms.MODEL_COLOR = [1.0, 1.0, 1.0];
        },
        shape: "ball",
        children: false
    }));

    scene.addChild (Node.new ({
        name: "ball",
        transform: Float4x4.translate([0, 1.5, 0]),
        state: function (standardUniforms) {
            Program.get ("basic").use ();
            standardUniforms.MODEL_COLOR = [1.0, 0.5, 0.5];
        },
        shape: "sphere3",
        children: false
    }));

    scene.addChild (Node.new ({
        name: "ball",
        transform: Float4x4.translate([3, 1.5, 0]),
        state: function (standardUniforms) {
            Program.get ("basic").use ();
            standardUniforms.MODEL_COLOR = [1.0, 1.0, 0.25];
        },
        shape: "icosahedron",
        children: false
    }));

    //LogLevel.set (LogLevel.TRACE);
    draw ([0, 0]);
};

let onBodyLoad = function () {
    MouseTracker.new ("render-canvas", OnReady.new (null, function (deltaPosition) {
        draw (deltaPosition);
    }), 0.01);
    Render.new ("render-canvas");
    // load the shaders, and build the programs
    LoaderShader.new ("shaders/@.glsl")
        .addVertexShaders ("basic")
        .addFragmentShaders([ "basic", "basic-texture", "color", "overlay", "rgb", "texture" ])
        .go (null, OnReady.new (null, function (x) {
            Program.new ("basic");
            Program.new ("basic-texture", { vertexShader: "basic" });
            Program.new ("color", { vertexShader: "basic" });
            Program.new ("overlay", { vertexShader: "basic" });
            Program.new ("rgb", { vertexShader: "basic" });
            Program.new ("texture", { vertexShader: "basic" });

            // load the textures
            LoaderPath.new ({ type:Texture, path:"textures/@.png"})
                .addItems ("moon", { generateMipMap: true })
                .go (null, OnReady.new (null, function (x) {
                    buildScene ();
                }));
        }));
};
