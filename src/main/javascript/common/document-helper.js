    let DocumentHelper = function () {
        let _ = CLASS_BASE;

        /**
         *
         * @param id
         */
        _.element = function (id) {
            this[id] = document.getElementById (id);
            return this;
        };

        /**
         *
         * @param ids
         */
        _.elements = function (...ids) {
            for (let id of ids) {
                this.element (id);
            }
            return this;
        };

        /**
         *
         */
        _.all = function () {
            // find all of the elements in the document with ids...
            return this;
        };

        return _;
    } ();
