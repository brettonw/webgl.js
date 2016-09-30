let Texture = function () {
    let _ = Object.create (null);

    _.construct  = function (parameters) {
        let texture = this.texture = context.createTexture();
        let image = new Image();
        let scope = this;
        image.onload = function() {
            context.bindTexture (context.TEXTURE_2D, texture);
            context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
            context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
            context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_NEAREST);
            context.generateMipmap (context.TEXTURE_2D);
            context.bindTexture (context.TEXTURE_2D, null);
            parameters.onReady (scope);
        }
        image.src = parameters.url;

        return this;
    };

    _.set = function (shader) {
        context.activeTexture (context.TEXTURE0);
        context.bindTexture (context.TEXTURE_2D, this.texture);
        context.uniform1i (context.getUniformLocation (shader.program, "textureSampler"), 0);
    };

    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
