"use strict;"
// class hierarchy


// default values...


let LogLevel = function () {
    let _ = Object.create (null);

    _.TRACE = 0;
    _.INFO = 1;
    _.WARNNG = 2;
    _.ERROR = 3;

    // default
    let logLevel = _.ERROR;

    _.set = function (newLogLevel) {
        logLevel = newLogLevel;
    };

    let formatStrings = ["TRC", "INF", "WRN", "ERR"];
    _.say = function (messageLogLevel, message) {
        if (messageLogLevel >= logLevel) {
            console.log (formatStrings[messageLogLevel] + ": " + message)
        }
    };

    _.trace = function (message) {
        this.say (_.TRACE, message);
    };

    _.info = function (message) {
        this.say (_.INFO, message);
    };

    _.warn = function (message) {
        this.say (_.WARNNG, message);
    };

    _.error = function (message) {
        this.say (_.ERROR, message);
    };

    return _;
} ();

LogLevel.set (LogLevel.INFO);
let OnReady = function () {
    let _ = Object.create (null);

    _.construct = function (scope, callback) {
        this.scope = scope;
        this.callback = callback;
        return this;
    };

    _.notify = function (parameter) {
        this.callback.call (this.scope, parameter);
    };

    _.new = function (scope, callback) {
        return Object.create (_).construct(scope, callback);
    };

    return _;
} ();
"use strict;"

let MouseTracker = function () {
    let _ = Object.create (null);

    let mouseDownPosition;
    let bound;
    let onReady;
    let stepSize;

    let mousePosition = function (event) {
        return {
            x: (event.clientX - bound.left) / bound.width,
            y: (event.clientY - bound.top) / bound.height
        };
    }

    let mouseMoved = function (event) {
        let mouseMovedPosition = mousePosition(event);
        let deltaPosition = [
            mouseMovedPosition.x - mouseDownPosition.x,
            mouseMovedPosition.y - mouseDownPosition.y
        ];
        mouseDownPosition = mouseMovedPosition;
        onReady.notify (deltaPosition);
    };

    let mouseUp = function (event) {
        window.removeEventListener("mousemove", mouseMoved, false);
        window.removeEventListener("mouseup", mouseUp, false);
    };

    let mouseDown = function (event) {
        //getting mouse position correctly
        mouseDownPosition = mousePosition(event);
        window.addEventListener("mousemove", mouseMoved, false);
        window.addEventListener("mouseup", mouseUp, false);
    };

    let KEY_LEFT = 37;
    let KEY_RIGHT = 39;

    let keyDown = function (event) {
        switch (event.keyCode) {
            case KEY_LEFT: onReady.notify ([-stepSize, 0.0]); break;
            case KEY_RIGHT: onReady.notify ([stepSize, 0.0]); break;
            default: onReady.notify ([0.0, 0.0]); break;
        }
    };

    _.construct = function (canvasId, onReadyIn, stepSizeIn) {
        onReady = onReadyIn;
        stepSize = (((typeof stepSizeIn !== "undefined") && (stepSizeIn != null)) ? stepSizeIn : 0.05);

        let canvas = document.getElementById(canvasId);

        bound = canvas.getBoundingClientRect();
        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("keydown", keyDown, true);
        canvas.focus();
    };

    _.new = function (canvasId, onReadyIn, stepSizeIn) {
        return Object.create (_).construct(canvasId, onReadyIn, stepSizeIn);
    };

    return _;
} ();
/**
 * A loader for external assets.
 *
 * @class Loader
 */
let Loader = function () {
    let _ = Object.create (null);

    /**
     * the initializer for a loader.
     *
     * @method construct
     * @param {Object} parameters an object specifying callback parameters (see "new")
     * @return {Loader}
     */
    _.construct = function (parameters) {
        this.onFinishedAll = (((typeof parameters.onFinishedAll !== "undefined") && (parameters.onFinishedAll != null)) ? parameters.onFinishedAll : { notify: function (x) {} });
        this.onFinishedItem = (((typeof parameters.onFinishedItem !== "undefined") && (parameters.onFinishedItem != null)) ? parameters.onFinishedItem : { notify: function (x) {} });
        this.items = [];
        return this;
    };

    _.addItem = function (type, name, url, parameters) {
        let item = { type: type, name: name, url: url, parameters: parameters };
        this.items.push (item);
        return this;
    };

    _.finish = function (finishedItem) {
        if (finishedItem === this.pendingItem) {
            // clear the pending item, and go
            delete this.pendingItem;
            this.onFinishedItem.notify(finishedItem);
            this.next ();
        } else {
            LogLevel.say (LogLevel.ERROR, "WHAT'S UP WILLIS?");
        }
    };

    /**
     * start the fetch process for all the loadable items.
     *
     * @method go
     * @param {Object} parameters an object specifying the scope and callback to call when an item
     * is finished, and when all items are finished (onFinishedAll, onFinishedItem).
     * @chainable
     */
    _.go = function (onFinishedEach, onFinishedAll) {
        this.onFinishedEach = (((typeof onFinishedEach !== "undefined") && (onFinishedEach != null)) ? onFinishedEach : { notify: function (x) {} });
        this.onFinishedAll = (((typeof onFinishedAll !== "undefined") && (onFinishedAll != null)) ? onFinishedAll : { notify: function (x) {} });
        this.next ();
    };

    /**
     * continue the fetch process for all the loadable items.
     *
     * @method next
     * @chainable
     */
    _.next = function () {
        if (this.items.length > 0) {
            // have work to do, kick off a fetch
            let item = this.items.shift ();
            this.pendingItem = item.type.new (item.name, item.url, item.parameters, OnReady.new (this, this.finish));
        } else {
            // all done, inform our waiting handler
            this.onFinishedAll.notify (this);
        }
    };

    /**
     * static method to create and construct a new Loader.
     *
     * @method new
     * @static
     * @param {Object} parameters an object specifying the scope and callback to call when an item
     * is finished, and when all items are finished (onFinishedAll, onFinishedItem).
     * @return {Loader}
     */
    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
/**
 * A loader for external assets, which assumes assets reside in a common base path, and are named as
 * the file element is named.
 *
 * @class LoaderPath
 */
let LoaderPath = function () {
    let _ = Object.create (Loader);

    /**
     * the initializer for a path loader.
     *
     * @method construct
     * @param {Object} parameters an object specifying the loader class parameters
     * @return {Loader}
     */
    _.construct = function (parameters) {
        Object.getPrototypeOf(_).construct.call(this, parameters);
        this.type = parameters.type;
        this.path = parameters.path;
        return this;
    };

    _.addItems = function (names, parameters) {
        names = Array.isArray(names) ? names : Array(1).fill(names);
        for (let name of names) {
            let url = this.path.replace ("@", name);
            Object.getPrototypeOf(_).addItem.call(this, this.type, name, url, parameters);
        }
        return this;
    };

    /**
     * static method to create and construct a new LoaderPath.
     *
     * @method new
     * @static
     * @param {Object} parameters an object including Loader class parameters, as well as the type
     * and path to use for all operations. The "path" parameter should contain a "@" to be replaced
     * with the fetch name.
     * @return {LoaderPath}
     */
    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
/**
 * A loader for external shader assets.
 *
 * @class LoaderShader
 */
let LoaderShader = function () {
    let _ = Object.create (LoaderPath);

    /**
     * the initializer for a shader loader.
     *
     * @method construct
     * @param {string} path the common path for a path loader.
     * @return {LoaderShader}
     */
    _.construct = function (path) {
        return Object.getPrototypeOf(_).construct.call(this, { type: Shader, path: path });
    };

    let addNames = function (names, prefix) {
        names = Array.isArray(names) ? names : Array(1).fill(names);
        let result = [];
        for (let name of names) {
            result.push (prefix + "-" + name);
        }
        return result;
    }

    _.addVertexShaders = function (names) {
        return Object.getPrototypeOf(_).addItems.call (this, addNames (names, "vertex"), { type: context.VERTEX_SHADER });
    };

    _.addFragmentShaders = function (names) {
        return Object.getPrototypeOf(_).addItems.call (this, addNames (names, "fragment"), { type: context.FRAGMENT_SHADER });
    };

    /**
     * static method to create and construct a new LoaderPath.
     *
     * @method new
     * @static
     * @param {string} path the common path for a path loader.
     * @return {LoaderShader}
     */
    _.new = function (path) {
        return Object.create (_).construct (path);
    };

    return _;
} ();
let context;

/**
 * A Rendering context.
 *
 * @class Render
 */
let Render = function () {
    let _ = Object.create (null);

    /**
     * The initializer for a rendering context.
     *
     * @method construct
     * @param {string} canvasId the id of the canvas element to use for the rendering context
     * @return {Render}
     */
    _.construct = function (canvasId, aspectRatio) {
        let canvas = this.canvas = document.getElementById (canvasId);
        aspectRatio = (((typeof aspectRatio !== "undefined") && (aspectRatio != null)) ? aspectRatio : 16.0 / 9.0);

        // high DPI devices need to have the canvas drawing surface scaled up while leaving the style
        // size as indicated
        let width = canvas.width;
        let height = width / aspectRatio;

        // get the display size of the canvas.
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // set the size of the drawingBuffer
        let devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        LogLevel.say (LogLevel.TRACE, "Scaling display at " + devicePixelRatio + ":1 to (" + canvas.width + "x" + canvas.height + ")");

        // get the actual rendering context
        context = this.context = canvas.getContext ("webgl", { preserveDrawingBuffer: true, alpha: false });
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        context.viewport (0, 0, context.viewportWidth, context.viewportHeight);

        // make some shapes we might use
        Tetrahedron.make();
        Hexahedron.make();
        Octahedron.make();
        Icosahedron.make();
        Square.make();
        Sphere.makeN(2);
        Sphere.makeN(3);
        Sphere.makeN(5);

        return this;
    };

    /**
     * Set the global rendering context.
     *
     * @method use
     */
    _.use = function () {
        context = this.context;
    };

    /**
     * Static method to create and construct a new rendering context.
     *
     * @method new
     * @static
     * @param {string} canvasId the id of the canvas element to use for the rendering context.
     * @param {number} aspectRatio the width / height of the canvas.
     * @return {Render}
     */
    _.new = function (canvasId, aspectRatio) {
        return (render = Object.create (_).construct (canvasId, aspectRatio));
    };

    return _;
} ();
let glMatrixArrayType = ((typeof Float32Array) != "undefined") ? Float32Array : ((typeof WebGLFloatArray) != "undefined") ? WebGLFloatArray : Array;
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
        to = (((typeof to !== "undefined") && (to != null)) ? to : _.create ());
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
        to = (((typeof to !== "undefined") && (to != null)) ? to : _.create ());
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
/**
 * A (square) NxN matrix
 *
 * @class FloatNxN
 */
let FloatNxN = function (dim) {
    let _ = Object.create (null);
    let _FloatN = FloatN (dim);
    let size = dim * dim;

    let index = _.index = function (row, column) {
        return (row * dim) + column;
    };

    let defineTo = function (to) {
        to = (((typeof to !== "undefined") && (to != null)) ? to : "to");
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
        return new glMatrixArrayType (size);
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
                str += "to[" + index (row, column) + "] = " + ((row == column) ? 1 : 0) + "; ";
            }
            str += "\n";
        }
        str += "return to;\n";
        str += "};\n";
        return str;
    } ());

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

