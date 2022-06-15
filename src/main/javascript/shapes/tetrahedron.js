    let Tetrahedron = $.Tetrahedron = function () {
        let _ = Object.create (Primitive);

        _.name = "tetrahedron";

        _.getShapeBuilder = function () {
            let builder = ShapeBuilder.new ();
            builder.addVertex([1, 1, 1]);
            builder.addVertex([-1, 1, -1]);
            builder.addVertex([-1, -1, 1]);
            builder.addVertex([1, -1, -1]);

            builder.addFace([0, 1, 2]);
            builder.addFace([1, 3, 2]);
            builder.addFace([2, 3, 0]);
            builder.addFace([3, 1, 0]);

            return builder;
        };

        return _;
    } ();
