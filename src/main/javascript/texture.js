let Texture = function () {
    let _ = Object.create (null);

    let textures = Object.create (null);
    let afExtension;

    _.construct  = function (name, url, parameters, onReady) {
        this.name = name;
        LOG(LogLevel.TRACE, "Texture: " + name);

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

            // set the texture in the textures
            textures[name] = scope;

                // call the onReady handler
            onReady.notify (scope);
        };
        image.src = url;

        return this;
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
        afExtension = DEFAULT_FUNCTION (afExtension, function () { return context.getExtension ("EXT_texture_filter_anisotropic") });
        parameters = DEFAULT_VALUE(parameters, {});
        // make sure anisotropic filtering is defined, and has a reasonable default value
        parameters.anisotropicFiltering = Math.min (context.getParameter(afExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT), ("anisotropicFiltering" in parameters)? parameters.anisotropicFiltering : 4);
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
        return textures[name];
    };

    return _;
} ();