/**
 * A 4x4 matrix used as a 3D transformation
 *
 * @class Float4x4
 * @extends FloatNxN
 */
let Float4x4 = function () {
    let dim = 4;
    let _ = FloatNxN (dim);

    /**
     *
     * @param from
     * @param to
     * @return {*}
     */
    _.inverse = function (from, to) {
        // adapted from a bit of obfuscated, unwound, code
        to = (((typeof to !== "undefined") && (to != null)) ? to : _.create ());
        let A = from[0] * from[5] - from[1] * from[4], B = from[0] * from[6] - from[2] * from[4],
            C = from[9] * from[14] - from[10] * from[13], D = from[9] * from[15] - from[11] * from[13],
            E = from[10] * from[15] - from[11] * from[14], F = from[0] * from[7] - from[3] * from[4],
            G = from[1] * from[6] - from[2] * from[5], H = from[1] * from[7] - from[3] * from[5],
            K = from[2] * from[7] - from[3] * from[6], L = from[8] * from[13] - from[9] * from[12],
            M = from[8] * from[14] - from[10] * from[12], N = from[8] * from[15] - from[11] * from[12],
            Q = 1 / (A * E - B * D + F * C + G * N - H * M + K * L);
        to[0] = (from[5] * E - from[6] * D + from[7] * C) * Q;
        to[1] = (-from[1] * E + from[2] * D - from[3] * C) * Q;
        to[2] = (from[13] * K - from[14] * H + from[15] * G) * Q;
        to[3] = (-from[9] * K + from[10] * H - from[11] * G) * Q;
        to[4] = (-from[4] * E + from[6] * N - from[7] * M) * Q;
        to[5] = (from[0] * E - from[2] * N + from[3] * M) * Q;
        to[6] = (-from[12] * K + from[14] * F - from[15] * B) * Q;
        to[7] = (from[8] * K - from[10] * F + from[11] * B) * Q;
        to[8] = (from[4] * D - from[5] * N + from[7] * L) * Q;
        to[9] = (-from[0] * D + from[1] * N - from[3] * L) * Q;
        to[10] = (from[12] * H - from[13] * F + from[15] * A) * Q;
        to[11] = (-from[8] * H + from[9] * F - from[11] * A) * Q;
        to[12] = (-from[4] * C + from[5] * M - from[6] * L) * Q;
        to[13] = (from[0] * C - from[1] * M + from[2] * L) * Q;
        to[14] = (-from[12] * G + from[13] * B - from[14] * A) * Q;
        to[15] = (from[8] * G - from[9] * B + from[10] * A) * Q;
        return to;
    };

    /**
     *
     * @param f4
     * @param f4x4
     * @param to
     * @return {*}
     */
    _.preMultiplyFloat4 = function (f4, f4x4, to) {
        to = (((typeof to !== "undefined") && (to != null)) ? to : Float4.create ());
        let f40 = f4[0], f41 = f4[1], f42 = f4[2], f43 = f4[3];
        to[0] = (f4x4[0] * f40) + (f4x4[4] * f41) + (f4x4[8] * f42) + (f4x4[12] * f43);
        to[1] = (f4x4[1] * f40) + (f4x4[5] * f41) + (f4x4[9] * f42) + (f4x4[13] * f43);
        to[2] = (f4x4[2] * f40) + (f4x4[6] * f41) + (f4x4[10] * f42) + (f4x4[14] * f43);
        to[3] = (f4x4[3] * f40) + (f4x4[7] * f41) + (f4x4[11] * f42) + (f4x4[15] * f43);
        return to;
    };

    /**
     *
     * @param f4x4
     * @param f4
     * @param to
     * @return {*}
     */
    _.postMultiplyFloat4 = function (f4x4, f4, to) {
        to = (((typeof to !== "undefined") && (to != null)) ? to : Float4.create ());
        let f40 = f4[0], f41 = f4[1], f42 = f4[2], f43 = f4[3];
        to[0] = (f4x4[0] * f40) + (f4x4[1] * f41) + (f4x4[2] * f42) + (f4x4[3] * f43);
        to[1] = (f4x4[4] * f40) + (f4x4[5] * f41) + (f4x4[6] * f42) + (f4x4[7] * f43);
        to[2] = (f4x4[8] * f40) + (f4x4[9] * f41) + (f4x4[10] * f42) + (f4x4[11] * f43);
        to[3] = (f4x4[12] * f40) + (f4x4[13] * f41) + (f4x4[14] * f42) + (f4x4[15] * f43);
        return to;
    };

    /**
     *
     * @param angle
     */
    _.rotateX = function (angle) {
        let to = _.identity ();
        to[5] = to[10] = Math.cos (angle);
        to[9] = -(to[6] = Math.sin (angle));
        return to;
    };

    /**
     *
     * @param angle
     */
    _.rotateY = function (angle) {
        let to = _.identity ();
        to[0] = to[10] = Math.cos (angle);
        to[2] = -(to[8] = Math.sin (angle));
        return to;
    };

    /**
     *
     * @param angle
     */
    _.rotateZ = function (angle) {
        let to = _.identity ();
        to[0] = to[5] = Math.cos (angle);
        to[4] = -(to[1] = Math.sin (angle));
        return to;
    };

    /**
     *
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     * @param to
     * @return {*}
     */
    let frustum = function (left, right, bottom, top, near, far, to) {
        to = (((typeof to !== "undefined") && (to != null)) ? to : _.create ());
        let width = right - left, height = top - bottom, depth = far - near;
        to[0] = (near * 2) / width; to[1] = 0; to[2] = 0; to[3] = 0;
        to[4] = 0; to[5] = (near * 2) / height; to[6] = 0; to[7] = 0;
        to[8] = (right + left) / width; to[9] = (top + bottom) / height; to[10] = -(far + near) / depth; to[11] = -1;
        to[12] = 0; to[13] = 0; to[14] = (-2.0 * far * near) / depth; to[15] = 0;
        return to;
    };
    _.frustum = frustum;

    /**
     *
     * @param fov
     * @param aspectRatio
     * @param nearPlane
     * @param farPlane
     * @param to
     */
    _.perspective = function (fov, aspectRatio, nearPlane, farPlane, to) {
        let halfWidth = nearPlane * Math.tan (Utility.degreesToRadians(fov * 0.5));
        let halfHeight = halfWidth * aspectRatio;
        return frustum (-halfHeight, halfHeight, -halfWidth, halfWidth, nearPlane, farPlane, to);
    };

    /**
     *
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     * @param to
     * @return {*}
     */
    _.orthographic = function (left, right, bottom, top, near, far, to) {
        to = (((typeof to !== "undefined") && (to != null)) ? to : _.create ());
        let width = right - left, height = top - bottom, depth = far - near;
        to[0] = 2 / width; to[1] = 0; to[2] = 0; to[3] = 0;
        to[4] = 0; to[5] = 2 / height; to[6] = 0; to[7] = 0;
        to[8] = 0; to[9] = 0; to[10] = -2 / depth; to[11] = 0;
        to[12] = -(left + right) / width; to[13] = -(top + bottom) / height; to[14] = -(far + near) / depth; to[15] = 1;
        return to;
    };

    /**
     *
     * @param u
     * @param v
     * @param n
     * @param from
     * @return {FloatNxN|Object}
     */
    let viewMatrix = function (u, v, n, from) {
        let to = _.create();
        to[0] = u[0]; to[1] = u[1]; to[2] = u[2]; to[3] = 0;
        to[4] = v[0]; to[5] = v[1]; to[6] = v[2]; to[7] = 0;
        to[8] = n[0]; to[9] = n[1]; to[10] = n[2]; to[11] = 0;
        to[12] = -Float3.dot (from, u); to[13] = -Float3.dot (from, v); to[14] = -Float3.dot (from, n); to[15] = 1;
        return to;
    };
    _.viewMatrix = viewMatrix;

    /**
     *
     * @param from
     * @param at
     * @param up
     */
    _.lookFromAt = function (from, at, up) {
        up = Utility.defaultValue(up, [0, 1, 0]);
        let viewPlaneNormal = Float3.normalize (Float3.subtract (from, at));
        let u = Float3.cross (Float3.normalize (up), viewPlaneNormal);
        let v = Float3.cross (viewPlaneNormal, u);
        return viewMatrix (u, v, viewPlaneNormal, from);
    };

    /**
     * 
     * @param span
     * @param fov
     * @param along
     * @param at
     * @param up
     * @return {FloatNxN|Object}
     */
    _.lookAlongAt = function (span, fov, along, at, up) {
        up = Utility.defaultValue(up, [0, 1, 0]);
        let viewPlaneNormal = Float3.normalize (along);
        let u = Float3.cross (Float3.normalize (up), viewPlaneNormal);
        let v = Float3.cross (viewPlaneNormal, u);

        // compute the actual camera location based on the field of view and desired view span
        let distance = span / Math.tan (Utility.degreesToRadians(fov * 0.5));
        let from = Float3.add (at, Float3.scale (viewPlaneNormal, distance));
        return viewMatrix (u, v, viewPlaneNormal, from);

    };

    /**
     *
     * @param n
     * @param up
     * @returns {FloatNxN|Object}
     */
    _.rotateZAxisTo = function (n, up) {
        up = Utility.defaultFunction(up, function () { return [0, 1, 0]; });
        n = Float3.normalize (n);
        let u = Float3.normalize (Float3.cross (up, n));
        let v = Float3.cross (n, u);
        let to = _.create();
        to[0] = u[0]; to[1] = u[1]; to[2] = u[2]; to[3] = 0;
        to[4] = v[0]; to[5] = v[1]; to[6] = v[2]; to[7] = 0;
        to[8] = n[0]; to[9] = n[1]; to[10] = n[2]; to[11] = 0;
        to[12] = 0; to[13] = 0; to[14] = 0; to[15] = 1;
        return to;
    };

    /**
     *
     * @param n
     * @param up
     * @returns {FloatNxN|Object}
     */
    _.rotateXAxisTo = function (u, up) {
        up = Utility.defaultFunction(up, function () { return [0, 1, 0]; });
        u = Float3.normalize (u);
        let n = Float3.normalize (Float3.cross (u, up));
        let v = Float3.cross (n, u);
        let to = _.create();
        to[0] = u[0]; to[1] = u[1]; to[2] = u[2]; to[3] = 0;
        to[4] = v[0]; to[5] = v[1]; to[6] = v[2]; to[7] = 0;
        to[8] = n[0]; to[9] = n[1]; to[10] = n[2]; to[11] = 0;
        to[12] = 0; to[13] = 0; to[14] = 0; to[15] = 1;
        return to;
    };

    return _;
} ();
let Shader = function () {
    let _ = Object.create (null);

    let shaders = Object.create (null);

    _.construct = function (name, url, parameters, onReady) {
        this.name = name;
        LogLevel.say (LogLevel.INFO, "Shader: " + this.name);

        let scope = this;
        let request = new XMLHttpRequest();
        request.onload = function (event) {
            if (request.status === 200) {
                let shader = context.createShader (parameters.type);
                context.shaderSource (shader, request.responseText);
                context.compileShader (shader);
                if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
                    LogLevel.say (LogLevel.ERROR, "Shader compilation failed for " + this.name + ":\n" + context.getShaderInfoLog (shader));
                } else {
                    scope.compiledShader = shader;
                    onReady.notify (scope);
                }
            }
        };
        request.open("GET", url);
        request.send();

        return this;
    };

    /**
     * static method to create and construct a new Shader.
     *
     * @method new
     * @static
     * @param {string} name the name to use to refer to this shader
     * @param {string} url where to get this shader
     * @param {Object} parameters shader construction parameters, typically url and type, where
     * type is one of (context.VERTEX_SHADER, context.FRAGMENT_SHADER)
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Shader}
     */
    _.new = function (name, url, parameters, onReady) {
        parameters = (((typeof parameters !== "undefined") && (parameters != null)) ? parameters : {});
        return (shaders[name] = Object.create (_).construct (name, url, parameters, onReady));
    };

    /**
     * fetch a shader by name.
     *
     * @method get
     * @static
     * @param {string} name the name of the shader to return
     * @return {Shader}
     */
    _.get = function (name) {
        return shaders[name];
    };

    return _;
} ();
/**
 * A Vertex and Fragment "shader" pairing, and utilities for setting attributes and parameters.
 *
 * @class Program
 */
