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

    _.new = function (canvasId) {
        return (render = Object.create (_).construct (canvasId));
    };

    return _;
} ();
