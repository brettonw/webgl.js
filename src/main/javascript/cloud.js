/**
 * A Cloud, a scene graph node for displaying points in space.
 *
 * @class Cloud
 */
let Cloud = function () {
    let _ = Object.create (Node);

    /**
     * Add a point to the cloud
     *
     * @method addPoint
     * @param {Float3} point the location of the new point.
     * @chainable
     */
    _.addPoint = function (point) {
        let transform = Float4x4.multiply (Float4x4.scale ([0.025, 0.025, 0.025]), Float4x4.translate (point));
        this.addChild (Node.new ({
            transform: transform,
            shape: "sphere",
            children: false
        }));
        return this;
    };

    /**
     * Static method to create and construct a new cloud node.
     *
     * @method new
     * @static
     * @param {Object} parameters an object with optional information to include in the node (see
     * "Node.construct" for more information)
     * @return {Cloud}
     */
    _.new = function (parameters) {
        // ensure that we have children enabled
        parameters.children = true;
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
