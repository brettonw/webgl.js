    /**
     * A Rendering context.
     *
     * @class Render
     */
    let Render = $.Render = function () {
        let _ = CLASS_BASE;

        /**
         * The initializer for a rendering context.
         *
         * @method construct
         * @return {Render}
         */
        _.construct = function (parameters) {
            // get the parent div, create the canvas, and the rendering context
            let canvasDiv = document.getElementById (parameters.canvasDivId);
            let canvas = document.createElement("canvas");
            canvasDiv.appendChild(canvas);
            context = this.context = canvas.getContext ("webgl2", { preserveDrawingBuffer: true });

            // size everything to the parent div
            let devicePixelRatio = DEFAULT_VALUE(window.devicePixelRatio, 1);
            let resizeHandler = function (event) {
                let canvasDiv = event[0].target;
                context.viewportWidth = context.canvas.width = canvasDiv.clientWidth * devicePixelRatio;
                context.viewportHeight = context.canvas.height = canvasDiv.clientHeight * devicePixelRatio;
                context.viewport (0, 0, context.viewportWidth, context.viewportHeight);
                context.canvas.style.width  = canvasDiv.clientWidth + "px";
                context.canvas.style.height  = canvasDiv.clientHeight + "px";
            };
            new ResizeObserver(resizeHandler).observe(canvasDiv);

            // set up some boilerplate, loading all the default shaders
            let loaderList = LoaderList.new ().addLoaders (
                LoaderShader
                    .new ("https://webgl.irdev.us/shaders/@.glsl")
                    //.new ("shaders/@.glsl")
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
                if (typeof parameters.onReady !== "undefined") {
                    parameters.onReady.notify (scope);
                }
            }));
        };

        _.save = function (filename) {
            //let image = this.canvas.toDataURL ("image/png").replace ("image/png", "image/octet-stream");
            let MIME_TYPE = "image/png";
            let imgURL = this.context.canvas.toDataURL (MIME_TYPE);
            let dlLink = document.createElement ('a');
            dlLink.download = filename + ".png";
            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join (':');

            document.body.appendChild (dlLink);
            dlLink.click ();
            document.body.removeChild (dlLink);
        };

        return _;
    } ();
