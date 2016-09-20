"use strict;"

var currentAngle = 0;
var draw = function (delta) {
    currentAngle += (delta * 180);

    // draw the scene
    scene.traverse(Float4x4.identity());
};

var buildScene = function (canvasId, points) {
    makeRender (canvasId);

    makeCube ();
    makeSquare ();
    makeSphere (3);

    scene = makeNode({
        state: function () {
            // ordinarily, webGl will automatically present and clear when we return control to the event loop from this
            // function, but we overrode that to have explicit control. webGl still presents the buffer automatically, but the
            // back buffer is not cleared until we do it...
            webgl.clearColor (1.0, 1.0, 1.0, 1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

            // extensions I want for getting gradient infomation inside the fragment shaders
            webgl.getExtension("OES_standard_derivatives");
            webgl.getExtension("EXT_shader_texture_lod");

            // oh for &#^%'s sake, alpha blending should be standard
            webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);
            webgl.enable(webgl.BLEND);

            // setup the view matrix
            var viewMatrix = Float4x4.identity();
            Float4x4.rotate(viewMatrix, Utility.degreesToRadians(27.5), [1, 0, 0]);
            Float4x4.translate(viewMatrix, [0, -1.5, -3.5]);
            Float4x4.rotate(viewMatrix, Utility.degreesToRadians(currentAngle), [0, 1, 0]);
            Float4x4.scale(viewMatrix, [2, 2, 2]);
            Float4x4.translate(viewMatrix, [-0.5, -0.5, -0.5]);
            Shader.getCurrentShader().setViewMatrix (viewMatrix);
        }
    });

    var transform = Float4x4.identity();
    Float4x4.scale(transform, [0.5, 0.5, 0.5]);
    Float4x4.translate(transform, [1, 1, 1]);
    var background = makeNode ({
        transform: transform,
        shape: "cube",
        state: function () {
            Shader.getCurrentShader().setBlendAlpha (0.85);
            webgl.disable(webgl.DEPTH_TEST);
            webgl.enable(webgl.CULL_FACE);
            webgl.cullFace(webgl.FRONT);
        }
    });
    scene.addChild(background);

    var cloud = makeCloud ({
        state: function () {
            Shader.getCurrentShader().setBlendAlpha (1.0);
            webgl.enable(webgl.DEPTH_TEST);
            webgl.enable(webgl.CULL_FACE);
            webgl.cullFace(webgl.BACK);
        }
    });
    for (let point of points) {
        cloud.addPoint(point);
    }
    scene.addChild(cloud);

    var shader = makeShader("shaders/vertex-basic.glsl", "shaders/fragment-rgb.glsl");
    var projectionMatrix = Float4x4.create();
    Float4x4.perspective(45, webgl.viewportWidth / webgl.viewportHeight, 0.1, 100.0, projectionMatrix);
    shader.setProjectionMatrix (projectionMatrix);
    shader.setBlendAlpha (1.0);
    shader.use ();

    draw(0);
};
