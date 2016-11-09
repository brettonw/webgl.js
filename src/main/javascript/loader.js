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
     * @param {Object} parameters an object specifying callback parameters (see "new")
     * @return {Loader}
     */
    _.construct = function (parameters) {
        this.onFinishedAll = DEFAULT_VALUE (parameters.onFinishedAll, { notify: function (x) {} });
        this.onFinishedItem = DEFAULT_VALUE (parameters.onFinishedItem, { notify: function (x) {} });
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
            // clear the pending item, and go
            delete this.pendingItem;
            this.onFinishedItem.notify(finishedItem);
            this.next ();
        } else {
            LOG (LogLevel.ERROR, "WHAT'S UP WILLIS?");
        }
    };

    /**
     * start the fetch process for all the loadable items.
     *
     * @method go
     * @param {Object} parameters an object specifying the scope and callback to call when an item
     * is finished, and when all items are finished (onFinishedAll, onFinishedItem).
     * @chainable
     */
    _.go = function (onFinishedEach, onFinishedAll) {
        this.onFinishedEach = DEFAULT_VALUE(onFinishedEach, { notify: function (x) {} });
        this.onFinishedAll = DEFAULT_VALUE(onFinishedAll, { notify: function (x) {} });
        this.next ();
    };

    /**
     * continue the fetch process for all the loadable items.
     *
     * @method next
     * @chainable
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

    /**
     * static method to create and construct a new Loader.
     *
     * @method new
     * @static
     * @param {Object} parameters an object specifying the scope and callback to call when an item
     * is finished, and when all items are finished (onFinishedAll, onFinishedItem).
     * @return {Loader}
     */
    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
