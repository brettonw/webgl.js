let makeTetrahedron = function () {
    return Shape.new ("tetrahedron", function () {
        let overSqrt2 = 1 / Math.sqrt (2);
        return makeFacets ({
            vertex: [
                [1, 0, -overSqrt2],
                [-1, 0, -overSqrt2],
                [0, 1, overSqrt2],
                [0, -1, overSqrt2]
            ],
            face: [
                [0, 1, 2],
                [1, 3, 2],
                [2, 3, 0],
                [3, 1, 0]
            ]
        });
    });
};