let Program = function () {
    let _ = Object.create (null);

    /**
     * the name for the standard POSITION buffer attribute in a shader.
     * @element POSITION_ATTRIBUTE
     * @type {string}
     * @final
     */
    _.POSITION_ATTRIBUTE = "POSITION_ATTRIBUTE";

    /**
     * the name for the standard NORMAL buffer attribute in a shader.
     * @element NORMAL_ATTRIBUTE
     * @type {string}
     * @final
     */
    _.NORMAL_ATTRIBUTE = "NORMAL_ATTRIBUTE";

    /**
     * the name for the standard TEXTURE buffer attribute in a shader.
     * @element TEXTURE_ATTRIBUTE
     * @type {string}
     * @final
     */
    _.TEXTURE_ATTRIBUTE = "TEXTURE_ATTRIBUTE";

    let programs = Object.create (null);
    let currentProgram;

    /**
     * the initializer for a shader.
     *
     * @method construct
     * @param {string} name name to retrieve this shader
     * @param {Object} parameters shader construction parameters
     * @return {Program}
     */
    _.construct = function (name, parameters) {
        this.name = name;
        LogLevel.say (LogLevel.INFO, "Program: " + this.name);

        this.currentShape = null;

        // create the shader program and attach the components
        let program = this.program = context.createProgram ();
        context.attachShader (program, Shader.get (parameters.vertexShader).compiledShader);
        context.attachShader (program, Shader.get (parameters.fragmentShader).compiledShader);

        // force a binding of attribute 0 to the position attribute (which SHOULD always be present)
        // this avoids a performance penalty incurred if a randomly assigned attribute is on index 0
        // but is not used by a particular shape (like a normals buffer).
        context.bindAttribLocation (program, 0, parameters.attributeMapping.POSITION_ATTRIBUTE);

        // link the program and check that it succeeded
        context.linkProgram (program);
        if (!context.getProgramParameter (program, context.LINK_STATUS)) {
            LogLevel.say (LogLevel.ERROR, "Could not initialise shader");
            // XXX do we need to delete it?
        }

        // have to do this before collecting parameters and attributes, or else...
        context.useProgram (program);

        // loop over the found active shader parameters providing setter methods for them, and map
        // the ones we know about
        let parameterMapping = parameters.parameterMapping;
        let reverseParameterMapping = Utility.reverseMap (parameterMapping);
        let standardParameterMapping = this.standardParameterMapping = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_UNIFORMS); i < end; i++) {
            let programUniform = ProgramUniform.new (program, i);
            let programUniformName = programUniform.name;
            let setProgramUniformFunctionName = "set" + Utility.uppercase (programUniformName);
            this[setProgramUniformFunctionName] = function (value) {
                programUniform.set (value);
                return this;
            };

            // if the shader parameter is in the standard mapping, add that
            if (programUniformName in reverseParameterMapping) {
                standardParameterMapping[reverseParameterMapping[programUniformName]] = setProgramUniformFunctionName;
            }
        }

        // loop over the found active attributes, and map the ones we know about
        let reverseAttributeMapping = Utility.reverseMap (parameters.attributeMapping);
        let attributes = this.attributes = Object.create (null);
        for (let i = 0, end = context.getProgramParameter (program, context.ACTIVE_ATTRIBUTES); i < end; i++) {
            let activeAttribute = context.getActiveAttrib (program, i);
            let activeAttributeName = activeAttribute.name;
            if (activeAttributeName in reverseAttributeMapping) {
                attributes[reverseAttributeMapping[activeAttributeName]] = ProgramAttribute.new (program, activeAttribute);
            }
        }
        return this;
    };

    /**
     * set the standard shader parameters in one call.
     *
     * @method setStandardUniforms
     * @param {Object} parameters a mapping of standard parameter names to values, as specified in
     * the initialization of the shader
     * @chainable
     */
    _.setStandardUniforms = function (parameters) {
        let standardParameterMapping = this.standardParameterMapping;
        for (let parameter in parameters) {
            if (parameter in standardParameterMapping) {
                this[standardParameterMapping[parameter]] (parameters[parameter]);
            }
        }
        return this;
    };

    let bindAttribute = function (scope, which, buffer) {
        // not every shader uses every attribute, so don't bother to set them unless they will be used
        if (which in scope.attributes) {
            context.bindBuffer (context.ARRAY_BUFFER, buffer);
            scope.attributes[which].bind ();
        }
        return scope;
    };

    /**
     * bind the POSITION attribute to the given buffer.
     *
     * @method bindPositionAttribute
     * @param {Object} buffer WebGL buffer to bind
     * @chainable
     */
    _.bindPositionAttribute = function (buffer) {
        return bindAttribute(this, _.POSITION_ATTRIBUTE, buffer);
    };

    /**
     * bind the NORMAL attribute to the given buffer.
     *
     * @method bindNormalAttribute
     * @param {Object} buffer WebGL buffer to bind
     * @chainable
     */
    _.bindNormalAttribute = function (buffer) {
        return bindAttribute(this, _.NORMAL_ATTRIBUTE, buffer);
    };

    /**
     * bind the TEXTURE attribute to the given buffer.
     *
     * @method bindTextureAttribute
     * @param {Object} buffer WebGL buffer to bind
     * @chainable
     */
    _.bindTextureAttribute = function (buffer) {
        // not every shader uses every attribute, so don't bother to set this unless it will be used
        return bindAttribute(this, _.TEXTURE_ATTRIBUTE, buffer);
    };

    /**
     * disable the enabled buffers.
     *
     * @method unbindAttributes
     * @return {Program}
     */
    _.unbindAttributes = function () {
        for (let attribute in this.attributes) {
            this.attributes[attribute].unbind ();
        }
    };

    /**
     * fetch the shader currently in use.
     *
     * @method getCurrentProgram
     * @static
     * @return {Program}
     */
    _.getCurrentProgram = function () {
        return currentProgram;
    };

    /**
     * set this as the current shader in the rendering context.
     *
     * @method use
     * @chainable
     */
    _.use = function () {
        if (currentProgram !== this) {
            // if a program is already set, we want to unbind it's buffers to avoid an extraneous
            // buffer connection hanging around in a subsequent draw effect
            if (currentProgram) {
                currentProgram.unbindAttributes ();
            }

            LogLevel.say (LogLevel.TRACE, "Use program: " + this.name);
            currentProgram = this;
            context.useProgram (this.program);

            // reset the current shape to ensure we bind attributes correctly after changing programs
            this.currentShape = null;
        }
        return this;
    };

    _.useShape = function (shape) {
        if (this.currentShape !== shape) {
            LogLevel.say (LogLevel.TRACE, "Use shape: " + shape.name);
            this.currentShape = shape;
            return true;
        }
        return false;
    };

    /**
     * get the name of this shader
     *
     * @method getName
     * @return {string} the name of this shader.
     */
    _.getName = function () {
        return this.name;
    };

    /**
     * static method to create and construct a new Program.
     *
     * @method new
     * @static
     * @param {string} name name to retrieve this shader
     * @param {Object} parameters shader construction parameters
     * vertexShader name of the vertex shader to use
     * fragmentShader name of the fragment shader to use
     * attributeMapping maps POSITION, NORMAL, and TEXTURE attributes to the
     * attribute names in the shader. This allows the engine to manage the attributes without
     * forcing the shader author to use "standard" names for everything. Defaults to:
     * * POSITION_ATTRIBUTE: "inputPosition"
     * * NORMAL_ATTRIBUTE: "inputNormal"
     * * TEXTURE_ATTRIBUTE: "inputTexture"
     * parameterMapping maps standard parameters to the parameter names in the
     * shader. This allows the engine to manage setting the standard set of parameters on the shader
     * without forcing the shader author to use "standard" names. Defaults to:
     * * MODEL_MATRIX_PARAMETER: "modelMatrix"
     * * VIEW_MATRIX_PARAMETER: "viewMatrix"
     * * PROJECTION_MATRIX_PARAMETER: "projectionMatrix"
     * * NORMAL_MATRIX_PARAMETER: "normalMatrix"
     * * CAMERA_POSITION: "cameraPosition"
     * * OUTPUT_ALPHA_PARAMETER: "outputAlpha"
     * * TEXTURE_SAMPLER: "textureSampler"
     * * MODEL_COLOR:"modelColor"
     * * AMBIENT_LIGHT_COLOR: "ambientLightColor"
     * * AMBIENT_CONTRIBUTION:"ambientContribution"
     * * LIGHT_DIRECTION: "lightDirection"
     * * LIGHT_COLOR:"lightColor"
     * * DIFFUSE_CONTRIBUTION:"diffuseContribution"
     * * SPECULAR_CONTRIBUTION:"specularContribution"
     * * SPECULAR_EXPONENT:"specularExponent"
     * @return {Program}
     */
    _.new = function (name, parameters) {
        // default value for the parameters
        parameters = (((typeof parameters !== "undefined") && (parameters != null)) ? parameters : function () { return Object.create (null); } ());

        // default value for the shader names
        parameters.vertexShader = "vertex-" + (((typeof parameters.vertexShader !== "undefined") && (parameters.vertexShader != null)) ? parameters.vertexShader : name);
        parameters.fragmentShader = "fragment-" + (((typeof parameters.fragmentShader !== "undefined") && (parameters.fragmentShader != null)) ? parameters.fragmentShader : name);

        // default values for the attribute mapping
        if (!("attributeMapping" in parameters)) {
            parameters.attributeMapping = {
                POSITION_ATTRIBUTE: "inputPosition",
                NORMAL_ATTRIBUTE: "inputNormal",
                TEXTURE_ATTRIBUTE: "inputTexture"
            };
        }

        // default values for the parameter mapping
        if (!("parameterMapping" in parameters)) {
            parameters.parameterMapping = {
                MODEL_MATRIX_PARAMETER: "modelMatrix",
                VIEW_MATRIX_PARAMETER: "viewMatrix",
                PROJECTION_MATRIX_PARAMETER: "projectionMatrix",
                NORMAL_MATRIX_PARAMETER: "normalMatrix",
                CAMERA_POSITION: "cameraPosition",
                OUTPUT_ALPHA_PARAMETER: "outputAlpha",
                TEXTURE_SAMPLER: "textureSampler",
                MODEL_COLOR:"modelColor",
                AMBIENT_LIGHT_COLOR: "ambientLightColor",
                AMBIENT_CONTRIBUTION:"ambientContribution",
                LIGHT_DIRECTION: "lightDirection",
                LIGHT_COLOR:"lightColor",
                DIFFUSE_CONTRIBUTION:"diffuseContribution",
                SPECULAR_CONTRIBUTION:"specularContribution",
                SPECULAR_EXPONENT:"specularExponent"
            };
        };
        return (programs[name] = Object.create (_).construct (name, parameters));
    };

    /**
     * fetch a program by name.
     *
     * @method get
     * @static
     * @return {Program}
     */
    _.get = function (name) {
        return programs[name];
    };

    return _;
} ();

