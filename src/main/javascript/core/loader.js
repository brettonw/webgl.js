    /**
     * A loader for external assets.
     *
     * @class Loader
     */
    let Loader = $.Loader = function () {
        let _ = CLASS_BASE;

        /**
         * the initializer for a loader.
         *
         * @method construct
         * @param {Object} parameters not used.
         * @return {Loader}
         */
        _.construct = function (parameters) {
            this.items = [];
            this.onReady = OnReady.new (this, this.finish);
            return this;
        };

        _.addItem = function (type, name, parameters) {
            parameters.onReady = this.onReady;
            let item = { type: type, name: name, parameters: parameters };
            this.items.push (item);
            return this;
        };

        _.finish = function (finishedItem) {
            if (finishedItem === this.pendingItem) {
                // clear the pending item, and go on to the next one
                delete this.pendingItem;
                this.next ();
            } else {
                LOG (LogLevel.ERROR, "WHAT'S UP WILLIS?");
            }
        };

        /**
         * start the fetch process for all the loadable items.
         *
         * @method go
         * @param {Object} onFinishedAll an OnReady object to notify when the loader is finished.
         */
        _.go = function (onFinishedAll) {
            this.onFinishedAll = DEFAULT_VALUE(onFinishedAll, { notify: function (x) {} });
            this.next ();
        };

        /**
         * continue the fetch process for all the loadable items.
         *
         * @method next
         */
        _.next = function () {
            if (this.items.length > 0) {
                // have work to do, kick off a fetch
                let item = this.items.shift ();
                this.pendingItem = item.type.new (item.parameters, item.name);
            } else {
                // all done, inform our waiting handler
                this.onFinishedAll.notify (this);
            }
        };

        return _;
    } ();
