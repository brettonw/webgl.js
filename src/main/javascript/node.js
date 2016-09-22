let Node = function () {
    let _ = Object.create (null);

    let nodes = Object.create (null);

    let EMPTY_STATE = function () {};
    let EMPTY_DRAW = function (nodeTransform) {};
    let SHAPE_DRAW = function (nodeTransform) {
        Shader.getCurrentShader ().setModelMatrix (nodeTransform);
        this.shape.draw ();
    };

    _.construct = function (parameters) {
        if (typeof parameters !== "undefined") {
            if ("name" in parameters) {
                this.name = parameters.name;
                nodes[this.name] = this;
            }
            this.transform = ("transform" in parameters) ? parameters.transform : Float4x4.identity ();
            this.state = ("state" in parameters) ? parameters.state : EMPTY_STATE;
            if ("shape" in parameters) {
                this.shape = Shape.get (parameters.shape);
                this.draw = SHAPE_DRAW;
            } else {
                this.draw = EMPTY_DRAW;
            }
        } else {
            this.transform = Float4x4.identity ();
            this.draw = EMPTY_DRAW;
            this.state = EMPTY_STATE;
        }
        this.children = [];
        return this;
    };

    _.traverse = function (baseTransform) {
        let nodeTransform = Float4x4.multiply (baseTransform, this.transform);
        this.state ();
        this.draw (nodeTransform);
        for (let child of this.children) {
            child.traverse (nodeTransform);
        }
    };

    _.addChild = function (node) {
        this.children.push (node);
    };

    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();


// XXX not sure this is really necessary to have here
let scene = Node.new ();
