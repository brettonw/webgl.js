"use strict;"

let MouseTracker = function () {
    let _ = Object.create (null);

    let mouseDownPosition;
    let bound;
    let onReady;

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
            case KEY_LEFT: draw (-0.05); break;
            case KEY_RIGHT: draw (0.05); break;
        }
    };

    _.construct = function (canvasId, onReadyIn) {
        onReady = onReadyIn;

        let canvas = document.getElementById(canvasId);

        bound = canvas.getBoundingClientRect();
        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("keydown", keyDown, true);
        canvas.focus();
    };

    _.new = function (canvasId, onReadyIn) {
        return Object.create (_).construct(canvasId, onReadyIn);
    };

    return _;
} ();
