let Camera = function () {
    let _ = Object.create (null);

    _.apply = function (standardUniforms) {
        // set the standard uniforms for the perspective transformation matrix and the view
        // transformation matrix
    };


    _.viewMatrix = function () {

    };

    _.projectionMatrix = function (node) {

    };

    /**
     *
     * @param focalLength
     * @param filmSize
     */
    _lens.computeFov = function (focalLength, filmSize) {
        let fov = 2.0 * Math.atan2 (filmSize * 0.5, focalLength);
    };

    _.lookFromTo = function (from, to, fov) {

    };

    _.new = function (parameters) {
        return
    };

    return _;
} ();
