var ShaderParameter = function () {
    var _ = Object.create (null);

    _.construct = function (program, i) {
        var activeUniform = context.getActiveUniform(program, i);
        this.name = activeUniform.name;
        this.type = activeUniform.type;
        this.location = context.getUniformLocation(program, activeUniform.name);
        return this;
    };

    _.set = function (value) {
        // see https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.1 (5.14) for explanation
        switch (this.type) {
            case 0x1404: context.uniform1i (this.location, value); break;
            case 0x8B53: context.uniform2iv (this.location, value); break;
            case 0x8B54: context.uniform3iv (this.location, value); break;
            case 0x8B55: context.uniform4iv (this.location, value); break;

            case 0x1406: context.uniform1f (this.location, value); break;
            case 0x8B50: context.uniform2fv (this.location, value); break;
            case 0x8B51: context.uniform3fv (this.location, value); break;
            case 0x8B52: context.uniform4fv (this.location, value); break;

            case 0x8B5A: context.uniformMatrix2fv (this.location, false, value); break;
            case 0x8B5B: context.uniformMatrix3fv (this.location, false, value); break;
            case 0x8B5C: context.uniformMatrix4fv (this.location, false, value); break;
        }
    };

    return _;
} ();

var makeShaderParameter = function (program, i) {
    return Object.create (ShaderParameter).construct(program, i);
};
