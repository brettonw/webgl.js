let context;

/**
 * A Rendering context.
 *
 * @class Render
 */
let Render = function () {
    let _ = CLASS_BASE;

    /**
     * The initializer for a rendering context.
     *
     * @method construct
     * @param {string} canvasId the id of the canvas element to use for the rendering context
     * @return {Render}
     */
    _.construct = function (parameters) {
        let canvas = this.canvas = document.getElementById (parameters.canvasId);
        let aspectRatio = DEFAULT_VALUE(parameters.aspectRatio, 16.0 / 9.0);

        // high DPI devices need to have the canvas drawing surface scaled up while leaving the style
        // size as indicated
        let width = canvas.width;
        let height = width / aspectRatio;

        // get the display size of the canvas.
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // set the size of the drawingBuffer
        let devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        LOG(LogLevel.TRACE, "Scaling display at " + devicePixelRatio + ":1 to (" + canvas.width + "x" + canvas.height + ")");

        // get the actual rendering context
        context = this.context = canvas.getContext ("webgl", { preserveDrawingBuffer: true, alpha: false });
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
    };

    _.save = function (filename) {
        //let image = this.canvas.toDataURL ("image/png").replace ("image/png", "image/octet-stream");
        let MIME_TYPE = "image/png";
        let imgURL = this.canvas.toDataURL (MIME_TYPE);
        let dlLink = document.createElement ('a');
        dlLink.download = filename + ".png";
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join (':');

        document.body.appendChild (dlLink);
        dlLink.click ();
        document.body.removeChild (dlLink);
    };

    /**
     * Set the global rendering context.
     *
     * @method use
     */
    _.use = function () {
        context = this.context;
    };

    return _;
} ();
