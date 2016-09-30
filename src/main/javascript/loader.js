/**
 * A loader for external assets.
 *
 * @class Loader
 */
let Loader = function () {
    let _ = Object.create (null);

    let items = [];

    /**
     * the initializer for a loader.
     *
     * @method construct
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Loader}
     */
    _.construct = function (onReady) {
        this.onReady = onReady;
        return this;
    };

    _.addItem = function (type, name, parameters) {
        let item = { type: type, name: name, parameters: parameters };
        items.push (item);
    };

    _.finish = function (finishedItem) {
        if (finishedItem === this.pendingItem) {
            // clear the pending item, and go
            delete this.pendingItem;
            this.go ();
        } else {
            LOG ("WHAT'S UP WILLIS?");
        }
    };

    _.go = function () {
        if (items.length > 0) {
            // have work to do, kick off a fetch
            let item = items.shift ();
            this.pendingItem = item.type.new (item.name, item.parameters, OnReady.new (this, this.finish));
        } else {
            // all done, inform our waiting handler
            this.onReady.notify (this);
        }
    };

    /**
     * static method to create and construct a new Shader.
     *
     * @method new
     * @static
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Loader}
     */
    _.new = function (onReady) {
        return Object.create (_).construct (onReady);
    };

    return _;
} ();
