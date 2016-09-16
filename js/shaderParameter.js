"use strict;"

var ShaderParameter = function () {
    var _ = Object.create (null);

    _.construct = function (program, i) {
        var activeUniform = webgl.getActiveUniform(program, i);
        this.name = activeUniform.name;
        this.type = activeUniform.type;
        this.location = webgl.getUniformLocation(program, activeUniform.name);
        return this;
    };

    _.set = function (value) {
        // see https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.1 (5.14) for explanation
        switch (this.type) {
            case 0x1404: webgl.uniform1i (this.location, value); break;
            case 0x8B53: webgl.uniform2iv (this.location, value); break;
            case 0x8B54: webgl.uniform3iv (this.location, value); break;
            case 0x8B55: webgl.uniform4iv (this.location, value); break;

            case 0x1406: webgl.uniform1f (this.location, value); break;
            case 0x8B50: webgl.uniform2fv (this.location, value); break;
            case 0x8B51: webgl.uniform3fv (this.location, value); break;
            case 0x8B52: webgl.uniform4fv (this.location, value); break;

            case 0x8B5A: webgl.uniformMatrix2fv (this.location, false, value); break;
            case 0x8B5B: webgl.uniformMatrix3fv (this.location, false, value); break;
            case 0x8B5C: webgl.uniformMatrix4fv (this.location, false, value); break;
        }
    };

    return _;
} ();

var makeShaderParameter = function (program, i) {
    return Object.create (ShaderParameter).construct(program, i);
};
