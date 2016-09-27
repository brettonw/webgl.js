let makeRevolve = function (name, outline, steps) {
    return Shape.new (name, function () {
        let builder = ShapeBuilder.new ();

        // outline is an array of Float2, and the axis of revolution is x = 0, we make a number of
        // wedges, from top to bottom, to complete the revolution. for each wedge, we will check to
        // see if the first and last x component is at 0, and if so we will generate a triangle
        // instead of a quad for that part of the wedge
        let vertices = [];
        let stepAngle = (2 * Math.PI) / steps;
        for (let i = 0; i < steps; ++i) {
            // this could be just i + 1, but doing the modulus might help prevent a crack
            let j = (i + 1) % steps;
            let iAngle = i * stepAngle;
            let jAngle = j * stepAngle;
            for (let m = 0, end = outline.length - 1; m < end; ++m) {
                // the line segment mn is now going to be swept over the angle range ij
                let n = m + 1;
                let vm = outline[m];
                let vn = outline[n];

                let vm0 = Float3.fixNum ([vm[0] * Math.cos (iAngle), vm[1], vm[0] * Math.sin (iAngle)]);
                let vm1 = Float3.fixNum ([vm[0] * Math.cos (jAngle), vm[1], vm[0] * Math.sin (jAngle)]);
                let vn0 = Float3.fixNum ([vn[0] * Math.cos (iAngle), vn[1], vn[0] * Math.sin (iAngle)]);
                let vn1 = Float3.fixNum ([vn[0] * Math.cos (jAngle), vn[1], vn[0] * Math.sin (jAngle)]);

                let vm0i = builder.addVertex(vm0);
                let vm1i = builder.addVertex(vm1);
                let vn0i = builder.addVertex(vn0);
                let vn1i = builder.addVertex(vn1);

                if (vm[0] == 0) {
                    // the top cap should be a triangle
                    vertices.push (vm0);
                    vertices.push (vn1);
                    vertices.push (vn0);
                    builder.addFace([vm0i, vn1i, vn0i]);
                } else if (vn[0] == 0) {
                    // the bottom cap should be a triangle
                    vertices.push (vn0);
                    vertices.push (vm0);
                    vertices.push (vm1);
                    builder.addFace([vn0i, vm0i, vm1i]);
                } else {
                    // the sweep is a quad (normal case)
                    vertices.push (vm0);
                    vertices.push (vn1);
                    vertices.push (vn0);
                    builder.addFace([vm0i, vn1i, vn0i]);

                    vertices.push (vn1);
                    vertices.push (vm0);
                    vertices.push (vm1);
                    builder.addFace([vn1i, vm0i, vm1i]);
                }
            }
        }

        return builder.makeBuffers();
        /*
        LOG ("Revolved " + vertices.length + " points, for " + (vertices.length / 3) + " triangles.")

        // convert the triangle list to a point list with an index
        let pointIndex = Object.create (null);
        let points = [];
        let indices = [];
        for (let i = 0, end = vertices.length; i < end; ++i) {
            let str = Float3.str (vertices[i]);
            if (str in pointIndex) {
                indices.push(pointIndex[str]);
            } else {
                let index = points.length;
                points.push (vertices[i]);
                indices.push(index);
                pointIndex[str] = index;
            }
        }
        LOG ("Reduced to " + points.length + " points.");

        // return the flattened vertices, and indices
        return {
            position: Utility.flatten (points),
            index: indices
        };
        */
    });
};
