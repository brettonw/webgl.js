"use strict;"

let scene;
let standardUniforms = Object.create(null);

let currentAngle = 0;

let fovRange;
let framingRange;


let draw = function (deltaPosition) {
    Thing.updateAll(new Date ().getTime());

    // set up the projection matrix (earth radius is 1 and we want it to occupy about 75% of the
    // view in the vertical direction - the view is probably wider than that)
    let fovRangeValue = fovRange.value;
    fovRangeValue *= 0.01;
    fovRangeValue *= fovRangeValue;
    fovRangeValue = 1.0 - fovRangeValue;
    fovRangeValue = 0.5 + (59.5 * fovRangeValue);

    let framingRangeValue = framingRange.value;
    framingRangeValue *= 0.01;
    framingRangeValue = 0.1 + (0.9 * framingRangeValue);

    let fov = fovRangeValue;
    let goalOpposite = 3 * (1.0 / framingRangeValue);
    // I'm cheating using static values for the near/far planes, ideally these would be the distance
    // along the view vector to the front of the scene bounds, and the back of the scene bounds
    let nearPlane = 0.1;
    let farPlane = nearPlane + 1000;
    standardUniforms.PROJECTION_MATRIX_PARAMETER = Float4x4.perspective (fov, context.viewportWidth / context.viewportHeight, nearPlane, farPlane);

    // setup the view matrix
    let viewMatrix = Float4x4.lookAt (goalOpposite, fov, [0, 2, 7], [0, 1.5, 0]);
    //console.log ("LOOK AT: " + Float3.str ([0, 1.5, 0]));
    //console.log ("LOOK ALONG: " + Float3.str ([0, 2, 7]));
    currentAngle += deltaPosition[0] * 180;
    viewMatrix = Float4x4.chain (Float4x4.rotateY(Utility.degreesToRadians(currentAngle)), viewMatrix);

    standardUniforms.VIEW_MATRIX_PARAMETER = viewMatrix;
    standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.identity ();

    // compute the camera position and set it in the standard uniforms
    let vmi = Float4x4.inverse (viewMatrix);
    standardUniforms.CAMERA_POSITION = [vmi[12], vmi[13], vmi[14]];
    //console.log ("CAMERA AT: " + Float3.str (standardUniforms.CAMERA_POSITION));

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
            standardUniforms.LIGHT_COLOR = [1.0, 1.0, 0.8];
            standardUniforms.LIGHT_DIRECTION = Float3.normalize ([1.55, 1.75, 1.45]);
            standardUniforms.AMBIENT_CONTRIBUTION = 0.25;
            standardUniforms.DIFFUSE_CONTRIBUTION = 0.75;
            standardUniforms.SPECULAR_CONTRIBUTION = 0.05;
            standardUniforms.SPECULAR_EXPONENT = 8.0;
        }
    }, "root")

    // just put down the platonic solids...
        .addChild (Node.new ({
        name: "moon",
        transform: Float4x4.chain(Float4x4.rotateXAxisTo([0, 0, -1]), Float4x4.translate([-3, 1.5, 0])),
        //transform: Float4x4.translate([-3, 1.5, 0]),
        state: function (standardUniforms) {
            Program.get ("basic-texture").use ();
            standardUniforms.TEXTURE_SAMPLER = "moon";
            standardUniforms.MODEL_COLOR = [1.0, 1.0, 1.0];
        },
        shape: "ball",
        children: false
    }, "moon"))

    .addChild (Node.new ({
        transform: Float4x4.chain(Float4x4.rotateZ(Math.PI / 3), Float4x4.rotateX (0.25), Float4x4.translate([0, 1.5, 0])),
        state: function (standardUniforms) {
            Program.get ("basic").use ();
            standardUniforms.MODEL_COLOR = [1.0, 0.5, 0.5];
        },
        shape: "cylinder",
        children: false
    }, "cylinder"))

    .addChild (Node.new ({
        transform: Float4x4.translate([3, 1.5, 0]),
        state: function (standardUniforms) {
            Program.get ("basic").use ();
            standardUniforms.MODEL_COLOR = [1.0, 1.0, 0.25];
        },
        shape: "icosahedron",
        children: false
    }, "ball"));

    Thing.new ({ node: "cylinder", update: function (time) {
        let node = Node.get(this.node);
        node.transform = Float4x4.chain(
            Float4x4.rotateZ(Math.PI / 3),
            Float4x4.rotateX (0.25),
            Float4x4.rotateY (Math.PI * time * 0.001),
            Float4x4.translate([0, 1.5, 0])
        );
    }});

    //LogLevel.set (LogLevel.TRACE);
    draw ([0, 0]);
};

let onBodyLoad = function () {
    fovRange = document.getElementById("fovRange");
    framingRange = document.getElementById("framingRange");

    MouseTracker.new ("render-canvas", OnReady.new (null, function (deltaPosition) {
        draw (deltaPosition);
    }), 0.01);

    Render.new ("render-canvas");

    // load the shaders, and build the programs
    LoaderShader.new ("shaders/@.glsl")
        .addVertexShaders ("basic")
        .addFragmentShaders([ "basic", "basic-texture", "color", "overlay", "rgb", "texture" ])
        .go (null, OnReady.new (null, function (x) {
            Program.new ({}, "basic");
            Program.new ({ vertexShader: "basic" }, "basic-texture");
            Program.new ({ vertexShader: "basic" }, "color");
            Program.new ({ vertexShader: "basic" }, "overlay");
            Program.new ({ vertexShader: "basic" }, "rgb");
            Program.new ({ vertexShader: "basic" }, "texture");

            // load the textures
            LoaderPath.new ({ type:Texture, path:"textures/@.png"})
                .addItems ("moon", { generateMipMap: true })
                .go (null, OnReady.new (null, function (x) {
                    buildScene ();
                }));
        }));
};
