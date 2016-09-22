/**
 * A Vertex and Fragment "shader" pairing, and utilities for setting attributes and parameters.
 *
 * @class Shader
 */
let Shader = function () {
    let _ = Object.create (null);

    /**
     * The name for the standard POSITION buffer attribute in a shader
     * @type {string}
     * @final
     */
    _.POSITION_ATTRIBUTE = "POSITION_ATTRIBUTE";

    /**
     * The name for the standard NORMAL buffer attribute in a shader
     * @type {string}
     * @final
     */
    _.NORMAL_ATTRIBUTE = "NORMAL_ATTRIBUTE";

    /**
     * The name for the standard TEXTURE buffer attribute in a shader
     * @type {string}
     * @final
     */
    _.TEXTURE_ATTRIBUTE = "TEXTURE_ATTRIBUTE";

    let shaders = Object.create (null);
    let currentShader;

    /**
     * The initializer for a shader.
     *
     * @method new
     * @param {string} name name to retrieve this shader
     * @param {string} vertexShaderUrl url to the vertex shader GLSL file
     * @param {string} fragmentShaderUrl url to the fragment shader GLSL file
     * @param {Object} attributeMapping maps POSITION, NORMAL, and TEXTURE attributes to the
     * attribute names in the shader
     * @return {Shader}
     */
    _.construct = function (name, vertexShaderUrl, fragmentShaderUrl, attributeMapping) {
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

        // have to do this before collecting parameters, or else...
        context.useProgram (program);

        // add shader parameters
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_UNIFORMS); i < end; i++) {
            let shaderParameter = ShaderParameter.new (program, i);
            this["set" + Utility.uppercase (shaderParameter.name)] = function (value) {
                shaderParameter.set (value);
                return this;
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

    /**
     * Bind the POSITION attribute to the given buffer.
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
     * Bind the NORMAL attribute to the given buffer.
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
     * Bind the TEXTURE attribute to the given buffer.
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
     * Fetch the shader currently in use.
     *
     * @method getCurrentShader
     * @static
     * @return {Shader}
     */
    _.getCurrentShader = function () {
        return currentShader;
    };

    /**
     * Set this as the current shader in the rendering context.
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
     * Get the name of this shader
     *
     * @method getName
     * @return {string} the name of this shader.
     */
    _.getName = function () {
        return this.name;
    };

    /**
     * Static method to create and construct a new Shader.
     *
     * @method new
     * @static
     * @param {string} name name to retrieve this shader
     * @param {string} vertexShaderUrl url to the vertex shader GLSL file
     * @param {string} fragmentShaderUrl url to the fragment shader GLSL file
     * @param {Object} attributeMapping maps POSITION, NORMAL, and TEXTURE attributes to the
     * attribute names in the shader. Defaults to:
     * * POSITION_ATTRIBUTE: "inputPosition"
     * * NORMAL_ATTRIBUTE: "inputNormal"
     * * TEXTURE_ATTRIBUTE: "inputTexture"
     * @return {Shader}
     */
    _.new = function (name, vertexShaderUrl, fragmentShaderUrl, attributeMapping) {
        attributeMapping = (typeof attributeMapping !== "undefined") ? attributeMapping : {
            POSITION_ATTRIBUTE: "inputPosition",
            NORMAL_ATTRIBUTE: "inputNormal",
            TEXTURE_ATTRIBUTE: "inputTexture"
        };
        return (shaders[name] = Object.create (_).construct (name, vertexShaderUrl, fragmentShaderUrl, attributeMapping));
    };

    /**
     * Fetch a shader by name.
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
