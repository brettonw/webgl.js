var makeSquare = function () {
    return Shape.new ("square", function () {
        return makeFacets({
            vertex: [
                [-1, -1, 0],
                [-1, 1, 0],
                [1, 1, 0],
                [1, -1, 0]
            ],
            face: [
                [2, 1, 3, 1, 0, 3]
            ]
        });
    });
};
