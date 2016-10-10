/**
 * A loader for external assets.
 *
 * @class Loader
 */
let Loader = function () {
    let _ = Object.create (null);

    /**
     * the initializer for a loader.
     *
     * @method construct
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Loader}
     */
    _.construct = function (parameters) {
        this.onFinishedAll = DEFAULT_VALUE (parameters.onFinishedAll, { notify: function (x) {} });
        this.onFinishedItem = DEFAULT_VALUE (parameters.onFinishedItem, { notify: function (x) {} });
        this.items = [];
        return this;
    };

    _.addItem = function (type, name, url, parameters) {
        let item = { type: type, name: name, url: url, parameters: parameters };
        this.items.push (item);
    };

    _.finish = function (finishedItem) {
        if (finishedItem === this.pendingItem) {
            // clear the pending item, and go
            delete this.pendingItem;
            this.onFinishedItem.notify(finishedItem);
            this.go ();
        } else {
            LOG ("WHAT'S UP WILLIS?");
        }
    };

    _.go = function () {
        if (this.items.length > 0) {
            // have work to do, kick off a fetch
            let item = this.items.shift ();
            this.pendingItem = item.type.new (item.name, item.url, item.parameters, OnReady.new (this, this.finish));
        } else {
            // all done, inform our waiting handler
            this.onFinishedAll.notify (this);
        }
    };

    /**
     * static method to create and construct a new Loader.
     *
     * @method new
     * @static
     * @param {Object} parameters an object specifying the scope and callback to call when an item is finsihed, and when
     * all items are finished (onFinishedAll, onFinishedItem).
     * @return {Loader}
     */
    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
