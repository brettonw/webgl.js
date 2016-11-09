let Shader = function () {
    let _ = Named ();

    _.construct  = function (parameters) {
        LOG (LogLevel.INFO, "Shader: " + this.name);

        let scope = this;
        let request = new XMLHttpRequest();
        request.onload = function (event) {
            if (request.status === 200) {
                let shader = context.createShader (parameters.type);
                context.shaderSource (shader, request.responseText);
                context.compileShader (shader);
                if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
                    LOG (LogLevel.ERROR, "Shader compilation failed for " + this.name + ":\n" + context.getShaderInfoLog (shader));
                } else {
                    scope.compiledShader = shader;

                    // call the onReady handler if one was provided
                    if (typeof parameters.onReady !== "undefined") {
                        parameters.onReady.notify (scope);
                    }
                }
            }
        };
        request.open("GET", parameters.url);
        request.send();
    };

    _.validate = function (parameters) {
        // there must be a type and url
        if (typeof parameters.type === "undefined") throw "Shader type Required";
        if (typeof parameters.url === "undefined") throw "Shader URL Required";
    };

    return _;
} ();
