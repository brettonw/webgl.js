let Utility = function () {
    let _ = Object.create (null);

    _.degreesToRadians = function (degrees) {
        return (degrees / 180) * Math.PI;
    };

    _.radiansToDegrees = function (radians) {
        return (radians / Math.PI) * 180;
    };

    _.uppercase = function (string) {
        return string[0].toUpperCase () + string.slice (1);
    };

    _.lowercase = function (string) {
        return string[0].toLowerCase () + string.slice (1);
    };

    _.flatten = function (array) {
        let result = [];
        for (let element of array) {
            for (let value of element) {
                result.push (value);
            }
        }
        return result;
    };

    return _;
} ();
