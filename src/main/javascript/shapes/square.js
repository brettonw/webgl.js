let Square = function () {
    let _ = Object.create(Primitive);

    _.name = "square";

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new();

        builder.addVertex([-1, -1, 0]);
        builder.addVertex([-1, 1, 0]);
        builder.addVertex([1, 1, 0]);
        builder.addVertex([1, -1, 0]);

        builder.addFace([2, 1, 3, 1, 0, 3]);

        return builder;
    };

    return _;
}();
