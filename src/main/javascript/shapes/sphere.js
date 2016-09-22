let makeSphere = function (subdivisions) {
    return Shape.new ("sphere", function () {
        let overSqrt2 = 1 / Math.sqrt (2);
        let vertices = [
            Float3.normalize ([1, 0, -overSqrt2]),
            Float3.normalize ([-1, 0, -overSqrt2]),
            Float3.normalize ([0, 1, overSqrt2]),
            Float3.normalize ([0, -1, overSqrt2])
        ];
        let indices = [
            [0, 1, 2],
            [1, 3, 2],
            [2, 3, 0],
            [3, 1, 0]
        ];

        let subdivide = function () {
            // remove the triangle we want to subdivide, which is always the first one
            let tri = indices.splice (0, 1)[0];

            // compute three new vertices as the averages of each pair of vertices
            let v0 = vertices.length; vertices.push (Float3.normalize (Float3.add (vertices[tri[0]], vertices[tri[1]])));
            let v1 = vertices.length; vertices.push (Float3.normalize (Float3.add (vertices[tri[1]], vertices[tri[2]])));
            let v2 = vertices.length; vertices.push (Float3.normalize (Float3.add (vertices[tri[2]], vertices[tri[0]])));

            // add 4 new triangles to replace the one we removed
            indices.push ([tri[0], v0, v2]);
            indices.push ([tri[1], v1, v0]);
            indices.push ([tri[2], v2, v1]);
            indices.push ([v0, v1, v2]);
        };

        // subdivide the triangles we already defined, do this the requested number of times (3
        // seems to be the minimum for a spherical appearance)
        for (let j = 0; j < subdivisions; ++j) {
            for (let i = 0, iEnd = indices.length; i < iEnd; ++i) {
                subdivide (0);
            }
        }

        // report
        LOG ("Sphere with " + indices.length + " triangles");

        // flatten the vertices and indices
        return {
            position: Utility.flatten (vertices),
            index: Utility.flatten (indices)
        };
    });
};
