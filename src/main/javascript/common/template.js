    let Template = function () {
        let superclass = null;
        let _ = Object.create (superclass);

        // the container for names
        let templates = OBJ;

        _.new = function (name, parameters) {

        };

        _.construct = function (parameters) {
            // "this" is the local storage, so values on this that are not static should be declared and
            // set here
            this.y = 12;
        };

        // private static internal values and methods
        const PI = 3.141592654;
        let x = 42;
        let internalFunction = function (p) {
            return p + PI;
        };

        // public static function and methods
        _.publicMethod = function (q) {
            return internalFunction(q) + x;
        };

        return _;
    } ();
