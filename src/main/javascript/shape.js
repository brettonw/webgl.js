var Shape = function () {
    var _ = Object.create(null);
    var currentShape;



    _.construct = function (name, buffers) {
        this.name = name;

        // build the vertex buffer
        this.vertexBuffer = function (vertices) {
            var vertexBuffer = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);
            vertexBuffer.itemSize = 3;
            vertexBuffer.numItems = vertices.length / 3;
            return vertexBuffer;
        } (buffers.vertices);

        // build the index buffer
        this.indexBuffer = function (indices) {
            var indexBuffer = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), webgl.STATIC_DRAW);
            indexBuffer.itemSize = 1;
            indexBuffer.numItems = indices.length;
            return indexBuffer;
        } (buffers.indices);

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
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vertexBuffer);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            Shader.getCurrentShader().bindAttributes();
        }
        webgl.drawElements(webgl.TRIANGLES, this.indexBuffer.numItems, webgl.UNSIGNED_SHORT, 0);
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
