var context;
var render;
var Render = function () {
    var _ = Object.create (null);

    _.construct = function (canvasId) {
        var canvas = this.canvas = document.getElementById (canvasId);
        context = canvas.getContext ("webgl", { preserveDrawingBuffer: true });
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport (0, 0, context.viewportWidth, context.viewportHeight);
        return this;
    };

    _.makeVertexBuffer = function (vertices) {
        var vertexBuffer = context.createBuffer ();
        context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
        context.bufferData (context.ARRAY_BUFFER, new Float32Array (vertices), context.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numItems = vertices.length / 3;
        return vertexBuffer;
    };

    _.makeIndexBuffer = function (indices) {
        var indexBuffer = context.createBuffer ();
        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, indexBuffer);
        context.bufferData (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices), context.STATIC_DRAW);
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = indices.length;
        return indexBuffer;
    };

    _.new = function (canvasId) {
        return (render = Object.create (_).construct (canvasId));
    };

    return _;
} ();
