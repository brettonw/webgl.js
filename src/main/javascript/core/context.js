let context;

export let Context = function () {
    let _ = OBJ;

    _.get = function () { return context; };

    return _;
} ();
