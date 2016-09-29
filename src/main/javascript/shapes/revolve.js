let makeRevolve = function (name, outline, normal, steps) {
    // outline is an array of Float2, and the axis of revolution is x = 0, we make a number of
    // wedges, from top to bottom, to complete the revolution.

    let epsilon = 1.0e-6;
    let last = outline.length - 1;

    // make sure we have normals, generating a default set if necessary
    normal = Utility.defaultFunction (normal, function () {
        // variable and function to capture the computed normals
        let N = [];
        let pushNormal = function (a, c) {
            let ac = Float2.subtract (a, c);
            let acPerp = Float2.perpendicular (ac);
            N.push (Float2.normalize (acPerp));
        };

        // loop over the outline points to compute a normal for each one, we use a vector that is
        // perpendicular to the segment ac as the normal.
        if (Float2.equals (outline[0], outline[last])) {
            // the shape is closed, so we want to wrap around
            for (b = 0; b < length; ++b) {
                let a = outline[((b - 1) + last) % last];
                let c = outline[(b + 1) % last];
                pushNormal (a, c);
            }
        } else {
            // the shape is open, so we double the first and last points for the normals
            // XXX there might be better ways to do this...
            for (b = 0; b <= last; ++b) {
                let a = outline[(b == 0) ? b : b - 1];
                let c = outline[(b == last) ? b : b + 1];
                pushNormal (a, c);
            }
        }
        return N;
    });

    return Shape.new (name, function () {
        // compute the steps we need to make to build the rotated shape
        let builder = ShapeBuilder.new ();
        let stepAngle = (2.0 * Math.PI) / steps;
        for (let i = 0; i < steps; ++i) {
            // this could be just i + 1, but doing the modulus might help prevent a crack
            let j = i + 1;
            let iAngle = i * stepAngle, iCosAngle = Math.cos (iAngle), iSinAngle = Math.sin (iAngle);
            let jAngle = (j % steps) * stepAngle, jCosAngle = Math.cos (jAngle), jSinAngle = Math.sin (jAngle);
            for (let m = 0; m < last; ++m) {
                // the line segment mn is now going to be swept over the angle range ij
                let n = m + 1;
                let vm = outline[m], nm = normal[m];
                let vn = outline[n], nn = normal[n];

                // we allow degenerate faces by duplicating vertices in the outline, if the length
                // between the two components is below the threshold, we skip this facet altogether.
                if (Float2.norm (vm, vn) > epsilon) {
                    // for each facet of the wedge, it's either a degenerate segment, an upward
                    // facing triangle, a downward facing triangle, or a quad.
                    let facetType = ((vm[0] < epsilon) ? 0 : 2) + ((vn[0] < epsilon) ? 0 : 1);
                    switch (facetType) {
                        case 0: // degenerate, emit nothing
                            break;
                        case 1: { // top cap, emit 1 triangle
                            let vim = builder.addVertexNormalTexture ([0, vm[1], 0], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, m / last]);
                            let vin = builder.addVertexNormalTexture ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, n / last]);
                            let vjn = builder.addVertexNormalTexture ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle], [j / steps, n / last]);
                            builder.addFace ([vim, vjn, vin]);
                            break;
                        }
                        case 2: { // bottom cap, emit 1 triangle
                            let vim = builder.addVertexNormalTexture ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, m / last]);
                            let vjm = builder.addVertexNormalTexture ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle], [j / steps, m / last]);
                            let vin = builder.addVertexNormalTexture ([0, vn[1], 0], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, n / last]);
                            builder.addFace ([vim, vjm, vin]);
                            break;
                        }
                        case 3: { // quad, emit 2 triangles
                            let vim = builder.addVertexNormalTexture ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, m / last]);
                            let vin = builder.addVertexNormalTexture ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, n / last]);
                            let vjm = builder.addVertexNormalTexture ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle], [j / steps, m / last]);
                            let vjn = builder.addVertexNormalTexture ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle], [j / steps, n / last]);
                            builder.addFace ([vim, vjm, vjn]);
                            builder.addFace ([vim, vjn, vin]);
                            break;
                        }
                    }
                }
            }
        }

        return builder.makeBuffers();
    });
};
