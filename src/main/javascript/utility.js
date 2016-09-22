/**
 * A collection of utility functions.
 *
 * @class Utility
 */
let Utility = function () {
    let _ = Object.create (null);

    /**
     * Convert an angle measured in degrees to radians.
     *
     * @method degreesToRadians
     * @param {float} degrees the degree measure to be converted
     * @return {float}
     */
    _.degreesToRadians = function (degrees) {
        return (degrees / 180) * Math.PI;
    };

    /**
     * Convert an angle measured in radians to degrees.
     *
     * @method radiansToDegrees
     * @param {float} radians the radian measure to be converted
     * @return {float}
     */
    _.radiansToDegrees = function (radians) {
        return (radians / Math.PI) * 180;
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
        let fix = (typeof precision !== "undefined") ? precision : 7;
        return Number.parseFloat (number.toFixed (fix));
    };


    return _;
} ();
