var makeSquare = function () {
    return Shape.new ("square", function () {
        return {
            vertex: [
                -1, -1, 0,
                -1, 1, 0,
                1, 1, 0,
                1, -1, 0
            ],
            index: [
                2, 1, 3, 1, 0, 3
            ]
        };
    });
};
