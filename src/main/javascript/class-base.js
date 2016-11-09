let ClassBase = function () {
    let _ = OBJ;

    /**
     *
     * @param parameters
     * @returns {_}
     */
    _.new = function (parameters) {
        // create the object. this is a bit tricky here, as "this" is referring to a static instance
        // of the class we are deriving from ("new" probably isn't overloaded)
        let baseClass = Object.create (this);

        // ensure that we have parameters, then construct the object
        DEFAULT_VALUE (parameters, OBJ);
        baseClass.construct (parameters);
        return baseClass;
    };

    return _;
} ();
