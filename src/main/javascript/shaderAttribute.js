var ShaderAttribute = function () {
    var _ = Object.create (null);

    var arrayTypes = function (typeNames) {
        var arrayTypes = Object.create (null);
        for (let typeName of typeNames) {
            arrayTypes[typeName] = typeName;
        }
        return arrayTypes;
    } (["inputXYZW", "vertex", "normal", "inputXYZ", "inputABC", "texture", "inputUV"]);

    _.construct = function (program, i) {
        var activeAttribute = webgl.getActiveAttrib(program, i);
        var name = this.name = activeAttribute.name;
        this.type = activeAttribute.type;
        var location = this.location = webgl.getAttribLocation(program, name);

        // we use pre-defined names for vertices, texture coords, and normals - and we enable them
        // as arrays with fixed size for rendering purposes
        if (name in arrayTypes) {
            webgl.enableVertexAttribArray(location);
        }

        return this;
    };

    _.bind = function () {
        // I know the type and size...
        switch (this.type) {
            case 0x1404: webgl.vertexAttribPointer(this.location, 1, webgl.INT, false, 0, 0); break;
            case 0x8B53: webgl.vertexAttribPointer(this.location, 2, webgl.INT, false, 0, 0); break;
            case 0x8B54: webgl.vertexAttribPointer(this.location, 3, webgl.INT, false, 0, 0); break;
            case 0x8B55: webgl.vertexAttribPointer(this.location, 4, webgl.INT, false, 0, 0); break;

            case 0x1406: webgl.vertexAttribPointer(this.location, 1, webgl.FLOAT, false, 0, 0); break;
            case 0x8B50: webgl.vertexAttribPointer(this.location, 2, webgl.FLOAT, false, 0, 0); break;
            case 0x8B51: webgl.vertexAttribPointer(this.location, 3, webgl.FLOAT, false, 0, 0); break;
            case 0x8B52: webgl.vertexAttribPointer(this.location, 4, webgl.FLOAT, false, 0, 0); break;
        }
    };

    return _;
} ();

var makeShaderAttribute = function (program, i) {
    return Object.create (ShaderAttribute).construct(program, i);
};