let ProgramUniform = function () {
    let _ = Object.create (null);

    _.construct = function (program, i) {
        let activeUniform = context.getActiveUniform (program, i);
        this.name = activeUniform.name;
        this.type = activeUniform.type;
        this.location = context.getUniformLocation (program, activeUniform.name);

        // XXX temporarily store texture indices on the program (subversive actions here)
        if (this.type == context.SAMPLER_2D) {
            this.textureIndex = ("nextTextureIndex" in program) ? program.nextTextureIndex : 0;
            program.nextTextureIndex = this.textureIndex + 1;
            LogLevel.say (LogLevel.TRACE, "Program uniform: " + this.name + " (type 0x" + this.type.toString(16) + ") at index " + this.textureIndex);
        } else {
            LogLevel.say (LogLevel.TRACE, "Program uniform: " + this.name + " (type 0x" + this.type.toString(16) + ")");
        }
        return this;
    };

    _.set = function (value) {
        LogLevel.say (LogLevel.TRACE, "Set uniform: " + this.name);
        // see https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.1 (5.14) for explanation
        switch (this.type) {
            case 0x1404: // context.INT
                context.uniform1i (this.location, value);
                break;
            case 0x8B53: // context.INT_VEC2
                context.uniform2iv (this.location, value);
                break;
            case 0x8B54: // context.INT_VEC3
                context.uniform3iv (this.location, value);
                break;
            case 0x8B55: // context.INT_VEC4
                context.uniform4iv (this.location, value);
                break;

            case 0x1406: // context.FLOAT
                context.uniform1f (this.location, value);
                break;
            case 0x8B50: // context.FLOAT_VEC2
                context.uniform2fv (this.location, value);
                break;
            case 0x8B51: // context.FLOAT_VEC3
                context.uniform3fv (this.location, value);
                break;
            case 0x8B52: // context.FLOAT_VEC4
                context.uniform4fv (this.location, value);
                break;

            case 0x8B5A: // context.FLOAT_MAT2
                context.uniformMatrix2fv (this.location, false, value);
                break;
            case 0x8B5B: // context.FLOAT_MAT3
                context.uniformMatrix3fv (this.location, false, value);
                break;
            case 0x8B5C: // context.FLOAT_MAT4
                context.uniformMatrix4fv (this.location, false, value);
                break;

            case 0x8B5E: // context.SAMPLER_2D
                // TEXTURE0 is a constant, up to TEXTURE31 (just incremental adds to TEXTURE0)
                // XXX I wonder if this will need to be unbound
                context.activeTexture (context.TEXTURE0 + this.textureIndex);
                context.bindTexture (context.TEXTURE_2D, Texture.get (value).texture);
                context.uniform1i (this.location, this.textureIndex);
                break;
        }
    };

    _.new = function (program, i) {
        return Object.create (_).construct (program, i);
    };

    return _;
} ();
let ProgramAttribute = function () {
    let _ = Object.create (null);

    _.construct = function (program, activeAttribute) {
        this.name = activeAttribute.name;
        this.type = activeAttribute.type;
        this.location = context.getAttribLocation (program, this.name);
        LogLevel.say (LogLevel.TRACE, "Program attribute: " + this.name + " at index " + this.location + " (type 0x" + this.type.toString(16) + ")");

        // set the bind function
        switch (this.type) {
            case 0x1404:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 1, context.INT, false, 0, 0);
                };
                break;
            case 0x8B53:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 2, context.INT, false, 0, 0);
                };
                break;
            case 0x8B54:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 3, context.INT, false, 0, 0);
                };
                break;
            case 0x8B55:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 4, context.INT, false, 0, 0);
                };
                break;
            case 0x1406:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 1, context.FLOAT, false, 0, 0);
                };
                break;
            case 0x8B50:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 2, context.FLOAT, false, 0, 0);
                };
                break;
            case 0x8B51:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 3, context.FLOAT, false, 0, 0);
                };
                break;
            case 0x8B52:
                this.bind = function () {
                    LogLevel.say (LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                    context.enableVertexAttribArray (this.location);
                    context.vertexAttribPointer (this.location, 4, context.FLOAT, false, 0, 0);
                };
                break;
        }
        return this;
    };

    _.unbind = function () {
        LogLevel.say (LogLevel.TRACE, "Unbind attribute (" + this.name + ") at location " + this.location);
        context.disableVertexAttribArray (this.location);
    };

    _.new = function (program, activeAttribute) {
        return Object.create (_).construct (program, activeAttribute);
    };

    return _;
} ();
let Texture = function () {
    let _ = Object.create (null);

    let textures = Object.create (null);
    let afExtension;

    _.construct = function (name, url, parameters, onReady) {
        this.name = name;
        LogLevel.say (LogLevel.INFO, "Texture: " + name);

        let texture = this.texture = context.createTexture();
        let image = new Image();

        // allow cross origin loads, all of them... it's butt stupid that this isn't the default
        image.crossOrigin = "anonymous";
        let scope = this;
        image.onload = function() {
            context.bindTexture (context.TEXTURE_2D, texture);
            context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
            context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
            if (("generateMipMap" in parameters) && (parameters.generateMipMap == true)) {
                context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
                context.texParameterf (context.TEXTURE_2D, afExtension.TEXTURE_MAX_ANISOTROPY_EXT, parameters.anisotropicFiltering);
                context.generateMipmap (context.TEXTURE_2D);
            } else {
                context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
            }
            context.bindTexture (context.TEXTURE_2D, null);

            // set the texture in the textures
            textures[name] = scope;

                // call the onReady handler
            onReady.notify (scope);
        };
        image.src = url;

        return this;
    };

    /**
     * static method to create and construct a new Texture.
     *
     * @method new
     * @static
     * @param {string} name the name to use to refer to this texture
     * @param {string} url where to get this texture
     * @param {Object} parameters texture construction parameters
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Texture}
     */
    _.new = function (name, url, parameters, onReady) {
        afExtension = (((typeof afExtension !== "undefined") && (afExtension != null)) ? afExtension : function () { return context.getExtension ("EXT_texture_filter_anisotropic") } ());
        parameters = (((typeof parameters !== "undefined") && (parameters != null)) ? parameters : {});
        // make sure anisotropic filtering is defined, and has a reasonable default value
        parameters.anisotropicFiltering = Math.min (context.getParameter(afExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT), ("anisotropicFiltering" in parameters)? parameters.anisotropicFiltering : 4);
        return Object.create (_).construct (name, url, parameters, onReady);
    };

    /**
     * fetch a texture by name.
     *
     * @method get
     * @static
     * @param {string} name the name of the texture to return
     * @return {Texture}
     */
    _.get = function (name) {
        if (name in textures) {
            return textures[name];
        }
        LogLevel.say (LogLevel.WARNNG, "Texture not found: " + name);
    };

    return _;
} ();
/**
 * A node in a scene graph.
 *
 * @class Node
 */
