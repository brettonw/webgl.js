"use strict;"

let render;
let scene;
let standardUniforms = Object.create (null);

let currentAngle = 0;

let fovRange;
let framingRange;
let animateCheckbox;
let displayFpsSpan;

let lastTime = new Date ().getTime ();
let globalTime = 0;
const fpsHistoryCount = 50;
let fpsHistory = Array (fpsHistoryCount).fill (0);
let fpsHistoryIndex = 0;
let fpsHistoryAverage = 0;
let drawFrame = function () {
    if (document.hidden) {
        animateCheckbox.checked = false;
        return;
    }
    let nowTime = new Date ().getTime ();
    if (animateCheckbox.checked) {
        // compute the updated time
        let deltaTime = nowTime - lastTime;
        globalTime += deltaTime;
        Thing.updateAll (globalTime);

        // update the fps
        fpsHistoryAverage -= fpsHistory[fpsHistoryIndex];
        fpsHistoryAverage += (fpsHistory[fpsHistoryIndex] = deltaTime);
        fpsHistoryIndex = (fpsHistoryIndex + 1) % fpsHistoryCount;
        let fps = 1000.0 / (fpsHistoryAverage / fpsHistoryCount);
        displayFpsSpan.innerHTML = Utility.padNum(fps.toFixed(1), 3) + " fps";

        // draw again as fast as possible
        window.requestAnimationFrame (drawFrame);
    }
    lastTime = nowTime;

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
    viewMatrix = Float4x4.chain (Float4x4.rotateY (Utility.degreesToRadians (currentAngle)), viewMatrix);

    standardUniforms.VIEW_MATRIX_PARAMETER = viewMatrix;
    standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.identity ();

    // compute the camera position and set it in the standard uniforms
    let vmi = Float4x4.inverse (viewMatrix);
    standardUniforms.CAMERA_POSITION = [vmi[12], vmi[13], vmi[14]];
    //console.log ("CAMERA AT: " + Float3.str (standardUniforms.CAMERA_POSITION));

    // draw the scene
    scene.traverse (standardUniforms);


};

let clickAnimateCheckbox = function () {
    if (animateCheckbox.checked) {
        lastTime = new Date ().getTime ();
        drawFrame ();
    }
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

        // put down the platonic solids...
        .addChild (Node.new ({
            transform: Float4x4.chain (Float4x4.rotateXAxisTo ([0, 0, -1]), Float4x4.translate ([-3, 1.5, 0])),
            //transform: Float4x4.translate([-3, 1.5, 0]),
            state: function (standardUniforms) {
                Program.get ("basic-texture").use ();
                standardUniforms.TEXTURE_SAMPLER = "moon";
                standardUniforms.MODEL_COLOR = [1.0, 1.0, 1.0];
            },
            shape: "ball",
            children: false
        }))

        .addChild (Node.new ({
            transform: Float4x4.chain (Float4x4.rotateZ (Math.PI / 3), Float4x4.rotateX (0.25), Float4x4.translate ([0, 1.5, 0])),
            state: function (standardUniforms) {
                Program.get ("basic").use ();
                standardUniforms.MODEL_COLOR = [1.0, 0.5, 0.5];
            },
            shape: "cylinder",
            children: false
        }, "cylinder"))

        .addChild (Node.new ({
            transform: Float4x4.translate ([3, 1.5, 0]),
            state: function (standardUniforms) {
                Program.get ("basic").use ();
                standardUniforms.MODEL_COLOR = [1.0, 1.0, 0.25];
            },
            shape: "icosahedron",
            children: false
        }));

    Thing.new ({
        node: "cylinder", update: function (time) {
            let node = Node.get (this.node);
            node.transform = Float4x4.chain (
                Float4x4.rotateZ (Math.PI / 3),
                Float4x4.rotateX (0.25),
                Float4x4.rotateY (Math.PI * time * 0.0005),
                Float4x4.translate ([0, 1.5, 0])
            );
        }
    });

    //LogLevel.set (LogLevel.TRACE);
    drawFrame ();
};

let onClickSave = function () {
    render.save("webgl");
};

let onBodyLoad = function () {
    fovRange = document.getElementById ("fovRange");
    framingRange = document.getElementById ("framingRange");
    animateCheckbox = document.getElementById("animateCheckbox");
    displayFpsSpan = document.getElementById("displayFpsSpan");

    MouseTracker.new ("render-canvas", OnReady.new (null, function (deltaPosition) {
        currentAngle += deltaPosition[0] * 180;
        if (! animateCheckbox.checked) {
            window.requestAnimationFrame (drawFrame);
        }
    }), 0.01);

    render = Render.new ({canvasId: "render-canvas"});

    // loader list
    LoaderList
        .new ()
        .addLoaders (
            LoaderShader
                .new ("shaders/@.glsl")
                .addVertexShaders ("basic")
                .addFragmentShaders (["basic", "basic-texture", "color", "overlay", "rgb", "texture", "vertex-color"]),
            LoaderPath
                .new ({ type: Texture, path: "textures/@.png" })
                .addItems ("moon", { generateMipMap: true })
        )
        .go (OnReady.new (null, function (x) {
            Program.new ({}, "basic");
            Program.new ({ vertexShader: "basic" }, "basic-texture");
            Program.new ({ vertexShader: "basic" }, "color");
            Program.new ({ vertexShader: "basic" }, "overlay");
            Program.new ({ vertexShader: "basic" }, "rgb");
            Program.new ({ vertexShader: "basic" }, "texture");
            Program.new ({ vertexShader: "basic" }, "vertex-color");
            buildScene ();
        }));
};
