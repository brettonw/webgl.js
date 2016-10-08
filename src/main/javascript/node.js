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
            this.enabled = DEFAULT_VALUE (parameters.enabled, true);

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
            LOG ("WARNING: INVALID TRAVERSE");
            return this;
        };
        LOG ("Node (" + this.getName () + "): traverse (" + traverseFunctionIndex + ")");
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
                this.draw (standardUniforms);
                return this;
            },
            // 5 transform, shape
            function (standardUniforms) {
                standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                this.draw (standardUniforms);
                return this;
            },
            // 6 state, shape
            function (standardUniforms) {
                this.state (standardUniforms);
                this.draw (standardUniforms);
                return this;
            },
            // 7 transform, state, shape
            function (standardUniforms) {
                this.state (standardUniforms);
                standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                draw (standardUniforms);
                return this;
            },
            // 8 children only
            function (standardUniforms) {
                let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 9 transform, children
            function (standardUniforms) {
                let modelMatrix = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 10 state, children
            function (standardUniforms) {
                this.state (standardUniforms);
                let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 11 transform, state, children
            function (standardUniforms) {
                this.state (standardUniforms);
                let modelMatrix = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 12 shape, children
            function (standardUniforms) {
                let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                this.draw (standardUniforms);
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 13 transform, shape, children
            function (standardUniforms) {
                let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                this.draw (standardUniforms);
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 14 state, shape, children
            function (standardUniforms) {
                this.state (standardUniforms);
                this.draw (standardUniforms);
                let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
                }
                return this;
            },
            // 15 transform, state, shape, children
            function (standardUniforms) {
                this.state (standardUniforms);
                let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                this.draw (standardUniforms);
                for (let child of this.children) {
                    standardUniforms.MODEL_MATRIX_PARAMETER = modelMatrix;
                    child.traverse (standardUniforms);
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
            LOG ("ERROR: Attempting to add child (" + node.getName () + ") to node (" + this.getName () + ") that is a leaf.");
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
        if (this.enabled) {
            standardUniforms.NORMAL_MATRIX_PARAMETER = Float4x4.transpose (Float4x4.inverse (standardUniforms.MODEL_MATRIX_PARAMETER));
            Program.getCurrentProgram ().setStandardUniforms (standardUniforms);
            this.shape.draw ();
        }
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