let Node = function () {
    let _ = Object.create (null);

    let nodes = Object.create (null);

    /**
     * the initializer for a scene graph node.
     *
     * @method construct
     * @param {Object} parameters an object with optional information to include in the node. The
     * possibilities are:
     * * name {string}: nodes can be named if they need to be retrieved later.
     * * transform {Float4x4}: a transformation matrix to apply before drawing or traversing children.
     * * state {function}: a parameter-less function to call before drawing or traversing children.
     * this function may set any render state needed.
     * * shape {string}: the name of a shape to draw.
     * * children: the node will have an array of children by default, but if the node is intended
     * to be a leaf, you can save the space and time associated with an empty list by setting this
     * value to "false".
     * @return {Node}
     */
    _.construct = function (parameters) {
        // we select the traverse function based on the feature requested for the node. these are
        // the bit flags to indicate the features and the value we accumulate them into. note that
        // some combinations are invalid
        let HAS_TRANSFORM = 1;
        let HAS_STATE = 2;
        let HAS_SHAPE = 4;
        let HAS_CHILDREN = 8;
        let traverseFunctionIndex = 0;

        // collect the parameters, and accumulate the flags for the features
        if (typeof parameters !== "undefined") {
            if ("name" in parameters) {
                this.name = parameters.name;
                nodes[this.name] = this;
            }

             if ("transform" in parameters) {
                 this.transform = parameters.transform;
                 traverseFunctionIndex += HAS_TRANSFORM;
             }

            if ("state" in parameters) {
                this.state = parameters.state;
                traverseFunctionIndex += HAS_STATE;
            }

            if ("shape" in parameters) {
                this.shape = Shape.get (parameters.shape);
                traverseFunctionIndex += HAS_SHAPE;
            }

            // by default, nodes are enabled
            this.enabled = (((typeof parameters.enabled !== "undefined") && (parameters.enabled != null)) ? parameters.enabled : true);

            // children are special, the default is to include children, but we want a way to say
            // the current node is a leaf node, so { children: false } is the way to do that
            if ((!("children" in parameters)) || (parameters.children != false)) {
                this.children = [];
                traverseFunctionIndex += HAS_CHILDREN;
            }
        } else {
            // default is just a parent node
            this.children = [];
            traverseFunctionIndex += HAS_CHILDREN;
        }

        // now make a traverse function depending on the included features
        let INVALID_TRAVERSE = function (transform) {
            LogLevel.say (LogLevel.WARNING, "INVALID TRAVERSE");
            return this;
        };
        LogLevel.say (LogLevel.TRACE, "Node (" + this.getName () + "): traverse (" + traverseFunctionIndex + ")");
        this.traverse = [
            // 0 nothing
            INVALID_TRAVERSE,
            // 1 transform only
            INVALID_TRAVERSE,
            // 2 state only
            INVALID_TRAVERSE,
            // 3 transform, state
            INVALID_TRAVERSE,
            // 4 shape only
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.draw (standardUniforms);
                }
                return this;
            },
            // 5 transform, shape
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                    this.draw (standardUniforms);
                }
                return this;
            },
            // 6 state, shape
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.state (standardUniforms);
                    this.draw (standardUniforms);
                }
                return this;
            },
            // 7 transform, state, shape
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.state (standardUniforms);
                    standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                    this.draw (standardUniforms);
                }
                return this;
            },
            // 8 children only
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 9 transform, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    let modelMatrix = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 10 state, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.state (standardUniforms);
                    let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 11 transform, state, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.state (standardUniforms);
                    let modelMatrix = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 12 shape, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                    this.draw (standardUniforms);
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 13 transform, shape, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                    this.draw (standardUniforms);
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 14 state, shape, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.state (standardUniforms);
                    this.draw (standardUniforms);
                    let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            },
            // 15 transform, state, shape, children
            function (standardUniforms) {
                if (this.enabled) {
                    LogLevel.say (LogLevel.TRACE, "Traverse: " + (this.name ? this.name : "unnamed"));
                    this.state (standardUniforms);
                    let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                    this.draw (standardUniforms);
                    for (let child of this.children) {
                        standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                        child.traverse (standardUniforms);
                    }
                }
                return this;
            }
        ][traverseFunctionIndex];

        return this;
    };

    /**
     * add a child node (only applies to non-leaf nodes).
     *
     * @method addChild
     * @param {Node} node the node to add as a child.
     * @chainable
     */
    _.addChild = function (node) {
        if ("children" in this) {
            this.children.push (node);
        } else {
            LogLevel.say (LogLevel.ERROR, "Attempting to add child (" + node.getName () + ") to node (" + this.getName () + ") that is a leaf.");
        }
        return this;
    };

    /**
     * draw this node's contents.
     *
     * @method draw
     * @param {Object} standardUniforms the container for standard parameters, as documented in
     * Program
     */
    _.draw = function (standardUniforms) {
        standardUniforms.NORMAL_MATRIX_PARAMETER = Float4x4.transpose (Float4x4.inverse (standardUniforms.MODEL_MATRIX_PARAMETER));
        Program.getCurrentProgram ().setStandardUniforms (standardUniforms);
        this.shape.draw ();
    };

    /**
     * traverse this node and its contents. this funciton is a place-holder that is replaced by the
     * actual function called depending on the parameters passed during construction.
     *
     * @method traverse
     * @param {Object} standardUniforms the container for standard parameters, as documented in
     * Program
     * @chainable
     */
    _.traverse = function (standardUniforms) {
        return this;
    };

    /**
     * get the name of this node (if it has one).
     *
     * @method getName
     * @return {string} the name of this node, or just "node".
     */
    _.getName = function () {
        return ("name" in this) ? this.name : "node";
    };

    /**
     * get a node by name.
     *
     * @method get
     * @param {string} name the name of the node to retrieve.
     * @return {Node}
     */
    _.get = function (name) {
        return nodes[name];
    };

    /**
     * static method to create and construct a new scene graph node.
     *
     * @method new
     * @static
     * @param {Object} parameters an object with optional information to include in the node (see
     * "construct" for more information)
     * @return {Node}
     */
    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();

