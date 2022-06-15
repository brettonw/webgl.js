    /**
     * A Vertex and Fragment "shader" pairing, and utilities for setting attributes and parameters.
     *
     * @class Program
     */
    let Program = $.Program = function () {
        let _ = ClassNamed ($.CLASS_NAME_REQUIRED);

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

        /**
         * the name for the standard COLOR buffer attribute in a shader.
         * @element COLOR_ATTRIBUTE
         * @type {string}
         * @final
         */
        _.COLOR_ATTRIBUTE = "COLOR_ATTRIBUTE";

        /**
         * the name for the standard MODEL_MATRIX buffer attribute in a shader.
         * @element COLOR_ATTRIBUTE
         * @type {string}
         * @final
         */
        _.MODEL_MATRIX_ATTRIBUTE = "MODEL_MATRIX_ATTRIBUTE";

        let currentProgram;

        /**
         * the initializer for a shader.
         *
         * @method construct
         * @param {Object} parameters shader construction parameters
         * vertexShader name of the vertex shader to use
         * fragmentShader name of the fragment shader to use
         * attributeMapping maps POSITION, NORMAL, and TEXTURE attributes to the
         * attribute names in the shader. This allows the engine to manage the attributes without
         * forcing the shader author to use "standard" names for everything. Defaults to:
         * * POSITION_ATTRIBUTE: "inputPosition"
         * * NORMAL_ATTRIBUTE: "inputNormal"
         * * TEXTURE_ATTRIBUTE: "inputTexture"
         * * COLOR_ATTRIBUTE: "inputColor"
         * * MODEL_MATRIX_ATTRIBUTE: "inputModelMatrix"
         *
         * parameterMapping maps standard parameters to the parameter names in the
         * shader. This allows the engine to manage setting the standard set of parameters on the shader
         * without forcing the shader author to use "standard" names. Defaults to:
         * * MODEL_MATRIX_PARAMETER: "modelMatrix"
         * * VIEW_MATRIX_PARAMETER: "viewMatrix"
         * * PROJECTION_MATRIX_PARAMETER: "projectionMatrix"
         * * CAMERA_POSITION: "cameraPosition"
         * * OUTPUT_ALPHA_PARAMETER: "outputAlpha"
         * * TEXTURE_SAMPLER: "textureSampler"
         * * MODEL_COLOR:"modelColor"
         * * AMBIENT_LIGHT_COLOR: "ambientLightColor"
         * * AMBIENT_CONTRIBUTION:"ambientContribution"
         * * LIGHT_DIRECTION: "lightDirection"
         * * LIGHT_COLOR:"lightColor"
         * * DIFFUSE_CONTRIBUTION:"diffuseContribution"
         * * SPECULAR_CONTRIBUTION:"specularContribution"
         * * SPECULAR_EXPONENT:"specularExponent"
         * @return {Program}
         */
        _.construct = function (parameters) {
            LOG (LogLevel.INFO, "Program: " + parameters.name);

            // default value for the shader names
            parameters.vertexShader = "vertex-" + DEFAULT_VALUE(parameters.vertexShader, parameters.name);
            parameters.fragmentShader = "fragment-" + DEFAULT_VALUE(parameters.fragmentShader, parameters.name);

            // default values for the attribute mapping
            if (!("attributeMapping" in parameters)) {
                parameters.attributeMapping = {
                    POSITION_ATTRIBUTE: "inputPosition",
                    NORMAL_ATTRIBUTE: "inputNormal",
                    TEXTURE_ATTRIBUTE: "inputTexture",
                    COLOR_ATTRIBUTE: "inputColor",
                    MODEL_MATRIX_ATTRIBUTE: "inputModelMatrix"
                };
            }

            // default values for the parameter mapping
            if (!("parameterMapping" in parameters)) {
                parameters.parameterMapping = {
                    MODEL_MATRIX_PARAMETER: "modelMatrix",
                    VIEW_MATRIX_PARAMETER: "viewMatrix",
                    PROJECTION_MATRIX_PARAMETER: "projectionMatrix",
                    CAMERA_POSITION: "cameraPosition",
                    OUTPUT_ALPHA_PARAMETER: "outputAlpha",
                    TEXTURE_SAMPLER: "textureSampler",
                    MODEL_COLOR:"modelColor",
                    AMBIENT_LIGHT_COLOR: "ambientLightColor",
                    AMBIENT_CONTRIBUTION:"ambientContribution",
                    LIGHT_DIRECTION: "lightDirection",
                    LIGHT_COLOR:"lightColor",
                    DIFFUSE_CONTRIBUTION:"diffuseContribution",
                    SPECULAR_CONTRIBUTION:"specularContribution",
                    SPECULAR_EXPONENT:"specularExponent"
                };
            }

            this.currentShape = null;

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
                LOG (LogLevel.ERROR, "Could not initialise shader");
                // XXX do we need to delete it?
            }

            // have to do this before collecting parameters and attributes, or else...
            context.useProgram (program);

            // loop over the found active shader parameters providing setter methods for them, and map
            // the ones we know about
            let parameterMapping = parameters.parameterMapping;
            let reverseParameterMapping = Utility.reverseMap (parameterMapping);
            let standardParameterMapping = this.standardParameterMapping = OBJ;
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
            let attributes = this.attributes = OBJ;
            for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_ATTRIBUTES); i < end; i++) {
                let activeAttribute = context.getActiveAttrib (program, i);
                let activeAttributeName = activeAttribute.name;
                if (activeAttributeName in reverseAttributeMapping) {
                    attributes[reverseAttributeMapping[activeAttributeName]] = ProgramAttribute.new (program, activeAttribute);
                }
            }
        };

        /**
         * set the standard shader parameters in one call.
         *
         * @method setStandardUniforms
         * @param {Object} parameters a mapping of standard parameter names to values, as specified in
         * the initialization of the shader
         * @chainable
         */
        _.setStandardUniforms = function (parameters) {
            let standardParameterMapping = this.standardParameterMapping;
            for (let parameter in parameters) {
                if (parameter in standardParameterMapping) {
                    this[standardParameterMapping[parameter]] (parameters[parameter]);
                }
            }
            return this;
        };

        let bindAttribute = function (scope, which, buffer) {
            // not every shader uses every attribute, so don't bother to set them unless they will be used
            if (which in scope.attributes) {
                context.bindBuffer (context.ARRAY_BUFFER, buffer);
                scope.attributes[which].bind ();
            }
            return scope;
        };

        /**
         * bind the POSITION attribute to the given buffer.
         *
         * @method bindPositionAttribute
         * @param {Object} buffer WebGL buffer to bind
         * @chainable
         */
        _.bindPositionAttribute = function (buffer) {
            return bindAttribute(this, _.POSITION_ATTRIBUTE, buffer);
        };

        /**
         * bind the NORMAL attribute to the given buffer.
         *
         * @method bindNormalAttribute
         * @param {Object} buffer WebGL buffer to bind
         * @chainable
         */
        _.bindNormalAttribute = function (buffer) {
            return bindAttribute(this, _.NORMAL_ATTRIBUTE, buffer);
        };

        /**
         * bind the TEXTURE attribute to the given buffer.
         *
         * @method bindTextureAttribute
         * @param {Object} buffer WebGL buffer to bind
         * @chainable
         */
        _.bindTextureAttribute = function (buffer) {
            // not every shader uses every attribute, so don't bother to set this unless it will be used
            return bindAttribute (this, _.TEXTURE_ATTRIBUTE, buffer);
        };

        /**
         * bind the COLOR attribute to the given buffer.
         *
         * @method bindColorAttribute
         * @param {Object} buffer WebGL buffer to bind
         * @chainable
         */
        _.bindColorAttribute = function (buffer) {
            // not every shader uses every attribute, so don't bother to set this unless it will be used
            return bindAttribute (this, _.COLOR_ATTRIBUTE, buffer);
        };

        /**
         * bind the COLOR attribute to the given buffer.
         *
         * @method bindColorAttribute
         * @param {Object} buffer WebGL buffer to bind
         * @chainable
         */
        _.bindModelMatrixAttribute = function (buffer) {
            // not every shader uses every attribute, so don't bother to set this unless it will be used
            return bindAttribute (this, _.MODEL_MATRIX_ATTRIBUTE, buffer);
        };

        /**
         * disable the enabled buffers.
         *
         * @method unbindAttributes
         * @return {Program}
         */
        _.unbindAttributes = function () {
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
                // if a program is already set, we want to unbind it's buffers to avoid an extraneous
                // buffer connection hanging around in a subsequent draw effect
                if (currentProgram) {
                    currentProgram.unbindAttributes ();
                }

                LOG(LogLevel.TRACE, "Use program: " + this.name);
                currentProgram = this;
                context.useProgram (this.program);

                // reset the current shape to ensure we bind attributes correctly after changing programs
                this.currentShape = null;
            }
            return this;
        };

        _.useShape = function (shape) {
            if (this.currentShape !== shape) {
                LOG(LogLevel.TRACE, "Use shape: " + shape.name);
                this.currentShape = shape;
                return true;
            }
            return false;
        };

        return _;
    } ();

