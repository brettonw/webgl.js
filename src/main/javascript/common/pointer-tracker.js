    let PointerTracker = $.PointerTracker = function () {
        let _ = CLASS_BASE;

        let trackers = {};
        let previousDeltaSq = 0;

        let debugPeKeys = function () {
            //document.getElementById("pekeys").innerText = Object.keys (trackers[Object.keys (trackers)[0]].events).join(", ");
        };

        let hole = function (event) {
            event.stopPropagation();
            event.preventDefault();
            return false;
        };

        let pointerMoved = function (event) {
            let tracker = trackers[event.currentTarget.id];
            let events = tracker.events;

            // check if there is a tracker (because there was a pointer down)...
            if (event.pointerId in events) {
                // get the last event and save this one over it
                let lastEvent = events[event.pointerId];
                events[event.pointerId] = event;
                let bound = tracker.element.getBoundingClientRect();

                let ppfXY = function (e) { return [(e.clientX - bound.left) / bound.width, (e.clientY - bound.top) / -bound.height, 0.0] };
                let ppfZ = function (e) { return [0.0, 0.0, (e.clientY - bound.top) / -bound.height] };
                let ppfEmpty = function (e) { return [0.0, 0.0, 0.0]; };

                let simpleDelta = function () {
                    let a = ppf(event);
                    let b = ppf(lastEvent);
                    let delta = Float3.subtract (a, b);
                    if (Float3.normSq (delta) > 0) {
                        tracker.onReady.notify (delta);
                    }
                };

                let ppf;
                // look to see how many pointers we are tracking
                let eventKeys = Object.keys(events);
                switch (eventKeys.length) {
                    case 1:
                        // the simple move... check the buttons to decide how to handle it
                        ppf = [
                            ppfEmpty,
                            ppfXY, // left click
                            ppfZ, // right click
                            ppfEmpty, ppfEmpty, ppfEmpty
                        ][event.buttons];
                        simpleDelta ();
                        break;
                    case 2: {
                        // gestures - why doesn't the browser already do this?
                        // macos laptop does right click on 2-finger gesture (if configured that way in
                        // the settings)
                        // two-finger vertical slide reported as wheel
                        // pinch-in/out reported as wheel

                        let a = ppfXY(events[eventKeys[0]]);
                        let b = ppfXY(events[eventKeys[1]]);
                        let deltaSq = Float3.normSq (Float3.subtract (a, b));
                        if (previousDeltaSq > 0) {
                            let response = (deltaSq > previousDeltaSq) ? 1 : -1;
                            console.log ("response = " + response);
                            tracker.onReady.notify ([0.0, 0.0, response]);
                        }
                        previousDeltaSq = deltaSq;
                        break;
                    }
                    default:
                        // we don't handle this...
                        ppf = ppfEmpty;
                        simpleDelta();
                        break;
                }
            }
            return hole (event);
        };

        let pointerUp = function (event) {
            let tracker = trackers[event.currentTarget.id];
            delete tracker.events[event.pointerId];
            debugPeKeys ();
            return hole (event);
        };

        let pointerDown = function (event) {
            let tracker = trackers[event.currentTarget.id];
            tracker.events[event.pointerId] = event;
            previousDeltaSq = 0;
            debugPeKeys ();
            return hole (event);
        };

        let wheel = function (event) {
            let tracker = trackers[event.currentTarget.id];
            tracker.onReady.notify (Float3.copy ([0, 0, -event.deltaY]));
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
            return hole (event);
        };

        _.construct = function (parameters) {
            // get the elementId and save this tracker to the global list
            trackers[parameters.elementId] = this;

            // elementId, onReadyIn, stepSizeIn
            this.onReady = parameters.onReady;
            this.stepSize = DEFAULT_VALUE(parameters.stepSize, 0.05);
            this.events = {};

            // setup all the event handlers on this element
            let element = this.element = document.getElementById(parameters.elementId);
            element.addEventListener("pointerdown", pointerDown, false);
            element.addEventListener ("pointermove", pointerMoved, false);
            element.addEventListener ("pointerup", pointerUp, false);
            element.addEventListener ("pointercancel", pointerUp, false);
            element.addEventListener ("pointerleave", pointerUp, false);
            element.addEventListener ("pointerout", pointerUp, false);
            element.addEventListener("keydown", keyDown, false);
            element.addEventListener("wheel", wheel, false);
            element.addEventListener("contextmenu", hole, false);
            element.focus();
        };

        return _;
    } ();
