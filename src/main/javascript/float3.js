let Float3 = function () {
    let _ = FloatN (3);

    _.cross = function (left, right, to) {
        to = (typeof to !== 'undefined') ? to : _.create ();
        to[0] = (left[1] * right[2]) - (left[2] * right[1]);
        to[1] = (left[2] * right[0]) - (left[0] * right[2]);
        to[2] = (left[0] * right[1]) - (left[1] * right[0]);
        return to;
    };

    return _;
} ();
