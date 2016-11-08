let Texture = function () {
    let _ = Named (NAME_REQUIRED);

    let textures = Object.create (null);
    let afExtension;

    _.construct  = function (url, parameters, onReady) {
        LOG(LogLevel.INFO, "Texture: " + this.name);

        let texture = this.texture = context.createTexture();
        let image = new Image();

        // allow cross origin loads, all of them... it's butt stupid that this isn't the default
        image.crossOrigin = "anonymous";
        let scope = this;
        image.onload = function() {
            context.bindTexture (context.TEXTURE_2D, texture);
            context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
            context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
            if (("generateMipMap" in parameters) && (parameters.generateMipMap == true)) {
                context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
                context.texParameterf (context.TEXTURE_2D, afExtension.TEXTURE_MAX_ANISOTROPY_EXT, parameters.anisotropicFiltering);
                context.generateMipmap (context.TEXTURE_2D);
            } else {
                context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
            }
            context.bindTexture (context.TEXTURE_2D, null);

                // call the onReady handler
            onReady.notify (scope);
        };
        image.src = parameters.url;

        return this;
    };

    _.validate = function (parameters) {
        // make sure anisotropic filtering is defined, and has a reasonable default value
        DEFAULT_FUNCTION (afExtension, function () { return context.getExtension ("EXT_texture_filter_anisotropic") });
        parameters.anisotropicFiltering = Math.min (context.getParameter(afExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT), ("anisotropicFiltering" in parameters)? parameters.anisotropicFiltering : 4);

        // there must be a url and a notifier
        if (typeof parameters.url === "undefined") throw "URL Required";
        if (typeof parameters.onReady === "undefined") throw "Notifier Required";
    };

    /**
     * static method to create and construct a new Texture.
     *
     * @method new
     * @static
     * @param {string} name the name to use to refer to this texture
     * @param {string} url where to get this texture
     * @param {Object} parameters texture construction parameters
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Texture}
     */
    _.new = function (name, url, parameters, onReady) {
        return Object.create (_).construct (name, url, parameters, onReady);
    };

    /**
     * fetch a texture by name.
     *
     * @method get
     * @static
     * @param {string} name the name of the texture to return
     * @return {Texture}
     */
    _.get = function (name) {
        if (name in textures) {
            return textures[name];
        }
        LOG(LogLevel.WARNNG, "Texture not found: " + name);
    };

    return _;
} ();
