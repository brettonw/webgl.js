/**
 * A Vertex and Fragment "shader" pairing, and utilities for setting attributes and parameters.
 *
 * @class Program
 */
let Program = function () {
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

    let programs = Object.create (null);
    let currentProgram;

    /**
     * the initializer for a shader.
     *
     * @method construct
     * @param {string} name name to retrieve this shader
     * @param {Object} parameters shader construction parameters
     * @return {Program}
     */
    _.construct = function (name, parameters) {
        this.name = name;
        LOG ("Program: " + this.name);

        // create the shader program and attach the components
        let program = this.program = context.createProgram ();
        context.attachShader (program, Shader.get (parameters.vertexShader).compiledShader);
        context.attachShader (program, Shader.get (parameters.fragmentShader).compiledShader);

        // force a binding of attribute 0 to the position attribute (which SHOULD always be present)
        // this avoids a performance penalty incurred if a randomly assigned attribute is on index 0
        // but is not used by a particular shape (like a normals buffer).
        context.bindAttribLocation (program, 0, parameters.attributeMapping.POSITION_ATTRIBUTE);

        // link the program and check that it succeeded
        context.linkProgram (program);
        if (!context.getProgramParameter (program, context.LINK_STATUS)) {
            LOG ("Could not initialise shader");
            // XXX do we need to delete it?
        }

        // have to do this before collecting parameters and attributes, or else...
        context.useProgram (program);

        // loop over the found active shader parameters providing setter methods for them, and map
        // the ones we know about
        let parameterMapping = parameters.parameterMapping;
        let reverseParameterMapping = Utility.reverseMap (parameterMapping);
        let standardParameterMapping = this.standardParameterMapping = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_UNIFORMS); i < end; i++) {
            let programUniform = ProgramUniform.new (program, i);
            let programUniformName = programUniform.name;
            let setProgramUniformFunctionName = "set" + Utility.uppercase (programUniformName);
            this[setProgramUniformFunctionName] = function (value) {
                programUniform.set (value);
                return this;
            };

            // if the shader parameter is in the standard mapping, add that
            if (programUniformName in reverseParameterMapping) {
                standardParameterMapping[reverseParameterMapping[programUniformName]] = setProgramUniformFunctionName;
            }
        }

        // loop over the found active attributes, and map the ones we know about
        let reverseAttributeMapping = Utility.reverseMap (parameters.attributeMapping);
        let attributes = this.attributes = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_ATTRIBUTES); i < end; i++) {
            let activeAttribute = context.getActiveAttrib (program, i);
            let activeAttributeName = activeAttribute.name;
            if (activeAttributeName in reverseAttributeMapping) {
                attributes[reverseAttributeMapping[activeAttributeName]] = ProgramAttribute.new (program, activeAttribute);
            }
        }
        return this;
    };

    /**
     * set the standard shader parameters in one call.
     *
     * @method setStandardUniforms
     * @param {Object} parameters a mapping of standard parameter names to values, as specified in
     * the initialization of the shader
     * @return {Program}
     */
    _.setStandardUniforms = function (parameters) {
        let standardParameterMapping = this.standardParameterMapping;
        for (let parameter in parameters) {
            if (parameter in standardParameterMapping) {
                this[standardParameterMapping[parameter]] (parameters[parameter]);
            }
        }
    };

    let bindAttribute = function (which, buffer) {
        // not every shader uses every attribute, so don't bother to set them unless they will be used
        if (which in currentProgram.attributes) {
            //LOG ("Bind " + which);
            context.bindBuffer (context.ARRAY_BUFFER, buffer);
            currentProgram.attributes[which].bind ();
        }
        return Program;
    };

    /**
     * bind the POSITION attribute to the given buffer.
     *
     * @method bindPositionAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Program}
     */
    _.bindPositionAttribute = function (buffer) {
        return bindAttribute (_.POSITION_ATTRIBUTE, buffer);
    };

    /**
     * bind the NORMAL attribute to the given buffer.
     *
     * @method bindNormalAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Program}
     */
    _.bindNormalAttribute = function (buffer) {
        return bindAttribute (_.NORMAL_ATTRIBUTE, buffer);
    };

    /**
     * bind the TEXTURE attribute to the given buffer.
     *
     * @method bindTextureAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Program}
     */
    _.bindTextureAttribute = function (buffer) {
        return bindAttribute (_.TEXTURE_ATTRIBUTE, buffer);
    };

    /**
     * disable the enabled buffers.
     *
     * @method bindTextureAttribute
     * @static
     * @param {Object} buffer WebGL buffer to bind
     * @return {Program}
     */
    _.unbind = function () {
        for (let attribute in this.attributes) {
            this.attributes[attribute].unbind ();
        }
    };

    /**
     * fetch the shader currently in use.
     *
     * @method getCurrentProgram
     * @static
     * @return {Program}
     */
    _.getCurrentProgram = function () {
        return currentProgram;
    };

    /**
     * set this as the current shader in the rendering context.
     *
     * @method use
     * @chainable
     */
    _.use = function () {
        if (currentProgram !== this) {
            if (typeof currentProgram !== "undefined") {
                currentProgram.unbind ();
            }
            currentProgram = this;
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
     * static method to create and construct a new Program.
     *
     * @method new
     * @static
     * @param {string} name name to retrieve this shader
     * @param {Object} parameters shader construction parameters
     * vertexShader name of the vertex shader to use
     * fragmentShader name of the fragment shader to use
     * attributeMapping maps POSITION, NORMAL, and TEXTURE attributes to the
     * attribute names in the shader. This allows the engine to manage the attributes without
     * forcing the shader author to use "standard" names for everything. Defaults to:
     * * POSITION_ATTRIBUTE: "inputPosition"
     * * NORMAL_ATTRIBUTE: "inputNormal"
     * * TEXTURE_ATTRIBUTE: "inputTexture"
     * parameterMapping maps standard parameters to the parameter names in the
     * shader. This allows the engine to manage setting the standard set of parameters on the shader
     * without forcing the shader author to use "standard" names. Defaults to:
     * * MODEL_MATRIX_PARAMETER: "modelMatrix"
     * * VIEW_MATRIX_PARAMETER: "viewMatrix"
     * * PROJECTION_MATRIX_PARAMETER: "projectionMatrix"
     * * NORMAL_MATRIX_PARAMETER: "normalMatrix"
     * * OUTPUT_ALPHA_PARAMETER: "outputAlpha"
     * * TEXTURE_SAMPLER: "textureSampler"
     * @return {Program}
     */
    _.new = function (name, parameters) {
        // default value for the parameters
        parameters = DEFAULT_FUNCTION (parameters, function () { return Object.create (null); });

        // default value for the vertex shader
        if (!("vertexShader" in parameters)) {
            parameters.vertexShader = "vertex-basic";
        }
        // default value for the fragment shader
        if (!("fragmentShader" in parameters)) {
            parameters.fragmentShader = "fragment-basic";
        }

        // default values for the attribute mapping
        if (!("attributeMapping" in parameters)) {
            parameters.attributeMapping = {
                POSITION_ATTRIBUTE: "inputPosition",
                NORMAL_ATTRIBUTE: "inputNormal",
                TEXTURE_ATTRIBUTE: "inputTexture"
            };
        }

        // default values for the parameter mapping
        if (!("parameterMapping" in parameters)) {
            parameters.parameterMapping = {
                MODEL_MATRIX_PARAMETER: "modelMatrix",
                VIEW_MATRIX_PARAMETER: "viewMatrix",
                PROJECTION_MATRIX_PARAMETER: "projectionMatrix",
                NORMAL_MATRIX_PARAMETER: "normalMatrix",
                OUTPUT_ALPHA_PARAMETER: "outputAlpha",
                TEXTURE_SAMPLER: "textureSampler"
            }
        };
        return (programs[name] = Object.create (_).construct (name, parameters));
    };

    /**
     * fetch a program by name.
     *
     * @method get
     * @static
     * @return {Program}
     */
    _.get = function (name) {
        return programs[name];
    };

    return _;
} ();

