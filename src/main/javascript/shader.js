/**
 * A Vertex and Fragment "shader" pairing, and utilities for setting attributes and parameters.
 *
 * @class Shader
 */
let Shader = function () {
    let _ = Object.create (null);

    /**
     * the name for the standard POSITION buffer attribute in a shader.
     * @element POSITION_ATTRIBUTE
     * @type {string}
     * @final
     */
    _.POSITION_ATTRIBUTE = "POSITION_ATTRIBUTE";

    /**
     * the name for the standard NORMAL buffer attribute in a shader.
     * @element NORMAL_ATTRIBUTE
     * @type {string}
     * @final
     */
    _.NORMAL_ATTRIBUTE = "NORMAL_ATTRIBUTE";

    /**
     * the name for the standard TEXTURE buffer attribute in a shader.
     * @element TEXTURE_ATTRIBUTE
     * @type {string}
     * @final
     */
    _.TEXTURE_ATTRIBUTE = "TEXTURE_ATTRIBUTE";

    let shaders = Object.create (null);
    let currentShader;

    /**
     * the initializer for a shader.
     *
     * @method new
     * @param {string} name name to retrieve this shader
     * @param {string} vertexShaderUrl url to the vertex shader GLSL file
     * @param {string} fragmentShaderUrl url to the fragment shader GLSL file
     * @param {Object} attributeMapping maps standard attribute names to the names used in the shader
     * @param {Object} parameterMapping maps standard parameter names to the names used in the shader
     * @return {Shader}
     */
    _.construct = function (name, vertexShaderUrl, fragmentShaderUrl, attributeMapping, parameterMapping) {
        this.name = name;

        // internal function to fetch and compile a shader function
        let fetchAndCompileShader = function (url, type) {
            let compiledShader = null;
            let request = new XMLHttpRequest ();
            request.open ("GET", url, false);
            request.send (null);
            if (request.status === 200){
                // type is one of (context.VERTEX_SHADER, context.FRAGMENT_SHADER)
                let tmpShader = context.createShader (type);
                context.shaderSource (tmpShader, request.responseText);
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
        let vertexShader = fetchAndCompileShader (vertexShaderUrl, context.VERTEX_SHADER);
        let fragmentShader = fetchAndCompileShader (fragmentShaderUrl, context.FRAGMENT_SHADER);

        // create the shader program and attach the components
        let program = this.program = context.createProgram ();
        context.attachShader (program, vertexShader);
        context.attachShader (program, fragmentShader);
        context.linkProgram (program);
        if (!context.getProgramParameter (program, context.LINK_STATUS)) {
            LOG ("Could not initialise shaders");
            // XXX do we need to delete it?
        }

        // have to do this before collecting parameters and attributes, or else...
        context.useProgram (program);

        // loop over the found active shader parameters providing setter methods for them, and map
        // the ones we know about
        let reverseParameterMapping = Utility.reverseMap(parameterMapping);
        let standardParameterMapping = this.standardParameterMapping = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_UNIFORMS); i < end; i++) {
            let shaderParameter = ShaderParameter.new (program, i);
            let shaderParameterName = shaderParameter.name;
            let setShaderParameterFunctionName = "set" + Utility.uppercase (shaderParameterName);
            this[setShaderParameterFunctionName] = function (value) {
                shaderParameter.set (value);
                return this;
            };

            // if the shader parameter is in the standard mapping, add that
            if (shaderParameterName in reverseParameterMapping) {
                standardParameterMapping[reverseParameterMapping[shaderParameterName]] = setShaderParameterFunctionName;
            }
        }

        // loop over the found active attributes, and map the ones we know about
        let reverseAttributeMapping = Utility.reverseMap(attributeMapping);
        let attributes = this.attributes = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_ATTRIBUTES); i < end; i++) {
            let activeAttribute = context.getActiveAttrib (program, i);
            let activeAttributeName = activeAttribute.name;
            if (activeAttributeName in reverseAttributeMapping) {
                attributes[reverseAttributeMapping[activeAttributeName]] = ShaderAttribute.new (program, activeAttribute);
            }
        }

        return this;
    };

    /**
     * set the standard shader parameters in one call.
     *
     * @method setStandardParameters
     * @param {Object} parameters a mapping of standard parameter names to values, as specified in
     * the initialization of the shader
     * @return {Shader}
     */
    _.setStandardParameters = function (parameters) {
        let standardParameterMapping = this.standardParameterMapping;
        for (let parameter in parameters) {
            if (parameter in standardParameterMapping) {
                this[standardParameterMapping[parameter]] (parameters[parameter]);
            }
        }
    };

    let bindAttribute = function (which, buffer) {
        // not every shader uses every attribute, so don't bother to set them unless they will be used
        if (which in currentShader.attributes) {
            //LOG ("Bind " + which);
            context.bindBuffer (context.ARRAY_BUFFER, buffer);
            currentShader.attributes[which].bind ();
        }
        return Shader;
    };

    /**
     * bind the POSITION attribute to the given buffer.
     *
     * @method bindPositionAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Shader}
     */
    _.bindPositionAttribute = function (buffer) {
        return bindAttribute(_.POSITION_ATTRIBUTE, buffer);
    };

    /**
     * bind the NORMAL attribute to the given buffer.
     *
     * @method bindNormalAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Shader}
     */
    _.bindNormalAttribute = function (buffer) {
        return bindAttribute(_.NORMAL_ATTRIBUTE, buffer);
    };

    /**
     * bind the TEXTURE attribute to the given buffer.
     *
     * @method bindTextureAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Shader}
     */
    _.bindTextureAttribute = function (buffer) {
        return bindAttribute(_.TEXTURE_ATTRIBUTE, buffer);
    };

    /**
     * fetch the shader currently in use.
     *
     * @method getCurrentShader
     * @static
     * @return {Shader}
     */
    _.getCurrentShader = function () {
        return currentShader;
    };

    /**
     * set this as the current shader in the rendering context.
     *
     * @method use
     * @chainable
     */
    _.use = function () {
        if (currentShader !== this) {
            currentShader = this;
            context.useProgram (this.program);
        }
        return this;
    };

    /**
     * get the name of this shader
     *
     * @method getName
     * @return {string} the name of this shader.
     */
    _.getName = function () {
        return this.name;
    };

    /**
     * static method to create and construct a new Shader.
     *
     * @method new
     * @static
     * @param {string} name name to retrieve this shader
     * @param {string} vertexShaderUrl url to the vertex shader GLSL file
     * @param {string} fragmentShaderUrl url to the fragment shader GLSL file
     * @param {Object} attributeMapping maps POSITION, NORMAL, and TEXTURE attributes to the
     * attribute names in the shader. This allows the engine to manage the attributes without
     * forcing the shader author to use "standard" names for everything. Defaults to:
     * * POSITION_ATTRIBUTE: "inputPosition"
     * * NORMAL_ATTRIBUTE: "inputNormal"
     * * TEXTURE_ATTRIBUTE: "inputTexture"
     * @param {Object} parameterMapping maps standard parameters to the parameter names in the
     * shader. This allows the engine to manage setting the standard set of parameters on the shader
     * without forcing the shader author to use "standard" names. Defaults to:
     * * MODEL_MATRIX_PARAMETER: "modelMatrix"
     * * VIEW_MATRIX_PARAMETER: "viewMatrix"
     * * PROJECTION_MATRIX_PARAMETER: "projectionMatrix"
     * * NORMAL_MATRIX_PARAMETER: "normalMatrix"
     * * OUTPUT_ALPHA_PARAMETER: "outputAlpha"
     * @return {Shader}
     */
    _.new = function (name, vertexShaderUrl, fragmentShaderUrl, attributeMapping, parameterMapping) {
        // default value for the vertex shader

        // default value for the fragment shader
        vertexShaderUrl = Utility.defaultValue (vertexShaderUrl, "shaders/vertex-basic.glsl");
        fragmentShaderUrl = Utility.defaultValue (fragmentShaderUrl, "shaders/fragment-basic.glsl");

        // default values for the attribute mapping
        attributeMapping = Utility.defaultFunction (attributeMapping, function () {
            return {
                POSITION_ATTRIBUTE: "inputPosition",
                NORMAL_ATTRIBUTE: "inputNormal",
                TEXTURE_ATTRIBUTE: "inputTexture"
            }
        });

        // default values for the parameter mapping
        parameterMapping = Utility.defaultFunction (parameterMapping, function () {
            return {
                MODEL_MATRIX_PARAMETER: "modelMatrix",
                VIEW_MATRIX_PARAMETER: "viewMatrix",
                PROJECTION_MATRIX_PARAMETER: "projectionMatrix",
                NORMAL_MATRIX_PARAMETER: "normalMatrix",
                OUTPUT_ALPHA_PARAMETER: "outputAlpha"
            }
        });
        return (shaders[name] = Object.create (_).construct (name, vertexShaderUrl, fragmentShaderUrl, attributeMapping, parameterMapping));
    };

    /**
     * fetch a shader by name.
     *
     * @method get
     * @static
     * @return {Shader}
     */
    _.get = function (name) {
        return shaders[name];
    };

    return _;
} ();