/*
 thoughts...

 Nodes are a hierarchical way of traversing "state", which includes, shape, program (shaders),
 texture, and other state information. Should each one of these be a special element? Should "draw"
 just be a flag on the node construction, assuming that some node set all of the "state" needed
 */
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
        Object.getPrototypeOf(_).construct.call(this, parameters);

        // look to see if the user has provided a point shape or size to use
        this.pointShape = ("pointShape" in parameters) ? parameters.pointShape : "sphere2";
        this.pointSize = ("pointSize" in parameters) ? parameters.pointSize : 0.02;

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
let Shape = function () {
    let _ = Object.create (null);

    let shapes = Object.create (null);

    _.construct = function (name, buffers) {
        this.name = name;

        let makeBuffer = function (bufferType, source, itemSize) {
            let buffer = context.createBuffer ();
            context.bindBuffer (bufferType, buffer);
            context.bufferData (bufferType, source, context.STATIC_DRAW);
            buffer.itemSize = itemSize;
            buffer.numItems = source.length / itemSize;
            return buffer;
        };

        // we will use the combination of input
        // 0 vertex only
        // 1 vertex, normal
        // 2 vertex, texture
        // 3 vertex, normal, texture
        // 4 vertex, index
        // 5 vertex, normal, index
        // 6 vertex, texture, index
        // 7 vertex, normal, texture, index

        // build the buffers
        let HAS_NORMAL = 1;
        let HAS_TEXTURE = 2;
        let HAS_INDEX = 4;
        let drawFunctionIndex = 0;
        if ("position" in buffers) {
            this.positionBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.position), 3);
        } else {
            LogLevel.say (LogLevel.ERROR, "What you talking about willis?");
        }

        if ("normal" in buffers) {
            this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.normal), 3);
            drawFunctionIndex += HAS_NORMAL;
        }

        if ("texture" in buffers) {
            this.textureBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.texture), 2);
            drawFunctionIndex += HAS_TEXTURE;
        }

        if ("index" in buffers) {
            this.indexBuffer = makeBuffer (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (buffers.index), 1);
            drawFunctionIndex += HAS_INDEX;
        }

        this.draw = [
            // 0 vertex only
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program.bindPositionAttribute (this.positionBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 1 vertex, normal
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 2 vertex, texture
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 3 vertex, normal, texture
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 4 vertex, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program.bindPositionAttribute (this.positionBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 5 vertex, normal, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 6 vertex, texture, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
            // 7 vertex, normal, texture, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LogLevel.say (LogLevel.ERROR, err.message);
                }
            },
        ][drawFunctionIndex];

        return this;
    };

    _.new = function (name, buffers) {
        return (shapes[name] = Object.create (_).construct (name, buffers ()));
    };

    _.get = function (name) {
        return shapes[name];
    };

    return _;
} ();
let ShapeBuilder = function () {
    let _ = Object.create (null);

    _.construct = function (precision) {
        this.precision = (((typeof precision !== "undefined") && (precision != null)) ? precision : 7);
        this.vertexIndex = Object.create (null);
        this.vertices = [];
        this.faces = [];
        this.normals = [];
        this.texture = [];
        return this;
    };

    _.addVertex = function (vertex) {
        let str = Float3.str(vertex);
        if (str in this.vertexIndex) {
            return this.vertexIndex[str];
        } else {
            let index = this.vertices.length;
            this.vertices.push(vertex);
            this.vertexIndex[str] = index;
            return index;
        }
    };

    _.addVertexNormal = function (vertex, normal) {
        let str = Float3.str(vertex) + Float3.str(normal);
        if (str in this.vertexIndex) {
            return this.vertexIndex[str];
        } else {
            let index = this.vertices.length;
            this.vertices.push(vertex);
            this.normals.push (normal);
            this.vertexIndex[str] = index;
            return index;
        }
    };

    _.addVertexTexture = function (vertex, texture) {
        let str = Float3.str(vertex) + Float2.str(texture);
        if (str in this.vertexIndex) {
            return this.vertexIndex[str];
        } else {
            let index = this.vertices.length;
            this.vertices.push(vertex);
            this.texture.push (texture);
            this.vertexIndex[str] = index;
            return index;
        }
    };

    _.addVertexNormalTexture = function (vertex, normal, texture) {
        let str = Float3.str(vertex) + Float3.str(normal) + Float2.str(texture);
        if (str in this.vertexIndex) {
            return this.vertexIndex[str];
        } else {
            let index = this.vertices.length;
            this.vertices.push(vertex);
            this.normals.push (normal);
            this.texture.push (texture);
            this.vertexIndex[str] = index;
            return index;
        }
    };

    _.addFace = function (face) {
        this.faces.push(face);
    };

    _.makeBuffers = function () {
        LogLevel.say (LogLevel.TRACE, this.vertices.length + " vertices for " + this.faces.length + " faces");
        let result = {
            position: Utility.flatten(this.vertices),
            index: Utility.flatten(this.faces)
        };
        if (this.normals.length > 0) {
            result.normal = Utility.flatten(this.normals);
        }
        if (this.texture.length > 0) {
            result.texture = Utility.flatten(this.texture);
        }
        return result;
    };

    _.makeFacets = function () {
        let vertex = [];
        let normal = [];
        for (let face of this.faces) {
            // get the first three vertices of the face to compute the normal
            let a = this.vertices[face[0]];
            let b = this.vertices[face[1]];
            let c = this.vertices[face[2]];
            let ab = Float3.normalize(Float3.subtract(b, a));
            let bc = Float3.normalize(Float3.subtract(c, b));
            let n = Float3.cross(ab, bc);

            // now loop over all of the points to add them to the vertices
            for (let i = 0; i < face.length; ++i) {
                vertex.push(this.vertices[face[i]]);
                normal.push(n);
            }
        }
        return {
            position: Utility.flatten(vertex),
            normal: Utility.flatten(normal)
        };
    };

    _.new = function (precision) {
        return Object.create (ShapeBuilder).construct (precision);
    };

    return _;
} ();
let Primitive = function () {
    let _ = Object.create(null);

    _.getShapeBuilder = function () {
    };

    _.makeFromBuilder = function (name, builder) {
        name = (((typeof name !== "undefined") && (name != null)) ? name : this.name);
        return Shape.new(name, function () {
            return builder.makeFacets();
        });
    };

    _.make = function (name) {
        let builder = this.getShapeBuilder();
        return this.makeFromBuilder(name, builder);
    };

    return _;
}();
let Tetrahedron = function () {
    let _ = Object.create (Primitive);

    _.name = "tetrahedron";

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new ();
        builder.addVertex([1, 1, 1]);
        builder.addVertex([-1, 1, -1]);
        builder.addVertex([-1, -1, 1]);
        builder.addVertex([1, -1, -1]);

        builder.addFace([0, 1, 2]);
        builder.addFace([1, 3, 2]);
        builder.addFace([2, 3, 0]);
        builder.addFace([3, 1, 0]);

        return builder;
    };

    return _;
} ();
let Hexahedron = function () {
    let _ = Object.create(Primitive);

    _.name = "cube";

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new();

        builder.addVertex([-1, -1, -1]);
        builder.addVertex([-1, 1, -1]);
        builder.addVertex([1, 1, -1]);
        builder.addVertex([1, -1, -1]);
        builder.addVertex([-1, -1, 1]);
        builder.addVertex([-1, 1, 1]);
        builder.addVertex([1, 1, 1]);
        builder.addVertex([1, -1, 1]);

        builder.addFace([0, 1, 2, 0, 2, 3]); // Front face
        builder.addFace([7, 6, 5, 7, 5, 4]); // Back face
        builder.addFace([1, 5, 6, 1, 6, 2]); // Top face
        builder.addFace([4, 0, 3, 4, 3, 7]); // Bottom face
        builder.addFace([4, 5, 1, 4, 1, 0]); // Left face
        builder.addFace([3, 2, 6, 3, 6, 7]); // Right face

        return builder;
    };

    return _;
}();
let Octahedron = function () {
    let _ = Object.create(Primitive);

    _.name = "octahedron";

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new();

        builder.addVertex([0, 1, 0]);
        builder.addVertex([1, 0, 0]);
        builder.addVertex([0, 0, 1]);
        builder.addVertex([-1, 0, 0]);
        builder.addVertex([0, 0, -1]);
        builder.addVertex([0, -1, 0]);

        builder.addFace([0, 2, 1]);
        builder.addFace([0, 3, 2]);
        builder.addFace([0, 4, 3]);
        builder.addFace([0, 1, 4]);


        builder.addFace([5, 1, 2]);
        builder.addFace([5, 2, 3]);
        builder.addFace([5, 3, 4]);
        builder.addFace([5, 4, 1]);

        return builder;
    };

    return _;
}();
let Icosahedron = function () {
    let _ = Object.create(Primitive);

    _.name = "icosahedron";

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new();
        let t = (1.0 + Math.sqrt(5.0)) / 2.0;
        let s = 1 / t;
        t = 1;

        builder.addVertex([-s, t, 0]);
        builder.addVertex([s, t, 0]);
        builder.addVertex([-s, -t, 0]);
        builder.addVertex([s, -t, 0]);

        builder.addVertex([0, -s, t]);
        builder.addVertex([0, s, t]);
        builder.addVertex([0, -s, -t]);
        builder.addVertex([0, s, -t]);

        builder.addVertex([t, 0, -s]);
        builder.addVertex([t, 0, s]);
        builder.addVertex([-t, 0, -s]);
        builder.addVertex([-t, 0, s]);

        builder.addFace([0, 11, 5]);
        builder.addFace([0, 5, 1]);
        builder.addFace([0, 1, 7]);
        builder.addFace([0, 7, 10]);
        builder.addFace([0, 10, 11]);

        builder.addFace([1, 5, 9]);
        builder.addFace([5, 11, 4]);
        builder.addFace([11, 10, 2]);
        builder.addFace([10, 7, 6]);
        builder.addFace([7, 1, 8]);

        builder.addFace([3, 9, 4]);
        builder.addFace([3, 4, 2]);
        builder.addFace([3, 2, 6]);
        builder.addFace([3, 6, 8]);
        builder.addFace([3, 8, 9]);

        builder.addFace([4, 9, 5]);
        builder.addFace([2, 4, 11]);
        builder.addFace([6, 2, 10]);
        builder.addFace([8, 6, 7]);
        builder.addFace([9, 8, 1]);

        return builder;
    };

    return _;
}();
let Square = function () {
    let _ = Object.create(Primitive);

    _.name = "square";

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new();

        builder.addVertex([-1, -1, 0]);
        builder.addVertex([-1, 1, 0]);
        builder.addVertex([1, 1, 0]);
        builder.addVertex([1, -1, 0]);

        builder.addFace([2, 1, 3, 1, 0, 3]);

        return builder;
    };

    return _;
}();
let Sphere = function () {
    let _ = Object.create (Primitive);

    _.name = "sphere";

    _.parameters = {
        baseShapeBuilderType: Icosahedron,
        subdivisions: 4
    };

    _.getShapeBuilder = function () {
        let builder = ShapeBuilder.new ();

        let addVertex = function (vertex) {
            return builder.addVertex (Float3.normalize (vertex));
        };

        let baseShapeBuilder = this.parameters.baseShapeBuilderType.getShapeBuilder ();

        // add all the vertices and faces from the baseShapeBuilder into ours...
        for (let vertex of baseShapeBuilder.vertices) {
            addVertex (vertex);
        }
        let vertices = builder.vertices;
        let faces = builder.faces = baseShapeBuilder.faces;

        // function to subdivide a face
        let subdivide = function () {
            // remove the triangle we want to subdivide, which is always the first one
            let tri = faces.splice (0, 1)[0];

            // compute three new vertices as the averages of each pair of vertices
            let v0 = addVertex (Float3.add (vertices[tri[0]], vertices[tri[1]]));
            let v1 = addVertex (Float3.add (vertices[tri[1]], vertices[tri[2]]));
            let v2 = addVertex (Float3.add (vertices[tri[2]], vertices[tri[0]]));

            // add 4 new triangles to replace the one we removed
            builder.addFace ([tri[0], v0, v2]);
            builder.addFace ([tri[1], v1, v0]);
            builder.addFace ([tri[2], v2, v1]);
            builder.addFace ([v0, v1, v2]);
        };

        // subdivide the triangles we already defined, do this the requested number of times (3
        // seems to be the minimum for a spherical appearance)
        LogLevel.say (LogLevel.TRACE, "Build sphere...");
        for (let j = 0; j < this.parameters.subdivisions; ++j) {
            LogLevel.say (LogLevel.TRACE, "Iteration " + j + " with " + vertices.length + " points in " + faces.length + " triangles");
            for (let i = 0, faceCount = faces.length; i < faceCount; ++i) {
                subdivide ();
            }
        }
        LogLevel.say (LogLevel.TRACE, "Finished sphere with " + vertices.length + " points in " + faces.length + " triangles");
        return builder;
    };

    _.makeFromBuilder = function (name, builder) {
        name = (((typeof name !== "undefined") && (name != null)) ? name : this.name);
        return Shape.new (name, function () {
            let buffers = builder.makeBuffers ();
            buffers.normal = buffers.position;
            return buffers;
        });
    };

    _.makeN = function (n) {
        this.parameters.subdivisions = n;
        this.make (this.name + n);
    };

    return _;
} ();
let makeRevolve = function (name, outline, normal, steps, projection) {
    // outline is an array of Float2, and the axis of revolution is x = 0, we make a number of
    // wedges, from top to bottom, to complete the revolution.

    let epsilon = 1.0e-6;
    let last = outline.length - 1;

    // make sure we have normals, generating a default set if necessary
    normal = Utility.defaultFunction (normal, function () {
        // variable and function to capture the computed normals
        let N = [];
        let pushNormal = function (a, c) {
            let ac = Float2.subtract (a, c);
            let acPerp = Float2.perpendicular (ac);
            N.push (Float2.normalize (acPerp));
        };

        // loop over the outline points to compute a normal for each one, we use a vector that is
        // perpendicular to the segment ac as the normal.
        if (Float2.equals (outline[0], outline[last])) {
            // the shape is closed, so we want to wrap around
            for (b = 0; b < length; ++b) {
                let a = outline[((b - 1) + last) % last];
                let c = outline[(b + 1) % last];
                pushNormal (a, c);
            }
        } else {
            // the shape is open, so we double the first and last points for the normals
            // XXX there might be better ways to do this...
            for (b = 0; b <= last; ++b) {
                let a = outline[(b == 0) ? b : b - 1];
                let c = outline[(b == last) ? b : b + 1];
                pushNormal (a, c);
            }
        }
        return N;
    });

    // default projection is a plate carree, equirectangular projection
    // https://en.wikipedia.org/wiki/Equirectangular_projection
    projection = (((typeof projection !== "undefined") && (projection != null)) ? projection : function (uvY) { return uvY; });

    return Shape.new (name, function () {
        // compute the steps we need to make to build the rotated shape
        LogLevel.say (LogLevel.TRACE, "Make revolved outline");
        let builder = ShapeBuilder.new ();
        let stepAngle = (-2.0 * Math.PI) / steps;
        for (let i = 0; i < steps; ++i) {
            // this could be just i + 1, but doing the modulus might help prevent a crack
            let j = i + 1;
            let iAngle = i * stepAngle, iCosAngle = Math.cos (iAngle), iSinAngle = Math.sin (iAngle);
            let jAngle = (j % steps) * stepAngle, jCosAngle = Math.cos (jAngle), jSinAngle = Math.sin (jAngle);
            for (let m = 0; m < last; ++m) {
                // the line segment mn is now going to be swept over the angle range ij
                let n = m + 1;
                let vm = outline[m], nm = normal[m];
                let vn = outline[n], nn = normal[n];

                // we allow degenerate faces by duplicating vertices in the outline, if the length
                // between the two components is below the threshold, we skip this facet altogether.
                if (Float2.norm (vm, vn) > epsilon) {
                    // for each facet of the wedge, it's either a degenerate segment, an upward
                    // facing triangle, a downward facing triangle, or a quad.
                    let facetType = ((vm[0] < epsilon) ? 0 : 2) + ((vn[0] < epsilon) ? 0 : 1);
                    switch (facetType) {
                        case 0: // degenerate, emit nothing
                            break;
                        case 1: { // top cap, emit 1 triangle
                            let vim = builder.addVertexNormalTexture ([0, vm[1], 0], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, projection (m / last)]);
                            let vin = builder.addVertexNormalTexture ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, projection (n / last)]);
                            let vjn = builder.addVertexNormalTexture ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle], [j / steps, projection (n / last)]);
                            builder.addFace ([vim, vin, vjn]);
                            break;
                        }
                        case 2: { // bottom cap, emit 1 triangle
                            let vim = builder.addVertexNormalTexture ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, projection (m / last)]);
                            let vjm = builder.addVertexNormalTexture ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle], [j / steps, projection (m / last)]);
                            let vin = builder.addVertexNormalTexture ([0, vn[1], 0], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, projection (n / last)]);
                            builder.addFace ([vim, vin, vjm]);
                            break;
                        }
                        case 3: { // quad, emit 2 triangles
                            let vim = builder.addVertexNormalTexture ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, projection (m / last)]);
                            let vin = builder.addVertexNormalTexture ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, projection (n / last)]);
                            let vjm = builder.addVertexNormalTexture ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle], [j / steps, projection (m / last)]);
                            let vjn = builder.addVertexNormalTexture ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle], [j / steps, projection (n / last)]);
                            builder.addFace ([vjm, vim, vjn]);
                            builder.addFace ([vjn, vim, vin]);
                            break;
                        }
                    }
                }
            }
        }

        return builder.makeBuffers();
    });
};
let makeBall = function (name, steps) {
    LogLevel.say (LogLevel.TRACE, "Make ball...");
    // generate an outline, and then revolve it
    let outline = [];
    let normal = [];
    let stepAngle = Math.PI / steps;
    for (let i = 0; i <= steps; ++i) {
        let angle = stepAngle * i;

        // using an angle setup so that 0 is (0, 1), and Pi is (0, -1) means switching (x, y) so we
        // get an outline that can be revolved around the x=0 axis
        let value = Float2.fixNum([Math.sin (angle), Math.cos (angle)]);
        outline.push (value);
        normal.push (value);
    }

    // revolve the surface, the outline is a half circle, so the revolved surface needs to be twice
    // as many steps to go all the way around
    return makeRevolve(name, outline, normal, steps * 2, function (uvY) {
        return uvY;
        // uvY varies [0..1] over the course of the outline
        let angle = Math.PI * uvY;
        let result = 1 - ((Math.cos (angle) + 1) / 2);
        LogLevel.say (LogLevel.TRACE, "Input " + uvY + " => " + result);
        return result;
    });
};
/**
 * A collection of utility functions.
 *
 * @class Utility
 */
