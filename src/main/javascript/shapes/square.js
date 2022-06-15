    let Square = $.Square = function () {
        let _ = Object.create(Primitive);

        _.name = "square";

        // override the make from builder to use buffers...
        _.makeFromBuilder = function (name, builder) {
            DEFAULT_VALUE (name, this.name);
            return Shape.new ({
                buffers: function () {
                    return builder.makeBuffers ();
                }
            }, name);
        };

        _.getShapeBuilder = function () {
            let builder = ShapeBuilder.new();

            builder.addVertexNormalTexture([ 1.0,  1.0, 0.0], [0.0, 0.0, 1.0], [1.0, 0.0]);
            builder.addVertexNormalTexture([-1.0,  1.0, 0.0], [0.0, 0.0, 1.0], [0.0, 0.0]);
            builder.addVertexNormalTexture([-1.0, -1.0, 0.0], [0.0, 0.0, 1.0], [0.0, 1.0]);
            builder.addVertexNormalTexture([ 1.0, -1.0, 0.0], [0.0, 0.0, 1.0], [1.0, 1.0]);

            builder.addFace([0, 1, 2, 0, 2, 3]);

            return builder;
        };

        return _;
    }();
