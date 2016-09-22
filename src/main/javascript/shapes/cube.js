let makeCube = function () {
    return Shape.new ("cube", function () {
        return makeFacets ({
            vertex: [
                [-1, -1, -1],
                [-1, 1, -1],
                [1, 1, -1],
                [1, -1, -1],
                [-1, -1, 1],
                [-1, 1, 1],
                [1, 1, 1],
                [1, -1, 1]
            ],
            face: [
                [0, 1, 2, 0, 2, 3],    // Front face
                [7, 6, 5, 7, 5, 4],    // Back face
                [1, 5, 6, 1, 6, 2],    // Top face
                [4, 0, 3, 4, 3, 7],    // Bottom face
                [4, 5, 1, 4, 1, 0],    // Left face
                [3, 2, 6, 3, 6, 7]     // Right face
            ]
        });
    });
};
