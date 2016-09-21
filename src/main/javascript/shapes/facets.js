var makeFacets = function (buffers) {
    let vertex = [];
    let normal = [];
    for (let face of buffers.face) {
        // get the first three vertices of the face to compute the normal
        let a = buffers.vertex[face[0]];
        let b = buffers.vertex[face[1]];
        let c = buffers.vertex[face[2]];
        let ab = Float3.normalize (Float3.subtract (b, a));
        let bc = Float3.normalize (Float3.subtract (c, b));
        let n = Float3.cross (ab, bc);

        // now loop over all of the points to add them to the vertices
        for (let i = 0; i < face.length; ++i) {
            vertex.push(buffers.vertex[face[i]]);
            normal.push(n);
        }
    }
    return {
        position: Utility.flatten (vertex),
        normal: Utility.flatten (normal)
    };
};
