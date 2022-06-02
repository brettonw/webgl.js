/**
 * A collection of utility functions.
 *
 * @class Utility
 */
export let Utility = function () {
    let _ = OBJ;

    const TWO_PI = Math.PI * 2.0;

    let unwind = _.unwind = function (value, cap) {
        value -= Math.floor (value / cap) * cap;
        while (value >= cap) {
            value -= cap;
        }
        while (value < 0) {
            value += cap;
        }
        return value;
    };


    _.unwindRadians = function (radians) {
        return _.unwind (radians, TWO_PI);
    };

    _.unwindDegrees = function (degrees) {
        return _.unwind (degrees, 360.0);
    };

    /**
     * Convert an angle measured in degrees to radians.
     *
     * @method degreesToRadians
     * @param {float} degrees the degree measure to be converted
     * @return {float}
     */
    _.degreesToRadians = function (degrees) {
        return unwind (degrees / 180.0, 2.0) * Math.PI;
    };

    _.cos = function (degrees) {
        return Math.cos (_.degreesToRadians (degrees));
    };

    _.sin = function (degrees) {
        return Math.sin (_.degreesToRadians (degrees));
    };

    _.tan = function (degrees) {
        return Math.tan (_.degreesToRadians (degrees));
    };

    /**
     * Convert an angle measured in radians to degrees.
     *
     * @method radiansToDegrees
     * @param {float} radians the radian measure to be converted
     * @return {float}
     */
    _.radiansToDegrees = function (radians) {
        return (unwind (radians, TWO_PI) / Math.PI) * 180;
    };

    /**
     * Make the first letter of a string be upper case.
     *
     * @method uppercase
     * @param {string} string the text to convert to upper case
     * @return {string}
     */
    _.uppercase = function (string) {
        return string[0].toUpperCase () + string.slice (1);
    };

    /**
     * Make the first letter of a string be lower case.
     *
     * @method lowercase
     * @param {string} string the text to convert to lower case
     * @return {string}
     */
    _.lowercase = function (string) {
        return string[0].toLowerCase () + string.slice (1);
    };

    /**
     * Convert an array of arrays to a single array of values (in order).
     *
     * @method flatten
     * @param {Array} array the input array of arrays
     * @return {Array}
     */
    _.flatten = function (array) {
        let result = [];
        for (let element of array) {
            for (let value of element) {
                result.push (value);
            }
        }
        return result;
    };

    /**
     * truncate a number to a specific precision, equivalent to discretization
     *
     * @method fixNum
     * @param {float} number the number to discretize
     * @param {integer} precision how many decimal places to force
     * @return {number}
     */
    _.fixNum = function (number, precision) {
        DEFAULT_VALUE(precision, 7);
        return Number.parseFloat (number.toFixed (precision));
    };

    /**
     * zero pad a number to a specific width
     *
     * @method padNum
     * @param {number} number the number to pad
     * @param {integer} width how many places the final number should be
     * @param {char} fill the character to pad with (default is "0")
     * @return {*}
     */
    _.padNum = function (number, width, fill) {
        fill = fill || "0";
        number = number + "";
        return number.length >= width ? number : new Array(width - number.length + 1).join(fill) + number;
    }

    /**
     * provide a default value if the requested value is undefined. this is
     * here because the macro doesn't handle multiline values.
     *
     * @method defaultValue
     * @param {any} value the value to test for undefined
     * @param {any} defaultValue the default value to provide if value is undefined
     * @return {any}
     */
    _.defaultValue = function (value, defaultValue) {
        return DEFAULT_VALUE(value, defaultValue);
    };

    /**
     * provide a default value if the requested value is undefined by calling a function. this is
     * here because the macro doesn't handle multiline values.
     *
     * @method defaultFunction
     * @param {any} value the value to test for undefined
     * @param {function} defaultFunction the function to call if value is undefined
     * @return {any}
     */
    _.defaultFunction = function (value, defaultFunction) {
        return DEFAULT_FUNCTION(value, defaultFunction);
    };

    /**
     * create a reversed mapping from a given object (assumes 1:1 values)
     *
     * @method reverseMap
     * @param {object} mapping the the object containing the mapping to be reversed
     * @return {object}
     */
    _.reverseMap = function (mapping) {
        let reverseMapping = OBJ;
        for (let name in mapping) {
            reverseMapping[mapping[name]] = name;
        }
        return reverseMapping;
    };

    return _;
} ();
