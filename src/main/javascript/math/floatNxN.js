/**
 * A (square) NxN matrix
 *
 * @class FloatNxN
 */
let FloatNxN = function (dim) {
    let _ = OBJ;
    let _FloatN = FloatN (dim);
    let size = dim * dim;

    let index = _.index = function (row, column) {
        return (row * dim) + column;
    };

    let defineTo = function (to) {
        DEFAULT_VALUE(to, "to");
        return to + " = (typeof " + to + " !== 'undefined') ? " + to + " : _.create ();\n";
    };

    /**
     * Create a new FloatNxN.
     *
     * @method create
     * @static
     * @return {FloatNxN}
     */
    _.create = function () {
        return new Float32Array (size);
    };

    /**
     * Copy contents from an array into a FloatNxN and return the result.
     *
     * @method copy
     * @static
     * @param {FloatNxN} from source.
     * @param {FloatNxN} to destination. if 'to' is omitted, a new one will be created.
     * @return {FloatNxN} returns 'to'.
     */
    eval (function () {
        let str = "_.copy = function (from, to) {\n";
        str += defineTo ();
        for (let row = 0; row < dim; ++row) {
            for (let col = 0; col < dim; ++col) {
                let i = index (row, col);
                str += "to[" + i + "] = from[" + i + "]; ";
            }
            str += "\n";
        }
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

    // _.identity (to)
    // to: FloatNxN
    // sets the values of 'to' to an identity matrix
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval (function () {
        let str = "_.identity = function (to) {\n";
        str += defineTo ();
        for (let row = 0; row < dim; ++row) {
            for (let column = 0; column < dim; ++column) {
                str += "to[" + index (row, column) + "] = " + ((row === column) ? 1 : 0) + "; ";
            }
            str += "\n";
        }
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

    _.IDENTITY = _.identity ();

    // _.transpose (from, to)
    // from: FloatNxN
    // to: FloatNxN
    // transposes the values of 'from' over to 'to'
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval (function () {
        let str = "_.transpose = function (from, to) {\n";
        str += defineTo ();
        for (let row = 0; row < dim; ++row) {
            for (let column = 0; column < dim; ++column) {
                str += "to[" + index (row, column) + "] = from[" + index (column, row) + "]; ";
            }
            str += "\n";
        }
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

    // _.multiply (left, right, to)
    // left: FloatNxN
    // right: FloatNxN
    // to: FloatNxN
    // populates 'to' with the result of matrix multiplication of 'left' and 'right'
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval (function () {
        let rc = function (r, c) {
            let str = "(left[" + index (r, 0) + "] * right[" + index (0, c) + "])";
            for (let i = 1; i < dim; ++i) {
                str += " + (left[" + index (r, i) + "] * right[" + index (i, c) + "])";
            }
            str += ";\n";
            return str;
        };

        let str = "_.multiply = function (left, right, to) {\n";
        str += defineTo ();
        for (let row = 0; row < dim; ++row) {
            for (let column = 0; column < dim; ++column) {
                str += "to[" + index (row, column) + "] = " + rc (row, column);
            }
        }
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

    _.chain = function (...args) {
        let result = args[0];
        for (let index = 1, end = args.length; index < end; ++index) {
            let next = args[index];
            result = _.multiply(result, next);
        }
        return result;
    };

    // _.scale (scale, to)
    // scale: Float or FloatN
    // to: FloatNxN
    // sets the values of 'to' to a scale matrix
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval(function () {
        let end = dim - 1;
        let str = "_.scale = function (scale, to) {\n";
        str += "scale = Array.isArray(scale) ? scale : Array(" + end + ").fill(scale);\n";
        str += "to = _.identity (to);\n";
        for (let i = 0; i < end; ++i) {
            str += "to[" + index(i, i) + "] = scale[" + i + "]; ";
        }
        str += "\n";
        str += "return to;\n";
        str += "};\n";
        return str;
    }());

    // _.translate (translate, to)
    // translate: FloatN
    // to: FloatNxN
    // sets the values of 'to' to a translation matrix
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval(function () {
        let end = dim - 1;
        let str = "_.translate = function (translate, to) {\n";
        str += "to = _.identity (to);\n";
        for (let i = 0; i < end; ++i) {
            str += "to[" + index(end, i) + "] = translate[" + i + "]; ";
        }
        str += "\n";
        str += "return to;\n";
        str += "};\n";
        return str;
    }());

    // _.str (from)
    // from: FloatNxN
    // returns the string representation of the matrix
    eval (function () {
        let strRow = function (row) {
            let str = "'(' + from[" + index (row, 0) + "]";
            for (let column = 1; column < dim; ++column) {
                str += " + ', ' + from[" + index (row, column) + "]";
            }
            str += " + ')'";
            return str;
        };

        let str = "_.str = function (from) {\n";
        str += "return ";
        str += strRow (0);
        for (let row = 1; row < dim; ++row) {
            str += " + ', ' + " + strRow (row);
        }
        str += ";\n";
        str += "};\n";
        return str;
    } ());

    return _;
};

