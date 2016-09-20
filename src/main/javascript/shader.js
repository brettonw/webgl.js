var Shader = function () {
    var _ = Object.create (null);

    var currentShader;

    _.construct = function (vertexShaderUrl, fragmentShaderUrl) {
        var getSource = function (url) {
            var request = new XMLHttpRequest();
            request.open ("GET", url, false);
            request.send(null);
            return (request.status === 200) ? request.responseText : null;
        };

        var compileShader = function (url, type) {
            var compiledShader = null;
            var src = getSource (url);
            if (src !== null) {
                // type is one of (context.VERTEX_SHADER, context.FRAGMENT_SHADER)
                var tmpShader = context.createShader(type);
                context.shaderSource(tmpShader, src);
                context.compileShader(tmpShader);
                if (! context.getShaderParameter(tmpShader, context.COMPILE_STATUS)) {
                    LOG(context.getShaderInfoLog(tmpShader));
                } else {
                    compiledShader = tmpShader;
                }
            }
            return compiledShader;
        };

        // fetch and compile the shader components
        var vertexShader = compileShader (vertexShaderUrl, context.VERTEX_SHADER);
        var fragmentShader = compileShader (fragmentShaderUrl, context.FRAGMENT_SHADER);

        // create the shader program and attach the components
        var program = this.program = context.createProgram();
        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            LOG("Could not initialise shaders");
            // do we need to delete it?
        }

        // have to do this before collecting parameters, or else...
        context.useProgram(program);

        // add shader parameters
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_UNIFORMS); i < end; i++) {
            let shaderParameter = makeShaderParameter(program, i);
            this["set" + Utility.uppercase (shaderParameter.name)] = function (value) {
                shaderParameter.set (value);
            }
        }

        // add shader attributes
        var attributes = this.attributes = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_ATTRIBUTES); i < end; i++) {
            var shaderAttribute = makeShaderAttribute(program, i);
            attributes[shaderAttribute.name] = shaderAttribute;
        }

        return this;
    };

    _.bindAttributes = function () {
        for (let name in this.attributes) {
            this.attributes[name].bind ();
        }
    };

    _.getCurrentShader = function () {
        return currentShader;
    };

    _.use = function () {
        if (currentShader !== this) {
            currentShader = this;
            context.useProgram(this.program);
        }
    };

    return _;
} ();

var makeShader = function (vertexShaderUrl, fragmentShaderUrl) {
    return Object.create (Shader).construct (vertexShaderUrl, fragmentShaderUrl);
};
