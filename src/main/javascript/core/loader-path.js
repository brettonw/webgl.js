    /**
     * A loader for external assets, which assumes assets reside in a common base path, and are named as
     * the file element is named.
     *
     * @class LoaderPath
     */
    let LoaderPath = $.LoaderPath = function () {
        let _ = Object.create (Loader);

        /**
         * the initializer for a path loader.
         *
         * @method construct
         * @param {Object} parameters an object specifying the loader class parameters
         * @return {Loader}
         */
        _.construct = function (parameters) {
            SUPER.construct.call(this, parameters);
            this.type = parameters.type;
            this.path = parameters.path;
            return this;
        };

        _.addItems = function (names, parameters) {
            names = Array.isArray(names) ? names : Array(1).fill(names);
            for (let name of names) {
                let params = Object.assign (OBJ, parameters, { url:this.path.replace ("@", name) });
                SUPER.addItem.call(this, this.type, name, params);
            }
            return this;
        };

        return _;
    } ();
