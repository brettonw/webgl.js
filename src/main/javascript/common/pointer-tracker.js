export let PointerTracker = function () {
    let _ = CLASS_BASE;

    let trackers = {};

    let hole = function (event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
    };

    let pointerPositionFunctionXY = function (bound, event) {
        return [(event.clientX - bound.left) / bound.width, (event.clientY - bound.top) / bound.height, 0.0];
    }

    let pointerPositionFunctionZ = function (bound, event) {
        return [0.0, 0.0, (event.clientY - bound.top) / bound.height];
    }

    let pointerPositionFunctionEmpty = function (bound, event) {
        return [0.0, 0.0, 0.0];
    }

    let pointerMoved = function (event) {
        let tracker = trackers[event.currentTarget.id];

        // check if there is a tracker (because there was a pointer down)...
        if (event.pointerId in tracker.events) {
            // get the last event and save this one over it
            let lastEvent = tracker.events[event.pointerId];
            tracker.events[event.pointerId] = event;

            // look to see how many pointers we are tracking
            switch (Object.keys(tracker.events).length) {
                case 1:
                    // the simple move... check the buttons to decide how to handle it
                    let bound = tracker.element.getBoundingClientRect();
                    let pointerPositionFunction = pointerPositionFunctionEmpty;
                    switch (event.buttons) {
                        case 1: // primary button
                            pointerPositionFunction = pointerPositionFunctionXY;
                            break;
                        case 2: // secondary button
                            pointerPositionFunction = pointerPositionFunctionZ;
                            break;
                    }
                    let a = pointerPositionFunction(bound, event);
                    let b = pointerPositionFunction(bound, lastEvent);
                    let delta = Float3.subtract (a, b);
                    if (Float3.normSq (delta) > 0) {
                        tracker.onReady.notify (delta);
                    }

                    break;
                case 2:
                    // gestures - why doesn't the browser already do this?
                    // macos laptop does right click on 2-finger gesture (if configured that way in
                    // the settings)
                    // two-finger vertical slide reported as wheel
                    // pinch-in/out reported as wheel
                    break;
                default:
                    // we don't handle this...
                    break;
            }
        }
        return hole (event);
    };

    let pointerUp = function (event) {
        let tracker = trackers[event.currentTarget.id];
        delete tracker.events[event.pointerId];
        return hole (event);
    };

    let pointerDown = function (event) {
        let tracker = trackers[event.currentTarget.id];
        tracker.events[event.pointerId] = event;
        return hole (event);
    };

    let wheel = function (event) {
        let tracker = trackers[event.currentTarget.id];
        tracker.onReady.notify (Float3.copy ([0, 0, event.deltaY]));
        return hole (event);
    };

    const KEY_LEFT  = 37;
    const KEY_UP    = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN  = 40;

    let keyDown = function (event) {
        let tracker = trackers[event.currentTarget.id];
        switch (event.keyCode) {
            case KEY_LEFT: tracker.onReady.notify ([-tracker.stepSize, 0.0, 0.0]); break;
            case KEY_UP: tracker.onReady.notify ([0.0, tracker.stepSize, 0.0]); break;
            case KEY_RIGHT: tracker.onReady.notify ([tracker.stepSize, 0.0, 0.0]); break;
            case KEY_DOWN: tracker.onReady.notify ([0.0, -tracker.stepSize, 0.0]); break;
            default: tracker.onReady.notify ([0.0, 0.0, 0.0]); break;
        }
    };

    _.construct = function (parameters) {
        // get the elementId and save this tracker to the global list
        trackers[parameters.elementId] = this;

        // elementId, onReadyIn, stepSizeIn
        this.onReady = parameters.onReady;
        this.stepSize = DEFAULT_VALUE(parameters.stepSize, 0.05);
        this.pointerPositionFunction = pointerPositionFunctionEmpty;
        this.events = {};

        // setup all the event handlers on this element
        let element = this.element = document.getElementById(parameters.elementId);
        element.addEventListener("pointerdown", pointerDown, false);
        element.addEventListener ("pointermove", pointerMoved, false);
        element.addEventListener ("pointerup", pointerUp, false);
        element.addEventListener ("pointercancel", pointerUp, false);
        element.addEventListener("keydown", keyDown, false);
        element.addEventListener("wheel", wheel, false);
        element.addEventListener("contextmenu", hole, false);
        element.focus();
    };

    return _;
} ();
