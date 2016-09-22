let Node = function () {
    let _ = Object.create (null);

    let nodes = Object.create (null);

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

            // children are special, the default is to include children, but we want a way to say
            // the current node is a leaf node, so { children: false } is the way to do that
            if ((!("children" in parameters)) || (parameters.children == true)) {
                this.children = [];
                traverseFunctionIndex += HAS_CHILDREN;
            }
        } else {
            // default is just a parent node
            this.children = [];
            traverseFunctionIndex += HAS_CHILDREN;
        }

        // now make a traverse function depending on the included features
        let INVALID_TRAVERSE = function (transform) {};
        this.traverse = [
            // 0 nothing
            null,
            // 1 transform
            null,
            // 2 state
            null,
            // 3 transform, state
            null,
            // 4 shape
            function (transform) {
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
            },
            // 5 transform, shape
            function (transform) {
                transform = Float4x4.multiply (transform, this.transform);
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
            },
            // 6 state, shape
            function (transform) {
                this.state ();
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
            },
            // 7 transform, state, shape
            function (transform) {
                this.state ();
                transform = Float4x4.multiply (transform, this.transform);
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
            },
            // 8 children
            function (transform) {
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 9 transform, children
            function (transform) {
                transform = Float4x4.multiply (transform, this.transform);
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 10 state, children
            function (transform) {
                this.state ();
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 11 transform, state, children
            function (transform) {
                this.state ();
                transform = Float4x4.multiply (transform, this.transform);
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 12 shape, children
            function (transform) {
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 13 transform, shape, children
            function (transform) {
                transform = Float4x4.multiply (transform, this.transform);
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 14 state, shape, children
            function (transform) {
                this.state ();
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
                for (let child of this.children) {
                    child.traverse (transform);
                }
            },
            // 15 transform, state, shape, children
            function (transform) {
                this.state ();
                transform = Float4x4.multiply (transform, this.transform);
                Shader.getCurrentShader ().setModelMatrix (transform);
                this.shape.draw ();
                for (let child of this.children) {
                    child.traverse (transform);
                }
            }
        ][traverseFunctionIndex];

        #ifdef DEBUG
        // sanity check, nodes must have either a shape to draw, or children
        if (this.traverse === INVALID_TRAVERSE) {
            console.log("WARNING: INVALID TRAVERSE");
        }
        #endif


        return this;
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
