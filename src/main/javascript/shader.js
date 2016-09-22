let Shader = function () {
    let _ = Object.create (null);

    _.POSITION_ATTRIBUTE = "POSITION_ATTRIBUTE";
    _.NORMAL_ATTRIBUTE = "NORMAL_ATTRIBUTE";
    _.TEXTURE_ATTRIBUTE = "TEXTURE_ATTRIBUTE";

    let currentShader;

    _.construct = function (vertexShaderUrl, fragmentShaderUrl, attributeMapping) {
        let getSource = function (url) {
            let request = new XMLHttpRequest ();
            request.open ("GET", url, false);
            request.send (null);
            return (request.status === 200) ? request.responseText : null;
        };

        let compileShader = function (url, type) {
            let compiledShader = null;
            let src = getSource (url);
            if (src !== null) {
                // type is one of (context.VERTEX_SHADER, context.FRAGMENT_SHADER)
                let tmpShader = context.createShader (type);
                context.shaderSource (tmpShader, src);
                context.compileShader (tmpShader);
                if (!context.getShaderParameter (tmpShader, context.COMPILE_STATUS)) {
                    LOG (context.getShaderInfoLog (tmpShader));
                } else {
                    compiledShader = tmpShader;
                }
            }
            return compiledShader;
        };

        // fetch and compile the shader components
        let vertexShader = compileShader (vertexShaderUrl, context.VERTEX_SHADER);
        let fragmentShader = compileShader (fragmentShaderUrl, context.FRAGMENT_SHADER);

        // create the shader program and attach the components
        let program = this.program = context.createProgram ();
        context.attachShader (program, vertexShader);
        context.attachShader (program, fragmentShader);
        context.linkProgram (program);
        if (!context.getProgramParameter (program, context.LINK_STATUS)) {
            LOG ("Could not initialise shaders");
            // do we need to delete it?
        }

        // have to do this before collecting parameters, or else...
        context.useProgram (program);

        // add shader parameters
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_UNIFORMS); i < end; i++) {
            let shaderParameter = ShaderParameter.new (program, i);
            this["set" + Utility.uppercase (shaderParameter.name)] = function (value) {
                shaderParameter.set (value);
            }
        }

        // to add shader attributes, we start by reversing the mapping
        let reverseAttributeMapping = Object.create (null);
        reverseAttributeMapping[attributeMapping.POSITION_ATTRIBUTE] = _.POSITION_ATTRIBUTE;
        reverseAttributeMapping[attributeMapping.NORMAL_ATTRIBUTE] = _.NORMAL_ATTRIBUTE;
        reverseAttributeMapping[attributeMapping.TEXTURE_ATTRIBUTE] = _.TEXTURE_ATTRIBUTE;

        // then we loop over the found active attributes, and map the ones we know about
        let attributes = this.attributes = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_ATTRIBUTES); i < end; i++) {
            let activeAttribute = context.getActiveAttrib (program, i);
            let name = activeAttribute.name;
            if (name in reverseAttributeMapping) {
                attributes[reverseAttributeMapping[name]] = ShaderAttribute.new (program, activeAttribute);
            }
        }

        return this;
    };

    let bindAttribute = function (which, buffer) {
        // not every shader uses every attribute, so don't bother to set them unless they will be used
        if (which in currentShader.attributes) {
            context.bindBuffer (context.ARRAY_BUFFER, buffer);
            currentShader.attributes[which].bind ();
        }
        return Shader;
    };

    _.bindPositionAttribute = function (buffer) {
        return bindAttribute(_.POSITION_ATTRIBUTE, buffer);
    };

    _.bindNormalAttribute = function (buffer) {
        return bindAttribute(_.NORMAL_ATTRIBUTE, buffer);
    };

    _.bindTextureAttribute = function (buffer) {
        return bindAttribute(_.TEXTURE_ATTRIBUTE, buffer);
    };

    _.getCurrentShader = function () {
        return currentShader;
    };

    _.use = function () {
        if (currentShader !== this) {
            currentShader = this;
            context.useProgram (this.program);
        }
        return this;
    };

    _.new = function (vertexShaderUrl, fragmentShaderUrl, attributeMapping) {
        attributeMapping = (typeof attributeMapping !== "undefined") ? attributeMapping : {
            POSITION_ATTRIBUTE: "inputPosition",
            NORMAL_ATTRIBUTE: "inputNormal",
            TEXTURE_ATTRIBUTE: "inputTexture"
        };
        return Object.create (_).construct (vertexShaderUrl, fragmentShaderUrl, attributeMapping);
    };

    return _;
} ();
