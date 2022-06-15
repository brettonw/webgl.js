    let OnReady = $.OnReady = function () {
        let _ = OBJ;

        _.construct = function (scope, callback) {
            this.scope = scope;
            this.callback = callback;
            return this;
        };

        _.notify = function (parameter) {
            this.callback.call (this.scope, parameter);
        };

        _.new = function (scope, callback) {
            return Object.create (_).construct(scope, callback);
        };

        return _;
    } ();
