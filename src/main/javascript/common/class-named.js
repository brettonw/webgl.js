    $.CLASS_NAME_REQUIRED = "CLASS_NAME_REQUIRED";
    $.CLASS_NAME_GENERATED = "CLASS_NAME_GENERATED";
    $.CLASS_NAME_OPTIONAL = "CLASS_NAME_OPTIONAL";

    let ClassNamed = $.ClassNamed = function (nameRequired) {
        DEFAULT_VALUE (nameRequired, $.CLASS_NAME_OPTIONAL);
        let _ = CLASS_BASE;

        // the container for names
        let index = OBJ;

        // name handling has several cases:
        // 1) it is supplied
        // 2) it is not supplied, but is auto-generated
        // 3) it is not supplied, and that is ok
        // 4) it is not supplied and that is an error
        // so a flag is needed indicating how to handle a name that is not present
        let uniqueNameId = 0;
        let validateName = function (name, replace) {
            // if the name was supplied, it's all good
            if ((typeof name !== "undefined") && (name != null)) {
                // but make sure it's not already in the index or we haven't declared we want to replace it
                if (!(name in index) || replace) {
                    return name;
                }
                throw "Duplicate name (" + name + ")";
            }

            // otherwise, we have to decide what to do, based on some construction parameters
            switch (nameRequired) {
                case $.CLASS_NAME_REQUIRED:
                    throw "Name is required";
                case $.CLASS_NAME_GENERATED:
                    return "id" + Utility.padNum(++uniqueNameId, 5);
                case $.CLASS_NAME_OPTIONAL:
                    return null;
            }
        };

        /**
         *
         * @param parameters
         * @param name
         * @return {_}
         */
        _.new = function (parameters, name) {
            // ensure parameters is a valid object
            DEFAULT_VALUE (parameters, OBJ);

            // validate the name, store a valid one in the parameters
            if ((name = validateName(name, DEFAULT_VALUE(parameters.replace, false))) != null) parameters.name = name;

            // create the object the normal way. carefully, "this" is the static instance of the class
            // we are deriving from ("new" probably isn't overloaded)
            let classNamed = SUPER.new.call (this, parameters);

            // index the object if we have a valid name
            if (name != null) {
                classNamed.name = name;
                index[name] = classNamed;
            }

            return classNamed;
        };

        /**
         *
         * @param name
         * @return {*}
         */
        _.get = function (name) {
            return index[name];
        };

        /**
         * get the name of this named thing (if it has one).
         *
         * @method getName
         * @return {string} the name of this node, or just "node".
         */
        _.getName = function () {
            return ("name" in this) ? this.name : "node";
        };

        /**
         *
         * @return {Object}
         */
        _.getIndex = function () {
            return index;
        };

        /**
         *
         * @param todo
         */
        _.forEach = function (todo) {
            // note this proceeds in hash order, whatever that might be
            for (let name in index) {
                let named = index[name];
                todo (named);
            }
        };

        return _;
    };
