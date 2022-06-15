    let Icosahedron = $.Icosahedron = function () {
        let _ = Object.create(Primitive);

        _.name = "icosahedron";

        _.getShapeBuilder = function () {
            let builder = ShapeBuilder.new();
            let t = (1.0 + Math.sqrt(5.0)) / 2.0;
            let s = 1 / t;
            t = 1;

            builder.addVertex([-s, t, 0]);
            builder.addVertex([s, t, 0]);
            builder.addVertex([-s, -t, 0]);
            builder.addVertex([s, -t, 0]);

            builder.addVertex([0, -s, t]);
            builder.addVertex([0, s, t]);
            builder.addVertex([0, -s, -t]);
            builder.addVertex([0, s, -t]);

            builder.addVertex([t, 0, -s]);
            builder.addVertex([t, 0, s]);
            builder.addVertex([-t, 0, -s]);
            builder.addVertex([-t, 0, s]);

            builder.addFace([0, 11, 5]);
            builder.addFace([0, 5, 1]);
            builder.addFace([0, 1, 7]);
            builder.addFace([0, 7, 10]);
            builder.addFace([0, 10, 11]);

            builder.addFace([1, 5, 9]);
            builder.addFace([5, 11, 4]);
            builder.addFace([11, 10, 2]);
            builder.addFace([10, 7, 6]);
            builder.addFace([7, 1, 8]);

            builder.addFace([3, 9, 4]);
            builder.addFace([3, 4, 2]);
            builder.addFace([3, 2, 6]);
            builder.addFace([3, 6, 8]);
            builder.addFace([3, 8, 9]);

            builder.addFace([4, 9, 5]);
            builder.addFace([2, 4, 11]);
            builder.addFace([6, 2, 10]);
            builder.addFace([8, 6, 7]);
            builder.addFace([9, 8, 1]);

            return builder;
        };

        return _;
    }();
