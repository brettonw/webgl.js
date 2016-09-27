let Primitive = function () {
    let _ = Object.create(null);

    _.getShapeBuilder = function () {
    };

    _.makeFromBuilder = function (name, builder) {
        name = DEFAULT_VALUE(name, this.name);
        return Shape.new(name, function () {
            return builder.makeFacets();
        });
    };

    _.make = function (name) {
        let builder = this.getShapeBuilder();
        return this.makeFromBuilder(name, builder);
    };

    return _;
}();
