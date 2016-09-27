let makeRevolve = function (name, outline, steps) {
    return Shape.new (name, function () {
        // outline is an array of Float2, and the axis of revolution is x = 0, we make a number of
        // wedges, from top to bottom, to complete the revolution. for each wedge, we will check to
        // see if the first and last x component is at 0, and if so we will generate a triangle
        // instead of a quad for that part of the wedge

        // variable and function to capture the computed normals
        let N = [];
        let pushNormal = function (a, c) {
            let ac = Float2.subtract (a, c);
            let acPerp = Float2.perpendicular(ac);
            N.push (Float2.normalize (acPerp));
        };

        // loop over the outline points to compute a normal for each one, we use a vector that is
        // perpendicular to the segment ac as the normal.
        let length = outline.length - 1;
        if (Float2.equals (outline[0], outline[outline.length - 1])) {
            // the shape is closed, so we want to wrap around
            for (b = 0; b < length; ++b) {
                let a = outline[((b - 1) + length) % length];
                let c = outline[(b + 1) % length];
                pushNormal(a, c);
            }
        } else {
            // the shape is open, so we double the first and last points for the normals
            // XXX there might be better ways to do this...
            for (b = 0; b <= length; ++b) {
                let a = outline[(b == 0) ? b : b - 1];
                let c = outline[(b == length) ? b : b + 1];
                pushNormal(a, c);
            }
        }

        // outline is an array of Float2, and the axis of revolution is x = 0, we make a number of
        // wedges, from top to bottom, to complete the revolution. for each wedge, we will check to
        // see if the first and last x component is at 0, and if so we will generate a triangle
        // instead of a quad for that part of the wedge

        // compute the steps we need to make to build the rotated shape
        let builder = ShapeBuilder.new ();
        let stepAngle = (2 * Math.PI) / steps;
        for (let i = 0; i < steps; ++i) {
            // this could be just i + 1, but doing the modulus might help prevent a crack
            let j = (i + 1) % steps;
            let iAngle = i * stepAngle, iCosAngle = Math.cos (iAngle), iSinAngle = Math.sin (iAngle);
            let jAngle = j * stepAngle, jCosAngle = Math.cos (jAngle), jSinAngle = Math.sin (jAngle);
            for (let m = 0, end = outline.length - 1; m < end; ++m) {
                // the line segment mn is now going to be swept over the angle range ij
                let n = m + 1;
                let vm = outline[m], nm = N[m];
                let vn = outline[n], nn = N[n];

                // if both end points are at the origin, we should skip revolving this segment
                if (!((vm[0] == 0) && (vn[0] == 0))) {

                    let vm0 = builder.addVertexNormal ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle]);
                    let vn0 = builder.addVertexNormal ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle]);

                    if (vm[0] == 0) {
                        // the top cap should be a triangle
                        let vn1 = builder.addVertexNormal ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle]);
                        builder.addFace ([vm0, vn1, vn0]);
                    } else if (vn[0] == 0) {
                        // the bottom cap should be a triangle
                        let vm1 = builder.addVertexNormal ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle]);
                        builder.addFace ([vn0, vm0, vm1]);
                    } else {
                        // the sweep is a quad (normal case)
                        let vm1 = builder.addVertexNormal ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle]);
                        let vn1 = builder.addVertexNormal ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle]);
                        builder.addFace ([vm0, vn1, vn0]);
                        builder.addFace ([vn1, vm0, vm1]);
                    }
                }
            }
        }

        return builder.makeBuffers();
    });
};
