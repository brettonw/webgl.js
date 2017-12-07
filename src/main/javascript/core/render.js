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

        // try to do something smart here, like get the aspect ratio from the actual
        // canvas size. that's not always actually set, so the user can request an aspect
        // ratio explicitly which will override the default size
        let width = canvas.width;
        let height = canvas.height;
        let aspectRatio = DEFAULT_VALUE(parameters.aspectRatio, width / height);
        height = width / aspectRatio;

        // set the display size of the canvas.
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // set the size of the drawingBuffer - high DPI devices need to have the canvas
        // drawing surface scaled up while leaving the style size as indicated
        let devicePixelRatio = DEFAULT_VALUE(window.devicePixelRatio, 1);
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        LOG(LogLevel.TRACE, "Scaling display at " + devicePixelRatio + ":1 to (" + canvas.width + "x" + canvas.height + ")");

        // get the actual rendering context
        context = this.context = canvas.getContext ("webgl", { preserveDrawingBuffer: true, alpha: false });
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport (0, 0, context.viewportWidth, context.viewportHeight);

        // set up some boilerplate, loading all the default shaders
        let loaderList = LoaderList.new ().addLoaders (
            LoaderShader
                .new ("https://brettonw.github.io/webgl.js/src/main/webapp/shaders/@.glsl")
                .addVertexShaders ("basic")
                .addFragmentShaders (["basic", "basic-texture", "color", "overlay", "rgb", "texture", "vertex-color"])
        );

        // include anything the user wants to load
        if ("loaders" in parameters) {
            loaderList.addLoaders (parameters.loaders);
        }

        // go get everything
        let scope = this;
        loaderList.go (OnReady.new (null, function (x) {
            // make some shapes we might use
            Tetrahedron.make ();
            Hexahedron.make ();
            Octahedron.make ();
            Icosahedron.make ();
            Square.make ();
            Sphere.makeN (2);
            Sphere.makeN (3);
            Sphere.makeN (5);

            // create the default shaders
            Program.new ({}, "basic");
            Program.new ({ vertexShader: "basic" }, "basic-texture");
            Program.new ({ vertexShader: "basic" }, "color");
            Program.new ({ vertexShader: "basic" }, "overlay");
            Program.new ({ vertexShader: "basic" }, "rgb");
            Program.new ({ vertexShader: "basic" }, "texture");
            Program.new ({ vertexShader: "basic" }, "vertex-color");

            // call the user back when it's all ready
            // call the onReady handler if one was provided
            if (typeof parameters.onReady !== "undefined") {
                parameters.onReady.notify (scope);
            }
        }));
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
