let FloatN = function (dim) {
    let _ = OBJ;

    _.create = function () {
        return new Float32Array(dim);
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
        let str = "_.copy = function (from, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = from[" + i + "];\n";
        }
        str += "return to;\n";
        str += "};\n";
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
        let str = "_.point = function (from, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        let end = dim - 1;
        for (let i = 0; i < end; ++i) {
            str += "to[" + i + "] = from[" + i + "];\n";
        }
        str += "to[" + end + "] = 1;\n";
        str += "return to;\n";
        str += "};\n";
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
        let str = "_.vector = function (from, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        let end = dim - 1;
        for (let i = 0; i < end; ++i) {
            str += "to[" + i + "] = from[" + i + "];\n";
        }
        str += "to[" + end + "] = 0;\n";
        str += "return to;\n";
        str += "};\n";
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
        let str = "_.dot = function (left, right) {\n";
        str += "return (left[0] * right[0])";
        for (let i = 1; i < dim; ++i) {
            str += "\n + (left[" + i + "] * right[" + i + "])";
        }
        str += ";\n";
        str += "};\n";
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
        let n2 = _.normSq (from);
        return (n2 > 0.0) ? ((Math.abs (n2 - 1.0) > 1.0e-6) ? Math.sqrt (n2) : 1.0) : 0.0;
    };

    /**
     *
     * @param from
     * @param to
     */
    _.normalize = function (from, to) {
        let n = _.norm (from);
        return (Math.abs (n - 1.0) > 1.0e-6) ? _.scale (from, 1 / n, to) : _.copy (from, to);
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
        let str = "_.add = function (left, right, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = left[" + i + "] + right[" + i + "];\n";
        }
        str += "return to;\n";
        str += "};\n";
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
            str += "to[" + i + "] = left[" + i + "] - right[" + i + "];\n";
        }
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
        let str = "_.scale = function (from, scale, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = from[" + i + "] * scale;\n";
        }
        str += "return to;\n";
        str += "};\n";
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
        let str = "_.fixNum = function (from, precision, to) {\n";
        str += "to = (typeof to !== 'undefined') ? to : _.create ();\n";
        for (let i = 0; i < dim; ++i) {
            str += "to[" + i + "] = Utility.fixNum (from[" + i + "], precision);\n";
        }
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

    // _.minor
    /**
     *
     */
    eval (function () {
        let str = "_.minor = function (from) {\n";
        str += "let minorIndex = 0, minorValue = from[minorIndex], nextValue;\n";
        for (let i = 1; i < dim; ++i) {
            str += "nextValue = from[" + i +"]; ";
            str += "if (minorValue > nextValue) { minorIndex = " + i + "; minorValue = nextValue;};\n";
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
        str += "let majorIndex = 0, majorValue = from[majorIndex], nextValue;\n";
        for (let i = 1; i < dim; ++i) {
            str += "nextValue = from[" + i +"]; ";
            str += "if (majorValue < nextValue) { majorIndex = " + i + "; majorValue = nextValue;};\n";
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
        let str = "_.str = function (from) {\n";
        str += "return '(' + from[0]";
        for (let i = 1; i < dim; ++i) {
            str += "\n + ', ' +  + from[" + i + "].toFixed (7)";
        }
        str += " + ')';\n";
        str += "};\n";
        return str;
    } ());

    /**
     *
     * @param left
     * @param right
     * @return {boolean}
     */
    _.equals = function (left, right) {
        return _.str (left) === _.str (right);
    };

    return _;
};

export let Float2 = function () {
    let _ = FloatN (2);

    /**
     *
     * @param from
     * @param to
     * @return {*}
     */
    _.perpendicular = function (from, to) {
        to = DEFAULT_FUNCTION(to, _.create);
        to[X] = from[Y]; to[Y] = -from[X];
        return to;
    };

    /**
     *
     * @param left
     * @param right
     * @return {number}
     */
    _.cross = function (left, right) {
        return (left[X] * right[Y]) - (left[Y] * right[X]);
    };

    return _;
} ();

export let Float3 = function () {
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
        to[X] = (left[Y] * right[Z]) - (left[Z] * right[Y]);
        to[Y] = (left[Z] * right[X]) - (left[X] * right[Z]);
        to[Z] = (left[X] * right[Y]) - (left[Y] * right[X]);
        return to;
    };

    return _;
} ();

export let Float4 = function () {
    return FloatN (4);
} ();
