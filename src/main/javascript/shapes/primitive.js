    let Primitive = $.Primitive = function () {
        let _ = OBJ;

        _.getShapeBuilder = function () {
        };

        _.makeFromBuilder = function (name, builder) {
            DEFAULT_VALUE(name, this.name);
            return Shape.new({
                buffers: function () {
                    return builder.makeFacets ();
                }
            }, name);
        };

        _.make = function (name) {
            let builder = this.getShapeBuilder();
            return this.makeFromBuilder(name, builder);
        };

        return _;
    }();
