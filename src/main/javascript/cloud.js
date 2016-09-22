let Cloud = function () {
    let _ = Object.create (Node);

    _.addPoint = function (point) {
        let transform = Float4x4.multiply (Float4x4.scale ([0.025, 0.025, 0.025]), Float4x4.translate (point));
        this.addChild (Node.new ({
            transform: transform,
            shape: "sphere",
            children: false
        }));
    };

    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
