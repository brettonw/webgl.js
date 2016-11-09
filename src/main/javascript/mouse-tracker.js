"use strict;"

let MouseTracker = function () {
    let _ = OBJ;

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
        if (Float2.normSq (deltaPosition) > 0) {
            mouseDownPosition = mouseMovedPosition;
            onReady.notify (deltaPosition);
        }
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
        stepSize = DEFAULT_VALUE(stepSizeIn, 0.05);

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
