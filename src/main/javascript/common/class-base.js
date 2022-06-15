    let ClassBase = $.ClassBase = function () {
        let _ = OBJ;

        /**
         *
         * @param parameters
         * @return {_}
         */
        _.new = function (parameters) {
            // create the object. this is a bit tricky here, as "this" is referring to a static instance
            // of the class we are deriving from ("new" probably isn't overloaded)
            let baseClass = Object.create (this);

            // if there is a constructor... ensure that we have parameters, then construct the object
            if ("construct" in baseClass) {
                DEFAULT_VALUE (parameters, OBJ);
                baseClass.construct (parameters);
            }
            return baseClass;
        };

        return _;
    } ();
