let Shader = function () {
    let _ = Object.create (null);

    let shaders = Object.create (null);

    _.construct  = function (name, url, parameters, onReady) {
        this.name = name;
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
                    onReady.notify (scope);
                }
            }
        };
        request.open("GET", url);
        request.send();

        return this;
    };

    /**
     * static method to create and construct a new Shader.
     *
     * @method new
     * @static
     * @param {string} name the name to use to refer to this shader
     * @param {string} url where to get this shader
     * @param {Object} parameters shader construction parameters, typically url and type, where
     * type is one of (context.VERTEX_SHADER, context.FRAGMENT_SHADER)
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Shader}
     */
    _.new = function (name, url, parameters, onReady) {
        parameters = DEFAULT_VALUE(parameters, {});
        return (shaders[name] = Object.create (_).construct (name, url, parameters, onReady));
    };

    /**
     * fetch a shader by name.
     *
     * @method get
     * @static
     * @param {string} name the name of the shader to return
     * @return {Shader}
     */
    _.get = function (name) {
        return shaders[name];
    };

    return _;
} ();
