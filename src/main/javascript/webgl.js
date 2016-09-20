var webgl;

var WebGL = function () {
    var _ = Object.create (null);

    _.construct = function (canvasId) {
        var canvas = this.canvas = document.getElementById(canvasId);
        var context = this.context = canvas.getContext("webgl", {preserveDrawingBuffer: true});
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport(0, 0, context.viewportWidth, context.viewportHeight);

        webgl = context;
        return this;
    };

    _.makeVertexBuffer = function (vertices) {
        var vertexBuffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numItems = vertices.length / 3;
        return vertexBuffer;
    };

    _.makeIndexBuffer = function (indices) {
        var indexBuffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), webgl.STATIC_DRAW);
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = indices.length;
        return indexBuffer;
    };

    return _;
} ();

var makeWebGL = function (canvasId) {
    return Object.create (WebGL).construct(canvasId);
};

/*

var webgl;
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
        LOG("EXCEPTION");
    }
    if (!webgl) {
        LOG("Could not initialise WebGL, sorry :-(");
    }
};

    */
