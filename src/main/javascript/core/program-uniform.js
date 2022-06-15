    let ProgramUniform = function () {
        let _ = OBJ;

        _.construct = function (program, i) {
            let activeUniform = context.getActiveUniform (program, i);
            this.name = activeUniform.name;
            this.type = activeUniform.type;
            this.location = context.getUniformLocation (program, activeUniform.name);

            // XXX temporarily store texture indices on the program (subversive actions here)
            if (this.type === context.SAMPLER_2D) {
                this.textureIndex = ("nextTextureIndex" in program) ? program.nextTextureIndex : 0;
                program.nextTextureIndex = this.textureIndex + 1;
                LOG (LogLevel.TRACE, "Program uniform: " + this.name + " (type 0x" + this.type.toString(16) + ") at index " + this.textureIndex);
            } else {
                LOG (LogLevel.TRACE, "Program uniform: " + this.name + " (type 0x" + this.type.toString(16) + ")");
            }
            return this;
        };

        _.set = function (value) {
            LOG(LogLevel.TRACE, "Set uniform: " + this.name);
            // see https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.1 (5.14) for explanation
            switch (this.type) {
                case 0x1404: // context.INT
                    context.uniform1i (this.location, value);
                    break;
                case 0x8B53: // context.INT_VEC2
                    context.uniform2iv (this.location, value);
                    break;
                case 0x8B54: // context.INT_VEC3
                    context.uniform3iv (this.location, value);
                    break;
                case 0x8B55: // context.INT_VEC4
                    context.uniform4iv (this.location, value);
                    break;

                case 0x1406: // context.FLOAT
                    context.uniform1f (this.location, value);
                    break;
                case 0x8B50: // context.FLOAT_VEC2
                    context.uniform2fv (this.location, value);
                    break;
                case 0x8B51: // context.FLOAT_VEC3
                    context.uniform3fv (this.location, value);
                    break;
                case 0x8B52: // context.FLOAT_VEC4
                    context.uniform4fv (this.location, value);
                    break;

                case 0x8B5A: // context.FLOAT_MAT2
                    context.uniformMatrix2fv (this.location, false, value);
                    break;
                case 0x8B5B: // context.FLOAT_MAT3
                    context.uniformMatrix3fv (this.location, false, value);
                    break;
                case 0x8B5C: // context.FLOAT_MAT4
                    context.uniformMatrix4fv (this.location, false, value);
                    break;

                case 0x8B5E: // context.SAMPLER_2D
                    // TEXTURE0 is a constant, up to TEXTURE31 (just incremental adds to TEXTURE0)
                    // XXX I wonder if this will need to be unbound
                    context.activeTexture (context.TEXTURE0 + this.textureIndex);
                    context.bindTexture (context.TEXTURE_2D, Texture.get (value).texture);
                    context.uniform1i (this.location, this.textureIndex);
                    break;
            }
        };

        _.new = function (program, i) {
            return Object.create (_).construct (program, i);
        };

        return _;
    } ();
