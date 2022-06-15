    let Thing = $.Thing = function () {
        let _ = ClassNamed ($.CLASS_NAME_GENERATED);

        _.construct = function (parameters) {
            LOG(LogLevel.INFO, "Thing: " + parameters.name);

            this.node = parameters.node;
            this.update = parameters.update;
        };

        _.updateAll = function (time) {
            _.forEach(function (thing) { thing.update (time); });
        };

        return _;
    } ();
