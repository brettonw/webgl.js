const NAME_REQUIRED = "NAME_REQUIRED";
const NAME_GENERATED = "NAME_GENERATED";
const NAME_OPTIONAL = "NAME_OPTIONAL";

let Named = function (nameRequired) {
    DEFAULT_VALUE (nameRequired, NAME_OPTIONAL);
    let _ = Object.create (null);

    // the container for names
    let namedIndex = Object.create (null);

    // name handling has several cases:
    // 1) it is supplied
    // 2) it is not supplied, but is auto-generated
    // 3) it is not supplied, and that is ok
    // 4) it is not supplied and that is an error
    // so a flag is needed indicating how to handle a name that is not present
    let uniqueNameId = 0;
    let validateName = function (name) {
        // if the name was supplied, it's all good
        if ((typeof name !== "undefined") && (name != null)) { return name; }

        // otherwise, we have to decide what to do, based on some construction parameters
        switch (nameRequired) {
            case NAME_REQUIRED:
                throw "Name is required";
            case NAME_GENERATED:
                return "id" + Utility.padNum(++uniqueNameId, 5);
            case NAME_OPTIONAL:
                return null;
        }
    };

    _.new = function (parameters, name) {
        // create the object
        let named = Object.create (_);

        // validate the name, if it's valid, then index the object
        if ((name = validateName(name)) != null) {
            named.name = name;
            namedIndex[name] = named;
        }

        // ensure that we have parameters, and the ones we have are correct
        DEFAULT_VALUE (parameters, Object.create (null));
        if ("validate" in _) _.validate (parameters);

        // construct the object, and then return it
        named.construct (parameters);
        return named;
    };

    _.get = function (name) {
        return namedIndex[name];
    };

    _.getIndex = function () {
        return namedIndex;
    };

    _.forEach = function (todo) {
        for (let name in namedIndex) {
            let named = namedIndex[name];
            todo (named);
        }
    };

    return _;
};
