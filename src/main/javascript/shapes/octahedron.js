    let Octahedron = $.Octahedron = function () {
        let _ = Object.create(Primitive);

        _.name = "octahedron";

        _.getShapeBuilder = function () {
            let builder = ShapeBuilder.new();

            builder.addVertex([0, 1, 0]);
            builder.addVertex([1, 0, 0]);
            builder.addVertex([0, 0, 1]);
            builder.addVertex([-1, 0, 0]);
            builder.addVertex([0, 0, -1]);
            builder.addVertex([0, -1, 0]);

            builder.addFace([0, 2, 1]);
            builder.addFace([0, 3, 2]);
            builder.addFace([0, 4, 3]);
            builder.addFace([0, 1, 4]);


            builder.addFace([5, 1, 2]);
            builder.addFace([5, 2, 3]);
            builder.addFace([5, 3, 4]);
            builder.addFace([5, 4, 1]);

            return builder;
        };

        return _;
    }();
