var context;
var render;

/**
 * This is the description for my class.
 *
 * @class Render
 */
var Render = function () {
    var _ = Object.create (null);

    /**
     * The initializer for a rendering context.
     *
     * @method construct
     * @param {String} canvasId the id of the canvas element to use for the rendering context
     * @return {Render} Returns an initialized rendering context
     */
    _.construct = function (canvasId) {
        var canvas = this.canvas = document.getElementById (canvasId);
        context = canvas.getContext ("webgl", { preserveDrawingBuffer: true });
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport (0, 0, context.viewportWidth, context.viewportHeight);
        return this;
    };

    /**
     * Static method to create and construct a new rendering context.
     *
     * @method new
     * @param {String} canvasId the id of the canvas element to use for the rendering context
     * @return {Render} Returns an initialized rendering context
     */
    _.new = function (canvasId) {
        return (render = Object.create (_).construct (canvasId));
    };

    return _;
} ();
