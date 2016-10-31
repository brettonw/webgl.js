let FloatN = function (dim) {
    let _ = Object.create (null);

    _.create = function () {
        return new glMatrixArrayType (dim);
    };

    // _.copy (from, to)
    // from: FloatN
    // to: FloatN
    // copies the values of 'from' over to 'to'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.copy = function (from, to) { ";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = from[" + i + "]; ";
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.point (from, to)
    // from: FloatN-1
    // to: FloatN
    // populates 'to' as a homogenous coordinate point of 'from'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.point = function (from, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        let end = dim - 1;
        for (let i = 0; i < end; ++i) {
            str += "to[" + i + "] = from[" + i + "]; ";
        }
        str += "to[" + end + "] = 1; ";
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.vector (from, to)
    // from: FloatN-1
    // to: FloatN
    // populates 'to' as a homogenous coordinate point of 'from'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.vector = function (from, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        let end = dim - 1;
        for (let i = 0; i < end; ++i) {
            str += "to[" + i + "] = from[" + i + "]; ";
        }
        str += "to[" + end + "] = 0; ";
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.dot (left, right)
    // left: FloatN
    // right: FloatN
    // computes the dot produce of 'left' and 'right'
    // returns the Float result
    /**
     *
     */
    eval (function () {
        let str = "_.dot = function (left, right) {";
        str += "return (left[0] * right[0])";
        for (let i = 1; i < dim; ++i) {
            str += " + (left[" + i + "] * right[" + i + "])";
        }
        str += "; ";
        str += "}; ";
        return str;
    } ());

    // _.normSq (from)
    // from: FloatN
    // computes the squared length of the input vector
    // returns the Float result
    /**
     *
     * @param from
     */
    _.normSq = function (from) {
        return _.dot (from, from);
    };

    // _.norm (from)
    // from: FloatN
    // computes the length of the input vector
    // returns the Float result
    /**
     *
     * @param from
     * @return {number}
     */
    _.norm = function (from) {
        return Math.sqrt (_.normSq (from));
    };

    /**
     *
     * @param from
     * @param to
     */
    _.normalize = function (from, to) {
        return _.scale (from, 1 / _.norm (from), to);
    };

    // _.add (left, right, to)
    // left: FloatN
    // right: FloatN
    // to: FloatN
    // sets the values of 'to' to the sum of 'left' and 'right'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.add = function (left, right, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = left[" + i + "] + right[" + i + "]; ";
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.subtract (left, right, to)
    // left: FloatN
    // right: FloatN
    // to: FloatN
    // sets the values of 'to' to the difference of 'left' and 'right'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.subtract = function (left, right, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = left[" + i + "] - right[" + i + "]; ";
        }
        str += "\n";
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

    // _.scale (from, scale, to)
    // from: FloatN
    // scale: Float
    // to: FloatN
    // sets the values of 'to' to a scaled version of 'from'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.scale = function (from, scale, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = from[" + i + "] * scale; ";
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.fixNum (from, precision, to)
    // from: FloatN
    // precision: int
    // to: FloatN
    // sets the values of 'to' to a fixed precision version of 'from'
    // if 'to' is omitted, will create a new vector
    // returns 'to'
    /**
     *
     */
    eval (function () {
        let str = "_.fixNum = function (from, precision, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = Utility.fixNum (from[" + i + "], precision); ";
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.minor
    /**
     *
     */
    eval (function () {
        let str = "_.minor = function (from) {\n";
        str += "let minorIndex = 0, minorValue = from[minorIndex];\n";
        for (let i = 1; i < dim; ++i) {
            str += "nextValue = from[" + i +"]; ";
            str += "if (minorValue > nextValue) { minorIndex = " + i + "; minorValue = nextValue;}; ";
        }
        str += "return minorIndex;\n";
        str += "};\n";
        return str;
    } ());

    // _.major
    /**
     *
     */
    eval (function () {
        let str = "_.major = function (from) {\n";
        str += "let majorIndex = 0, majorValue = from[majorIndex];\n";
        for (let i = 1; i < dim; ++i) {
            str += "nextValue = from[" + i +"]; ";
            str += "if (majorValue < nextValue) { majorIndex = " + i + "; majorValue = nextValue;}; ";
        }
        str += "return majorIndex;\n";
        str += "};\n";
        return str;
    } ());

    // _.str (from)
    // from: FloatN
    // returns the string representation of the from (to 7 significant digits), about 10 miles at
    // 1/16" resolution
    /**
     *
     */
    eval (function () {
        let str = "_.str = function (from) {";
        str += "return '(' + from[0]";
        for (let i = 1; i < dim; ++i) {
            str += " + ', ' +  + from[" + i + "].toFixed (7)";
        }
        str += " + ')'; ";
        str += "}; ";
        return str;
    } ());

    /**
     *
     * @param left
     * @param right
     * @return {boolean}
     */
    _.equals = function (left, right) {
        return _.str (left) == _.str (right);
    };

    return _;
};

let Float2 = function () {
    let _ = FloatN (2);

    /**
     *
     * @param from
     * @param to
     * @return {*}
     */
    _.perpendicular = function (from, to) {
        to = DEFAULT_FUNCTION(to, _.create);
        to[0] = from[1]; to[1] = -from[0];
        return to;
    };

    /**
     *
     * @param left
     * @param right
     * @return {number}
     */
    _.cross = function (left, right) {
        return (left[0] * right[1]) - (left[1] * right[0]);
    };

    return _;
} ();

let Float3 = function () {
    let _ = FloatN (3);

    /**
     *
     * @param left
     * @param right
     * @param to
     * @return {*}
     */
    _.cross = function (left, right, to) {
        to = DEFAULT_FUNCTION(to, _.create);
        to[0] = (left[1] * right[2]) - (left[2] * right[1]);
        to[1] = (left[2] * right[0]) - (left[0] * right[2]);
        to[2] = (left[0] * right[1]) - (left[1] * right[0]);
        return to;
    };

    return _;
} ();

let Float4 = function () {
    let _ = FloatN (4);
    return _;
} ();
