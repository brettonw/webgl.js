    let Hexahedron = $.Hexahedron = function () {
        let _ = Object.create(Primitive);

        _.name = "cube";

        _.getShapeBuilder = function () {
            let builder = ShapeBuilder.new();

            builder.addVertex([-1, -1, -1]);
            builder.addVertex([-1, 1, -1]);
            builder.addVertex([1, 1, -1]);
            builder.addVertex([1, -1, -1]);
            builder.addVertex([-1, -1, 1]);
            builder.addVertex([-1, 1, 1]);
            builder.addVertex([1, 1, 1]);
            builder.addVertex([1, -1, 1]);

            builder.addFace([0, 1, 2, 0, 2, 3]);    // Front face
            builder.addFace([7, 6, 5, 7, 5, 4]);    // Back face
            builder.addFace([1, 5, 6, 1, 6, 2]);    // Top face
            builder.addFace([4, 0, 3, 4, 3, 7]);    // Bottom face
            builder.addFace([4, 5, 1, 4, 1, 0]);    // Left face
            builder.addFace([3, 2, 6, 3, 6, 7]);    // Right face

            return builder;
        };

        return _;
    }();
