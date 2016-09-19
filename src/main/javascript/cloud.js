var Cloud = function () {
    var _ = Object.create (Node);

    _.addPoint = function (point) {
        var transform = Float4x4.translate(Float4x4.identity(), point);
        Float4x4.scale(transform, [0.025, 0.025, 0.025]);
        Float4x4.translate(transform, [-0.5, -0.5, -0.5]);
        var node = makeNode ({ transform: transform, shape: "sphere" });
        this.addChild(node);
    };

    return _;
} ();

var makeCloud = function () {
    return Object.create (Cloud).construct ();
};
