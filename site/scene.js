"use strict;"

var currentAngle = 0;
var draw = function (delta) {
    currentAngle += (delta * 180);

    // draw the scene
    scene.traverse (Float4x4.identity ());
};

var buildScene = function (canvasId, points) {
    Render.new (canvasId);

    makeCube ();
    makeSphere (3);

    scene = Node.new ({
        state: function () {
            // ordinarily, webGl will automatically present and clear when we return control to the event loop from this
            // function, but we overrode that to have explicit control. webGl still presents the buffer automatically, but the
            // back buffer is not cleared until we do it...
            context.clearColor (1.0, 1.0, 1.0, 1.0);
            context.clear (context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

            // extensions I want for getting gradient infomation inside the fragment shaders
            context.getExtension ("OES_standard_derivatives");
            context.getExtension ("EXT_shader_texture_lod");

            // oh for &#^%'s sake, alpha blending should be standard
            context.blendFunc (context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
            context.enable (context.BLEND);

            // setup the view matrix
            var viewMatrix = Float4x4.identity ();
            Float4x4.rotate (viewMatrix, Utility.degreesToRadians (27.5), [ 1, 0, 0 ]);
            Float4x4.translate (viewMatrix, [ 0, -1.5, -3.5 ]);
            Float4x4.rotate (viewMatrix, Utility.degreesToRadians (currentAngle), [ 0, 1, 0 ]);
            Float4x4.scale (viewMatrix, [ 2, 2, 2 ]);
            Float4x4.translate (viewMatrix, [ -0.5, -0.5, -0.5 ]);
            Shader.getCurrentShader ().setViewMatrix (viewMatrix);
        }
    });

    var transform = Float4x4.identity ();
    Float4x4.scale (transform, [ 0.5, 0.5, 0.5 ]);
    Float4x4.translate (transform, [ 1, 1, 1 ]);
    var background = Node.new ({
        transform: transform,
        shape: "cube",
        state: function () {
            Shader.getCurrentShader ().setBlendAlpha (0.85);
            context.disable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.FRONT);
        }
    });
    scene.addChild (background);

    var cloud = Cloud.new ({
        state: function () {
            Shader.getCurrentShader ().setBlendAlpha (1.0);
            context.enable (context.DEPTH_TEST);
            context.enable (context.CULL_FACE);
            context.cullFace (context.BACK);
        }
    });
    for (let point of points) {
        cloud.addPoint (point);
    }
    scene.addChild (cloud);

    var shader = Shader.new ("shaders/vertex-basic.glsl", "shaders/fragment-rgb.glsl");
    var projectionMatrix = Float4x4.create ();
    Float4x4.perspective (45, context.viewportWidth / context.viewportHeight, 0.1, 100.0, projectionMatrix);
    shader.setProjectionMatrix (projectionMatrix);
    shader.setBlendAlpha (1.0);
    shader.use ();

    draw (0);
};
