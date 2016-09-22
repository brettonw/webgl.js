let Cloud = function () {
    let _ = Object.create (Node);

    _.addPoint = function (point) {
        let transform = Float4x4.translate (Float4x4.identity (), point);
        Float4x4.scale (transform, [0.025, 0.025, 0.025]);
        //Float4x4.translate (transform, [-0.5, -0.5, -0.5]);
        this.addChild (Node.new ({
            transform: transform,
            shape: "sphere"
        }));
    };

    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
