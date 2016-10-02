let context;

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
     * @param {string} canvasId the id of the canvas element to use for the rendering context
     * @return {Render}
     */
    _.construct = function (canvasId) {
        let canvas = this.canvas = document.getElementById (canvasId);
        context = this.context = canvas.getContext ("webgl", { preserveDrawingBuffer: true });
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport (0, 0, context.viewportWidth, context.viewportHeight);

        // make some shapes we might use
        Tetrahedron.make();
        Hexahedron.make();
        Octahedron.make();
        Icosahedron.make();
        Square.make();
        Sphere.makeN(2);
        Sphere.makeN(3);
        Sphere.makeN(5);

        return this;
    };

    /**
     * Set the global rendering context.
     *
     * @method use
     */
    _.use = function () {
        context = this.context;
    };

    /**
     * Static method to create and construct a new rendering context.
     *
     * @method new
     * @static
     * @param {string} canvasId the id of the canvas element to use for the rendering context.
     * @return {Render}
     */
    _.new = function (canvasId) {
        return (render = Object.create (_).construct (canvasId));
    };

    return _;
} ();
