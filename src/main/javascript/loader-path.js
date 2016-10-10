/**
 * A loader for external assets, which assumes assets reside in a common base path, and are named as
 * the file element is named.
 *
 * @class LoaderPath
 */
let LoaderPath = function () {
    let _ = Object.create (Loader);

    /**
     * the initializer for a loader.
     *
     * @method construct
     * @param {Object} onReady an object specifying the scope and callback to call when ready
     * @return {Loader}
     */
    _.construct = function (parameters) {
        Object.getPrototypeOf(_).construct.call(this, parameters);
        this.type = parameters.type;
        this.path = parameters.path;
        return this;
    };

    _.addItem = function (name, parameters) {
        let url = this.path.replace ("@", name);
        return Object.getPrototypeOf(_).addItem.call(this, this.type, name, url, parameters);
    };

    _.addItems = function (names, parameters) {
        for (let name of names) {
            this.addItem(name, parameters);
        }
        return this;
    };

    /**
     * static method to create and construct a new LoaderPath.
     *
     * @method new
     * @static
     * @param {Object} parameters an object including Loader class parameters, as well as the type
     * and urlBase to use for all operations.
     * @return {Loader}
     */
    _.new = function (parameters) {
        return Object.create (_).construct (parameters);
    };

    return _;
} ();
