    let Texture = $.Texture = function () {
        let _ = ClassNamed ($.CLASS_NAME_REQUIRED);

        let afExtension;

        _.construct  = function (parameters) {
            LOG(LogLevel.INFO, "Texture: " + parameters.name);

            // make sure anisotropic filtering is defined, and has a reasonable default value
            DEFAULT_FUNCTION (afExtension, function () { return context.getExtension ("EXT_texture_filter_anisotropic") });
            parameters.anisotropicFiltering = Math.min (context.getParameter(afExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT), ("anisotropicFiltering" in parameters)? parameters.anisotropicFiltering : 4);

            // there must be a url
            if (typeof parameters.url === "undefined") throw "Texture URL Required";

            let texture = this.texture = context.createTexture();
            let image = new Image();

            // allow cross origin loads, all of them... it's butt stupid that this isn't the default
            image.crossOrigin = "anonymous";
            let scope = this;
            image.onload = function() {
                context.bindTexture (context.TEXTURE_2D, texture);
                context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
                context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
                if (("generateMipMap" in parameters) && (parameters.generateMipMap === true)) {
                    context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
                    context.texParameterf (context.TEXTURE_2D, afExtension.TEXTURE_MAX_ANISOTROPY_EXT, parameters.anisotropicFiltering);
                    context.generateMipmap (context.TEXTURE_2D);
                } else {
                    context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
                }
                context.bindTexture (context.TEXTURE_2D, null);

                // call the onReady handler if one was provided
                if (typeof parameters.onReady !== "undefined") {
                    parameters.onReady.notify (scope);
                }
            };
            image.src = parameters.url;
        };

        return _;
    } ();
