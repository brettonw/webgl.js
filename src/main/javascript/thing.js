let Thing = function () {
    let _ = Named (NAME_GENERATED);

    _.construct = function (parameters) {
        this.node = parameters.node;
        this.update = parameters.update;
    };

    _.updateAll = function (time) {
        _.forEach(function (thing) { thing.update (time); });
    };

    return _;
} ();
