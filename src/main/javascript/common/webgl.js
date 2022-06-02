"use strict;"

let WebGl = function () {
    let _ = Object.create (null);

    _.getContext = function () { return context; };

    return _;
} ();
