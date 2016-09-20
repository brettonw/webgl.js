var Shape = function () {
    var _ = Object.create (null);
    var currentShape;

    _.construct = function (name, buffers) {
        this.name = name;

        // build the vertex and index buffers
        this.vertexBuffer = render.makeVertexBuffer (buffers.vertices);
        this.indexBuffer = render.makeIndexBuffer (buffers.indices);

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
