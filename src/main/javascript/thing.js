let Thing = function () {
    let _ = Object.create (null);

    let things = Object.create (null);

    _.construct = function (name, node, update) {
        this.name = name;
        this.node = node;
        this.update = update;
        return this;
    };

    _.new = function (name, node, update) {
        return (things[name] = Object.create (_).construct (name, node, update));
    };

    /**
     * fetch a thing by name.
     *
     * @method get
     * @static
     * @param {string} name the name of the thing to return
     * @return {Thing}
     */
    _.get = function (name) {
        return things[name];
    };

    _.updateAll = function (time) {
        for (let name in things) {
            let thing = things[name];
            thing.update (time);
        }
    };

    return _;
} ();