let Utility = function () {
    let _ = Object.create (null);

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
        let fix = (((typeof precision !== "undefined") && (precision != null)) ? precision : 7);
        return Number.parseFloat (number.toFixed (fix));
    };

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
        return (((typeof value !== "undefined") && (value != null)) ? value : defaultValue);
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
        return (((typeof value !== "undefined") && (value != null)) ? value : defaultFunction ());
    };

    /**
     * create a reversed mapping from a given object (assumes 1:1 values)
     *
     * @method reverseMap
     * @param {object} mapping the the object containing the mapping to be reversed
     * @return {object}
     */
    _.reverseMap = function (mapping) {
        let reverseMapping = Object.create(null);
        for (let name in mapping) {
            reverseMapping[mapping[name]] = name;
        }
        return reverseMapping;
    };

    return _;
} ();
let Thing = function () {
    let _ = Object.create (null);

    let things = Object.create (null);

    _.construct = function (name, node, update) {
        this.name = name;
        this.node = node;
        this.update = update;
        return this;
    };

    _.new = function (name, node, update) {
        return (things[name] = Object.create (_).construct (name, node, update));
    };

    /**
     * fetch a thing by name.
     *
     * @method get
     * @static
     * @param {string} name the name of the thing to return
     * @return {Thing}
     */
    _.get = function (name) {
        return things[name];
    };

    _.updateAll = function (time) {
        for (let name in things) {
            let thing = things[name];
            thing.update (time);
        }
    };

    return _;
} ();
var TestContainer = function () {
    var _ = Object.create (null);

    // test design philosophy is to be verbose on failure, and silent on pass
    let assertEquals = function (msg, a, b) {
        a = (!isNaN (a)) ? Utility.fixNum (a) : a;
        b = (!isNaN (b)) ? Utility.fixNum (b) : b;
        if (a != b) {
            LogLevel.say (LogLevel.ERROR, "(FAIL ASSERTION) " + msg + " (" + a + " == " + b + ")");
            return false;
        }
        return true;
    };

    let assertArrayEquals = function (msg, a, b) {
        if (a.length == b.length) {
            for (let i = 0; i < a.length; ++i) {
                if (!assertEquals(msg + "[" + i + "]", a[i], b[i])) {
                    return false;
                }
            }
            return true;
        } else {
            LogLevel.say (LogLevel.ERROR, msg + " (mismatched arrays, FAIL ASSERTION)");
            return false;
        }
    };

    let tests = [
        function () {
            LogLevel.say (LogLevel.INFO, "FloatN...");
            let x = [1.0, 2.0, 13.0, 0.5, 7.0];
            let Float5 = FloatN (5);
            let minor = Float5.minor (x);
            assertEquals("Minor Axis", Float5.minor (x), 3);
            assertEquals("Major Axis", Float5.major (x), 2);
        },
        function () {
            LogLevel.say (LogLevel.INFO, "Float4x4...");
            let viewMatrix = Float4x4.identity ();
            viewMatrix = Float4x4.multiply (Float4x4.rotateX (Utility.degreesToRadians (27.5)), viewMatrix);
            viewMatrix = Float4x4.multiply (Float4x4.translate ([ 0, -1.5, -3.5 ]), viewMatrix);
            viewMatrix = Float4x4.multiply (Float4x4.rotateY (Utility.degreesToRadians (10)), viewMatrix);
            viewMatrix = Float4x4.multiply (Float4x4.scale ([ 2, 2, 2 ]), viewMatrix);
            viewMatrix = Float4x4.multiply (Float4x4.translate ([ -0.5, -0.5, -0.5 ]), viewMatrix);

            let inverted = Float4x4.inverse(viewMatrix, Float4x4.create());
            let inverted2 = [
                0.49240389466285706, 1.7235358695799619e-9, 0.08682408928871155, 0,
                0.040090903639793396, 0.4435054361820221, -0.22736681997776031, 0,
                -0.07701390981674194, 0.23087431490421295, 0.4367676079273224, -0,
                0.1961156576871872, 1.25, 2.2234134674072266, 1
            ];
            assertArrayEquals("inverted == inverted2", inverted, inverted2)
        }
    ];

    _.runTests = function () {
        LogLevel.say (LogLevel.INFO, "Running Tests...");
        for (let test of tests) {
            test ();
        }
        LogLevel.say (LogLevel.INFO, "Finished Running Tests.");
    };

    return _;
} ();

TestContainer.runTests();
