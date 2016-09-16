"use strict";

var Node = function () {
    var _ = Object.create (null);
    var EMPTY_SHAPE = { draw : function () {} };
    var EMPTY_STATE = { pre : function () {}, post : function () {} };

    _.construct = function (parameters) {
        if (typeof parameters !== "undefined") {
            this.transform = ("transform" in parameters) ? parameters.transform : Float4x4.identity();
            this.shape = ("shape" in parameters) ? shapes[parameters.shape] : EMPTY_SHAPE;
            this.state = ("state" in parameters) ? parameters.state : EMPTY_STATE;
        } else {
            this.transform = Float4x4.identity();
            this.shape = EMPTY_SHAPE;
            this.state = EMPTY_STATE;
        }
        this.children = [];
        return this;
    };

    _.traverse = function (baseTransform) {
        var nodeTransform = Float4x4.multiply(baseTransform, this.transform);
        Shader.currentShader().parameters.modelMatrix.set (nodeTransform);
        this.state.pre ();
        this.shape.draw();
        this.state.post ();
        for (let child of this.children) {
            child.traverse(nodeTransform);
        }
    };

    _.addChild = function (node) {
        this.children.push(node);
    };
    return _;
} ();

var makeNode = function (parameters) {
    return Object.create (Node).construct(parameters);
};

var scene = makeNode ();
