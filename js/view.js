"use strict";

var webgl;

var degToRad = function (degrees) {
    return degrees * Math.PI / 180;
};

var initWebGL = function () {
    try {
        var canvas = document.getElementById("view-canvas");
        webgl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
        webgl.viewportWidth = canvas.width;
        webgl.viewportHeight = canvas.height;
        webgl.viewport(0, 0, webgl.viewportWidth, webgl.viewportHeight);

        // extensions I want for getting gradient infomation inside the fragment shader
        webgl.getExtension("OES_standard_derivatives");
        webgl.getExtension("EXT_shader_texture_lod");

        // oh for &#^%'s sake, alpha blending should be standard
        webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);
        webgl.enable(webgl.BLEND);

        webgl.enable(webgl.CULL_FACE);

        webgl.clearColor (1.0, 1.0, 1.0, 1.0);

        webgl.enable (webgl.DEPTH_TEST);
    } catch (e) {
        console.log("EXCEPTION");
    }
    if (!webgl) {
        console.log("Could not initialise WebGL, sorry :-(");
    }
};


var currentAngle = 0;
var draw = function (delta) {
    currentAngle += (delta * 180);

    // ordinarily, webGl will automatically present and clear when we return control to the event loop from this
    // function, but we overrode that to have explicit control. webGl still presents the buffer automatically, but the
    // back buffer is not cleared until we do it...
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

    // setup the view matrix
    var viewMatrix = Float4x4.identity();
    Float4x4.rotate(viewMatrix, degToRad(27.5), [1, 0, 0]);
    Float4x4.translate(viewMatrix, [0, -1.5, -3.5]);
    Float4x4.rotate(viewMatrix, degToRad(currentAngle), [0, 1, 0]);
    Float4x4.scale(viewMatrix, [2, 2, 2]);
    Float4x4.translate(viewMatrix, [-0.5, -0.5, -0.5]);
    Shader.currentShader().parameters.viewMatrix.set (viewMatrix);

    // draw the scene
    scene.traverse(Float4x4.identity());
};

var buildScene = function () {
    initWebGL ();

    makeCube ();
    makeTetrahedron ();
    makeSphere (3);

    var transform = Float4x4.identity();
    Float4x4.scale(transform, [0.5, 0.5, 0.5]);
    Float4x4.translate(transform, [1, 1, 1]);
    var background = makeNode ({ transform: transform, shape: "cube", state: {
        pre: function () {
            Shader.currentShader().parameters.blendAlpha.set (0.85);
            webgl.cullFace(webgl.FRONT);
            webgl.disable(webgl.DEPTH_TEST);
        },
        post: function () {
            Shader.currentShader().parameters.blendAlpha.set (1.0);
            webgl.enable(webgl.DEPTH_TEST);
            webgl.cullFace(webgl.BACK);
        }
    } });
    scene.addChild(background);

    var cloud = makeCloud ();
    cloud.addPoint([0.5, 0.45, 0.65]);
    cloud.addPoint([0.75, 0.75, 0.75]);
    cloud.addPoint([0.75, 0.5, 0.75]);
    cloud.addPoint([0.75, 0.5, 0.5]);
    cloud.addPoint([0.25, 0.25, 0.25]);
    cloud.addPoint([0.9, 0.25, 0.25]);
    scene.addChild(cloud);

    var shader = makeShader("shaders/vertex.glsl", "shaders/fragment.glsl");
    var projectionMatrix = Float4x4.create();
    Float4x4.perspective(45, webgl.viewportWidth / webgl.viewportHeight, 0.1, 100.0, projectionMatrix);
    shader.parameters.projectionMatrix.set (projectionMatrix);
    shader.parameters.blendAlpha.set (1.0);
    shader.use ();

    draw(0);
};
