var makeSquare = function () {
    return Shape.new ("square", function () {
        return {
            vertices: [
                -1, -1, 0,
                -1, 1, 0,
                1, 1, 0,
                1, -1, 0
            ],
            indices: [
                2, 1, 3, 1, 0, 3
            ]
        };
    });
};
