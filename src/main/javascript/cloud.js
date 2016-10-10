/**
 * A Cloud, a scene graph node for displaying points in space.
 *
 * @class Cloud
 */
let Cloud = function () {
    let _ = Object.create (Node);

    /**
     * the initializer for a cloud.
     *
     * @method construct
     * @param {Object} parameters an object with optional information for the cloud node, including:
     * * pointShape: (default = "sphere2")
     * * pointSize: (default = 0.02)
     * @return {Cloud}
     */
    _.construct = function (parameters) {
        // call the superclass constructor on this object
        SUPER.construct.call(this, parameters);

        // look to see if the user has provided a point shape or size to use
        this.pointShape =  ("pointShape" in parameters) ? parameters.pointShape : "sphere2";
        this.pointSize =  ("pointSize" in parameters) ? parameters.pointSize : 0.02;

        return this;
    };

    /**
     * add a point to the cloud.
     *
     * @method addPoint
     * @param {Float3} point the location of the new point.
     * @chainable
     */
    _.addPoint = function (point) {
        let transform = Float4x4.multiply (Float4x4.scale (this.pointSize), Float4x4.translate (point));
        this.addChild (Node.new ({
            transform: transform,
            shape: this.pointShape,
            children: false
        }));
        return this;
    };

    /**
     * add multiple points to the cloud.
     *
     * @method addPoints
     * @param {Array} points an array of Float3 points to be added.
     * @chainable
     */
    _.addPoints = function (points) {
        for (let point of points) {
            this.addPoint(point);
        }
    }

    /**
     * static method to create and construct a new cloud node.
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
