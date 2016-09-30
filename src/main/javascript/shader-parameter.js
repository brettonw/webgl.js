let ShaderParameter = function () {
    let _ = Object.create (null);

    _.construct = function (program, i) {
        let activeUniform = context.getActiveUniform (program, i);
        this.name = activeUniform.name;
        this.type = activeUniform.type;
        this.location = context.getUniformLocation (program, activeUniform.name);
        this.lastValue = "Invalid last value to force refresh on first load.";
        LOG ("Shader parameter: " + this.name + " (type 0x" + this.type.toString(16) + ")");
        return this;
    };

    _.set = function (value) {
        if (value !== this.lastValue) {
            // see https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.1 (5.14) for explanation
            switch (this.type) {
                case 0x1404:
                    context.uniform1i (this.location, value);
                    break;
                case 0x8B53:
                    context.uniform2iv (this.location, value);
                    break;
                case 0x8B54:
                    context.uniform3iv (this.location, value);
                    break;
                case 0x8B55:
                    context.uniform4iv (this.location, value);
                    break;

                case 0x1406:
                    context.uniform1f (this.location, value);
                    break;
                case 0x8B50:
                    context.uniform2fv (this.location, value);
                    break;
                case 0x8B51:
                    context.uniform3fv (this.location, value);
                    break;
                case 0x8B52:
                    context.uniform4fv (this.location, value);
                    break;

                case 0x8B5A:
                    context.uniformMatrix2fv (this.location, false, value);
                    break;
                case 0x8B5B:
                    context.uniformMatrix3fv (this.location, false, value);
                    break;
                case 0x8B5C:
                    context.uniformMatrix4fv (this.location, false, value);
                    break;

                case 0x8B5E:
                    // I wonder if this will need to be unbound
                    context.activeTexture (context.TEXTURE0);
                    context.bindTexture (context.TEXTURE_2D, Texture.get (value).texture);
                    context.uniform1i (this.location, 0);
                    break;
            }
            this.lastValue = value;
        }
    };

    _.new = function (program, i) {
        return Object.create (_).construct (program, i);
    };

    return _;
} ();
