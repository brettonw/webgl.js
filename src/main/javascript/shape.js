var Shape = function () {
    var _ = Object.create (null);
    var currentShape;

    _.construct = function (name, buffers) {
        this.name = name;

        // build the buffers
        if ("vertex" in buffers) {
            this.vertexBuffer = function (vertices) {
                var vertexBuffer = context.createBuffer ();
                context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
                context.bufferData (context.ARRAY_BUFFER, new Float32Array (vertices), context.STATIC_DRAW);
                vertexBuffer.itemSize = 3;
                vertexBuffer.numItems = vertices.length / 3;
                return vertexBuffer;
            } (buffers.vertex);
        }

        if ("index" in buffers) {
            this.indexBuffer = function (indices) {
                var indexBuffer = context.createBuffer ();
                context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, indexBuffer);
                context.bufferData (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices), context.STATIC_DRAW);
                indexBuffer.itemSize = 1;
                indexBuffer.numItems = indices.length;
                return indexBuffer;
            } (buffers.index);
        }

        if ("normal" in buffers) {
        }

        if ("texture" in buffers) {
        }

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
var shapes2 = {};
