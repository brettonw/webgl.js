"use strict;"

var currentAngle = 0;
var draw = function (delta) {
    currentAngle += (delta * 180);

    // draw the scene
    scene.traverse(Float4x4.identity());
};

var buildScene = function (points) {
    initWebGL ();

    makeCube ();
    makeSquare ();
    makeSphere (3);

    scene = makeNode({ state: {
        pre: function () {
            // ordinarily, webGl will automatically present and clear when we return control to the event loop from this
            // function, but we overrode that to have explicit control. webGl still presents the buffer automatically, but the
            // back buffer is not cleared until we do it...
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

            // setup the view matrix
            var viewMatrix = Float4x4.identity();
            Float4x4.rotate(viewMatrix, Utility.degreesToRadians(27.5), [1, 0, 0]);
            Float4x4.translate(viewMatrix, [0, -1.5, -3.5]);
            Float4x4.rotate(viewMatrix, Utility.degreesToRadians(currentAngle), [0, 1, 0]);
            Float4x4.scale(viewMatrix, [2, 2, 2]);
            Float4x4.translate(viewMatrix, [-0.5, -0.5, -0.5]);
            Shader.getCurrentShader().setViewMatrix (viewMatrix);
        },
        post: function () {}
    }});

    var transform = Float4x4.identity();
    Float4x4.scale(transform, [0.5, 0.5, 0.5]);
    Float4x4.translate(transform, [1, 1, 1]);
    var background = makeNode ({ transform: transform, shape: "cube", state: {
        pre: function () {
            Shader.getCurrentShader().setBlendAlpha (0.85);
            webgl.cullFace(webgl.FRONT);
            webgl.disable(webgl.DEPTH_TEST);
        },
        post: function () {
            Shader.getCurrentShader().setBlendAlpha (1.0);
            webgl.enable(webgl.DEPTH_TEST);
            webgl.cullFace(webgl.BACK);
        }
    } });
    scene.addChild(background);

    var cloud = makeCloud ();
    for (let point of points) {
        cloud.addPoint(point);
    }
    scene.addChild(cloud);

    var shader = makeShader("shaders/vertex.glsl", "shaders/fragment.glsl");
    var projectionMatrix = Float4x4.create();
    Float4x4.perspective(45, webgl.viewportWidth / webgl.viewportHeight, 0.1, 100.0, projectionMatrix);
    shader.setProjectionMatrix (projectionMatrix);
    shader.setBlendAlpha (1.0);
    shader.use ();

    draw(0);
};
