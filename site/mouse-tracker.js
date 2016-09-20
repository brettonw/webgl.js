"use strict;"

var MouseTracker = function () {
    var _ = Object.create (null);

    var mouseDownPosition;
    var bound;

    var mousePosition = function (event) {
        return {
            x: (event.clientX - bound.left) / bound.width,
            y: (event.clientY - bound.top) / bound.height
        };
    }

    var mouseMoved = function (event) {
        var mouseMovedPosition = mousePosition(event);
        var deltaPosition = {
            x: mouseMovedPosition.x - mouseDownPosition.x,
            y: mouseMovedPosition.y - mouseDownPosition.y
        };
        draw (deltaPosition.x);
        mouseDownPosition = mouseMovedPosition;
    };

    var mouseUp = function (event) {
        window.removeEventListener("mousemove", mouseMoved, false);
        window.removeEventListener("mouseup", mouseUp, false);
    };

    var mouseDown = function (event) {
        //getting mouse position correctly
        mouseDownPosition = mousePosition(event);
        window.addEventListener("mousemove", mouseMoved, false);
        window.addEventListener("mouseup", mouseUp, false);
    };

    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;

    var keyDown = function (event) {
        switch (event.keyCode) {
            case KEY_LEFT: draw (-0.05); break;
            case KEY_RIGHT: draw (0.05); break;
        }
    };

    _.construct = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        bound = canvas.getBoundingClientRect();
        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("keydown", keyDown, true);
        canvas.focus();
    };

    _.new = function (canvasId) {
        return Object.create (_).construct(canvasId);
    };

    return _;
} ();
