    /**
     * A node in a scene graph.
     *
     * @class Node
     */
    let Node = $.Node = function () {
        let _ = ClassNamed ($.CLASS_NAME_GENERATED);

        /**
         * the initializer for a scene graph node.
         *
         * @method construct
         * @param {Object} parameters an object with optional information to include in the node. The
         * possibilities are:
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
            LOG (LogLevel.INFO, "Node: " + parameters.name);

            // we select the traverse function based on the feature requested for the node. these are
            // the bit flags to indicate the features and the value we accumulate them into. note that
            // some combinations are invalid
            let HAS_TRANSFORM = 1;
            let HAS_STATE = 2;
            let HAS_SHAPE = 4;
            let HAS_CHILDREN = 8;
            let traverseFunctionIndex = 0;

            // collect the parameters, and accumulate the flags for the features
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
                if (typeof (this.shape) === "undefined") {
                    LOG (LogLevel.WARNNG, "Shape not found: " + parameters.shape);
                }

                // retrieve the transforms - instance might not be in parameters, but that's ok as the
                // method will create a default
                this.instanceTransforms = this.shape.createInstanceTransforms(parameters.instance);

                traverseFunctionIndex += HAS_SHAPE;
            }

            // by default, nodes are enabled
            this.enabled = DEFAULT_VALUE (parameters.enabled, true);

            // children are special, the default is to include children, but we want a way to say the
            // current node is a leaf node, so { children: false } is the way to do that
            if ((!("children" in parameters)) || (parameters.children !== false)) {
                this.children = [];
                traverseFunctionIndex += HAS_CHILDREN;
            }

            // now make a traverse function depending on the included features
            let INVALID_TRAVERSE = function (transform) {
                LOG (LogLevel.WARNING, "INVALID TRAVERSE");
                return this;
            };
            LOG (LogLevel.TRACE, "Node (" + parameters.name + "): traverse (" + traverseFunctionIndex + ")");
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
                        LOG(LogLevel.TRACE, "Traverse: " + this.name);
                        this.draw (standardUniforms);
                    }
                    return this;
                },
                // 5 transform, shape
                function (standardUniforms) {
                    if (this.enabled) {
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
                        standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                        this.draw (standardUniforms);
                    }
                    return this;
                },
                // 6 state, shape
                function (standardUniforms) {
                    if (this.enabled) {
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
                        this.state (standardUniforms);
                        this.draw (standardUniforms);
                    }
                    return this;
                },
                // 7 transform, state, shape
                function (standardUniforms) {
                    if (this.enabled) {
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
                        this.state (standardUniforms);
                        standardUniforms.MODEL_MATRIX_PARAMETER = Float4x4.multiply (this.transform, standardUniforms.MODEL_MATRIX_PARAMETER);
                        this.draw (standardUniforms);
                    }
                    return this;
                },
                // 8 children only
                function (standardUniforms) {
                    if (this.enabled) {
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
                        this.state (standardUniforms);
                        let modelMatrix = standardUniforms.MODEL_MATRIX_PARAMETER;
                        this.draw (standardUniforms);
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
                        LOG (LogLevel.TRACE, "Traverse: " + this.name);
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

        _.removeChild = function (name) {
            let existingIndex = this.children.findIndex(child => child.name === name);
            if (existingIndex >= 0) {
                this.children.splice (existingIndex, 1);
                return true;
            }
            return false;
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
                #ifdef DEBUG
                if (this.removeChild (node.getName ())) {
                    LOG (LogLevel.WARNNG, "Removed duplicate child node (" + node.getName () + ") from (" + this.getName () + ").");
                }
                #endif
                this.children.push (node);
                node.parent = this;
            } else {
                LOG (LogLevel.ERROR, "Attempting to add child (" + node.getName () + ") to node (" + this.getName () + ") that is a leaf.");
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
            Program.getCurrentProgram ().setStandardUniforms (standardUniforms);
            this.shape.instanceTransforms = this.instanceTransforms;
            this.shape.draw ();
        };

        /**
         * traverse this node and its contents. this function is a place-holder that is replaced by the
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
         *
         */
        _.getTransform = function (root) {
            let transform = ("transform" in this) ? this.transform : Float4x4.IDENTITY;
            // walk to the root, and concatenate the transformations on the return stack
            if (((typeof root !== "undefined") && (this == root)) || (!("parent" in this))) {
                return transform;
            } else {
                return Float4x4.multiply (transform, this.parent.getTransform(root));
            }
        };

        return _;
    } ();
