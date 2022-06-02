export let MouseTracker = function () {
    let _ = OBJ;

    let mouseDownPosition;
    let bound;
    let onReady;
    let stepSize;

    let hole = function (event) {
        event.preventDefault();
        return false;
    };

    let mousePosition = function (event) {
        return Float3.copy ([
            (event.clientX - bound.left) / bound.width,
            (event.clientY - bound.top) / bound.height,
            0.0
        ]);
    }

    let mouseMoved = function (event) {
        let mouseMovedPosition = mousePosition(event);
        let deltaPosition = Float3.subtract (mouseMovedPosition, mouseDownPosition);
        if (Float3.normSq (deltaPosition) > 0) {
            mouseDownPosition = mouseMovedPosition;
            onReady.notify (deltaPosition);
        }
        return hole (event);
    };

    let mouseUp = function (event) {
        window.removeEventListener("pointermove", mouseMoved, false);
        window.removeEventListener("pointerup", mouseUp, false);
        return hole (event);
    };

    let mouseDown = function (event) {
        switch (event.buttons) {
            case 1:
                switch (event.button) {
                    case 0:
                        // standard left click
                        mouseDownPosition = mousePosition (event);
                        window.addEventListener ("pointermove", mouseMoved, false);
                        window.addEventListener ("pointerup", mouseUp, false);
                        break;
                    case 1:
                        // right click
                        break;
                }
                break;
            case 2:
                // scroll
                break;
        }
        return hole (event);
    };

    let mouseWheel = function (event) {
        onReady.notify (Float3.copy ([0, 0, event.deltaY]));
        return hole (event);
    };

    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;

    let keyDown = function (event) {
        switch (event.keyCode) {
            case KEY_LEFT: onReady.notify ([-stepSize, 0.0, 0.0]); break;
            case KEY_RIGHT: onReady.notify ([stepSize, 0.0, 0.0]); break;
            default: onReady.notify ([0.0, 0.0, 0.0]); break;
        }
    };

    _.construct = function (elementId, onReadyIn, stepSizeIn) {
        onReady = onReadyIn;
        stepSize = DEFAULT_VALUE(stepSizeIn, 0.05);

        let element = document.getElementById(elementId);
        bound = element.getBoundingClientRect();
        element.addEventListener("pointerdown", mouseDown, false);
        element.addEventListener("keydown", keyDown, true);
        element.addEventListener("contextmenu", hole, false);
        element.addEventListener("wheel", mouseWheel, false);
        element.focus();
    };

    _.new = function (canvasId, onReadyIn, stepSizeIn) {
        return Object.create (_).construct(canvasId, onReadyIn, stepSizeIn);
    };

    return _;
} ();
