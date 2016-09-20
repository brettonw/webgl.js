var Shape = function () {
    var _ = Object.create(null);
    var currentShape;

    _.construct = function (name, buffers) {
        this.name = name;

        // build the vertex and index buffers
        this.vertexBuffer = render.makeVertexBuffer(buffers.vertices);
        this.indexBuffer = render.makeIndexBuffer(buffers.indices);

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
        if (this.setCurrentShape()) {
            context.bindBuffer(context.ARRAY_BUFFER, this.vertexBuffer);
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            Shader.getCurrentShader().bindAttributes();
        }
        context.drawElements(context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
    };

    return _;
} ();

// we use a static cache by name of built shapes
// name (string)
// buffers (function) - returns an object with "vertices" and "indices"
var shapes = Object.create(null);
var makeShape = function (name, buffers) {
    if (! (name in shapes)) {
        shapes[name] = Object.create(Shape).construct(name, buffers ());
    }
    return shapes[name];
};
