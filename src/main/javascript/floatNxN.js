let FloatNxN = function (dim) {
    let _ = Object.create (null);
    let _FloatN = FloatN (dim);
    let size = dim * dim;

    let index = function (row, column) {
        return (row * dim) + column;
    };

    _.create = function () {
        return new glMatrixArrayType (size);
    };

    // _.copy (from, to)
    // from: FloatNxN
    // to: FloatNxN
    // copies the values of 'from' over to 'to'
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval (function () {
        let str = "_.copy = function (from, to) { ";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let i = 0; i < size; ++i) {
            str += "to[" + i + "] = from[" + i + "]; ";
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.identity (to)
    // to: FloatNxN
    // sets the values of 'to' to an identity matrix
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval (function () {
        let str = "_.identity = function (to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let row = 0; row < dim; ++row) {
            for (let column = 0; column < dim; ++column) {
                str += "to[" + index (row, column) + "] = " + ((row == column) ? 1 : 0) + "; ";
            }
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    // _.transpose (from, to)
    // from: FloatNxN
    // to: FloatNxN
    // transposes the values of 'from' over to 'to'
    // if 'to' is omitted, will create a new matrix
    // returns 'to'
    eval (function () {
        let str = "_.transpose = function (from, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let row = 0; row < dim; ++row) {
            for (let column = 0; column < dim; ++column) {
                str += "to[" + index (row, column) + "] = from[" + index (column, row) + "]; ";
            }
        }
        str += "return to; ";
        str += "}; ";
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
            str += "; ";
            return str;
        };

        let str = "_.multiply = function (left, right, to) {";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let row = 0; row < dim; ++row) {
            for (let column = 0; column < dim; ++column) {
                str += "to[" + index (row, column) + "] = " + rc (row, column);
            }
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());

    /*
     // _.scale (scale, to)
     // scale: Float or FloatN
     // to: FloatNxN
     // sets the values of 'to' to a scale matrix
     // if 'to' is omitted, will create a new matrix
     // returns 'to'
     eval(function () {
     let str = "_.scale = function (scale, to) {";
     str += "scale = Array.isArray(scale) ? scale : Array(dim).fill(scale); ";
     str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
     str += "_.identity (to); ";
     for (let i = 0; i < dim; ++i) {
     str += "to[" + index(i, i) + "] = scale[" + i + "]; ";
     }
     str += "return to; ";
     str += "}; ";
     return str;
     }());
     */

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

        let str = "_.str = function (from) {";
        str += "return ";
        str += strRow (0);
        for (let row = 1; row < dim; ++row) {
            str += " + ', ' + " + strRow (row);
        }
        str += "; ";
        str += "}; ";
        return str;
    } ());

    return _;
};

