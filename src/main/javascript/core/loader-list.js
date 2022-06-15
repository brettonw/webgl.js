    /**
     * A loader for loaders.
     *
     * @class LoaderList
     */
    let LoaderList = $.LoaderList = function () {
        let _ = CLASS_BASE;

        /**
         * the initializer for a loader.
         *
         * @method construct
         * @param {Object} parameters not used.
         * @return {LoaderList}
         */
        _.construct = function (parameters) {
            this.items = [];
            this.onReady = OnReady.new (this, this.finish);
            return this;
        };

        _.addLoaders = function (...loaders) {
            if (Array.isArray (loaders[0])) { loaders = loaders[0]; }
            for (let loader of loaders) {
                this.items.push (loader);
            }
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

        _.next = function () {
            if (this.items.length > 0) {
                // have work to do, kick off a fetch
                let item = this.items.shift ();
                this.pendingItem = item;
                item.go (this.onReady);
            } else {
                // all done, inform our waiting handler
                this.onFinishedAll.notify (this);
            }
        };

        /**
         * start the fetch process for all the loaders
         *
         * @method go
         * @param {Object} onFinishedAll an OnReady object to notify when the loader is finished.
         */
        _.go = function (onFinishedAll) {
            this.onFinishedAll = DEFAULT_VALUE(onFinishedAll, { notify: function (x) {} });
            this.next ();
        };

        return _;
    } ();
