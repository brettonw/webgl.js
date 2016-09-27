/**
 * A Cloud, a scene graph node for displaying points in space.
 *
 * @class Cloud
 */
let Cloud = function () {
    let _ = Object.create (Node);

    /**
     * the initializer for a shader.
     *
     * @method new
     * @param {string} name name to retrieve this shader
     * @param {string} vertexShaderUrl url to the vertex shader GLSL file
     * @param {string} fragmentShaderUrl url to the fragment shader GLSL file
     * @param {Object} attributeMapping maps standard attribute names to the names used in the shader
     * @param {Object} parameterMapping maps standard parameter names to the names used in the shader
     * @return {Shader}
     */
    _.construct = function (parameters) {
        // call the superclass constructor on this object
        Object.getPrototypeOf(_).construct.call(this, parameters);

        // look to see if the user has provided a point shape or size to use
        this.pointShape =  ("pointShape" in parameters) ? parameters.pointShape : "sphere2";
        this.pointSize =  ("pointSize" in parameters) ? parameters.pointSize : [0.02, 0.02, 0.02];

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
