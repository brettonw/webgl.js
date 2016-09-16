"use strict;"

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
                // type is one of (webgl.VERTEX_SHADER, webgl.FRAGMENT_SHADER)
                var tmpShader = webgl.createShader(type);
                webgl.shaderSource(tmpShader, src);
                webgl.compileShader(tmpShader);
                if (! webgl.getShaderParameter(tmpShader, webgl.COMPILE_STATUS)) {
                    console.log(webgl.getShaderInfoLog(tmpShader));
                } else {
                    compiledShader = tmpShader;
                }
            }
            return compiledShader;
        };

        // fetch and compile the shader components
        var vertexShader = compileShader (vertexShaderUrl, webgl.VERTEX_SHADER);
        var fragmentShader = compileShader (fragmentShaderUrl, webgl.FRAGMENT_SHADER);

        // create the shader program and attach the components
        var program = this.program = webgl.createProgram();
        webgl.attachShader(program, vertexShader);
        webgl.attachShader(program, fragmentShader);
        webgl.linkProgram(program);
        if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
            // do we need to delete it?
        }

        // have to do this before collecting parameters, or else...
        webgl.useProgram(program);

        // add shader parameters
        var parameters = this.parameters = Object.create (null);
        for (let i = 0, end = webgl.getProgramParameter (program, webgl.ACTIVE_UNIFORMS); i < end; i++) {
            var shaderParameter = makeShaderParameter(program, i);
            parameters[shaderParameter.name] = shaderParameter;
        }

        // add shader attributes
        var attributes = this.attributes = Object.create (null);
        for (let i = 0, end = webgl.getProgramParameter (program, webgl.ACTIVE_ATTRIBUTES); i < end; i++) {
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

    _.currentShader = function () {
        return currentShader;
    };

    _.use = function () {
        if (currentShader !== this) {
            currentShader = this;
            webgl.useProgram(this.program);
        }
    };

    return _;
} ();

var makeShader = function (vertexShaderUrl, fragmentShaderUrl) {
    return Object.create (Shader).construct (vertexShaderUrl, fragmentShaderUrl);
};
