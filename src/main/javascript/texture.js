let Texture = function () {
    let _ = Object.create (null);

    let textures = Object.create (null);

    _.construct  = function (name, parameters) {
        this.name = name;

        let texture = this.texture = context.createTexture();
        let image = new Image();
        let scope = this;
        image.onload = function() {
            context.bindTexture (context.TEXTURE_2D, texture);
            context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
            context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
            context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
            let extension = context.getExtension ("EXT_texture_filter_anisotropic");
            let max = Math.min (context.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 4);
            context.texParameterf(context.TEXTURE_2D, extension.TEXTURE_MAX_ANISOTROPY_EXT, max);
            context.generateMipmap (context.TEXTURE_2D);
            context.bindTexture (context.TEXTURE_2D, null);
            parameters.onReady (scope);
        };
        image.src = parameters.url;

        return this;
    };

    _.new = function (name, parameters) {
        return (textures[name] = Object.create (_).construct (name, parameters));
    };

    /**
     * fetch a texture by name.
     *
     * @method get
     * @static
     * @return {Texture}
     */
    _.get = function (name) {
        return textures[name];
    };

    return _;
} ();
