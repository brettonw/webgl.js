let context;
let render;

/**
 * A Rendering context.
 *
 * @class Render
 */
let Render = function () {
    let _ = Object.create (null);

    /**
     * The initializer for a rendering context.
     *
     * @method construct
     * @param {String} canvasId the id of the canvas element to use for the rendering context
     * @return {Render} Returns an initialized rendering context
     */
    _.construct = function (canvasId) {
        let canvas = this.canvas = document.getElementById (canvasId);
        let context = this.context = canvas.getContext ("webgl", { preserveDrawingBuffer: true });
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport (0, 0, context.viewportWidth, context.viewportHeight);
        return this;
    };

    _.use = function () {
        context = this.context;
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
