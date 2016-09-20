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
        var activeAttribute = context.getActiveAttrib (program, i);
        var name = this.name = activeAttribute.name;
        this.type = activeAttribute.type;
        var location = this.location = context.getAttribLocation (program, name);

        // we use pre-defined names for vertices, texture coords, and normals - and we enable them
        // as arrays with fixed size for rendering purposes
        if (name in arrayTypes) {
            context.enableVertexAttribArray (location);
        }

        return this;
    };

    _.bind = function () {
        // I know the type and size...
        switch (this.type) {
            case 0x1404:
                context.vertexAttribPointer (this.location, 1, context.INT, false, 0, 0);
                break;
            case 0x8B53:
                context.vertexAttribPointer (this.location, 2, context.INT, false, 0, 0);
                break;
            case 0x8B54:
                context.vertexAttribPointer (this.location, 3, context.INT, false, 0, 0);
                break;
            case 0x8B55:
                context.vertexAttribPointer (this.location, 4, context.INT, false, 0, 0);
                break;

            case 0x1406:
                context.vertexAttribPointer (this.location, 1, context.FLOAT, false, 0, 0);
                break;
            case 0x8B50:
                context.vertexAttribPointer (this.location, 2, context.FLOAT, false, 0, 0);
                break;
            case 0x8B51:
                context.vertexAttribPointer (this.location, 3, context.FLOAT, false, 0, 0);
                break;
            case 0x8B52:
                context.vertexAttribPointer (this.location, 4, context.FLOAT, false, 0, 0);
                break;
        }
    };

    _.new = function (program, i) {
        return Object.create (_).construct (program, i);
    };

    return _;
} ();
