var Shape = function () {
    var _ = Object.create (null);
    var currentShape;

    _.construct = function (name, buffers) {
        this.name = name;

        var makeBuffer = function (bufferType, source, itemSize) {
            var buffer = context.createBuffer ();
            context.bindBuffer (bufferType, buffer);
            context.bufferData (bufferType, source, context.STATIC_DRAW);
            buffer.itemSize = itemSize;
            buffer.numItems = source.length / itemSize;
            return buffer;
        };

        // we will use the combination of input
        // 0 vertex only
        // 1 vertex, normal
        // 2 vertex, texture
        // 3 vertex, normal, texture
        // 4 vertex, index
        // 5 vertex, normal, index
        // 6 vertex, texture, index
        // 7 vertex, normal, texture, index

        // build the buffers
        if ("vertex" in buffers) {
            // everything has to have a vertex buffer
            this.vertexBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.vertex), 3);
        }

        if ("normal" in buffers) {
            this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.normal), 3);
        }

        if ("texture" in buffers) {
            this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.texture), 2);
        }

        if ("index" in buffers) {
            this.indexBuffer =  makeBuffer (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (buffers.index), 1);
        }

        var drawFunctions = [
            function () {
                if (this.setCurrentShape ()) {
                    context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
                    Shader.getCurrentShader ().bindAttributes ();
                }
                context.drawArrays(context.TRIANGLES, 0, this.vertexBuffer.numItems);
            },
            function () {
                if (this.setCurrentShape ()) {
                    context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
                    context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    Shader.getCurrentShader ().bindAttributes ();
                }
                context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
            },
        ];
        this.draw = drawFunctions[0];

        return this;
    };

    _.setCurrentShape = function () {
        if (currentShape !== this) {
            currentShape = this;
            return true;
        }
        return false;
    };

    _.draw = function () {
        if (this.setCurrentShape ()) {
            context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            Shader.getCurrentShader ().bindAttributes ();
        }
        context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
    };

    _.new = function (name, buffers) {
        return (shapes[name] = Object.create (_).construct (name, buffers ()));
    };

    return _;
} ();

var shapes = Object.create (null);
