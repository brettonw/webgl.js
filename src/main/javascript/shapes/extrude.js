    let makeSimpleExtrude = $.makeSimpleExtrude = function (name, outline, length, normal, projection) {
        // outline is an array of Float2 in XY, and the axis of extrusion is Z = 0, we make a polygon
        // for each segment of the edge, skipping zero-length segments

        // make sure we have length, with default of 2, assuming an outline spans -1..1
        DEFAULT_VALUE (length, 2);

        // make sure we have normals, generating a default set if necessary
        DEFAULT_VALUE (normal, makeNormal (outline));

        return Shape.new ({
            buffers: function () {
                // compute the steps we need to make to build the extruded shape
                LOG (LogLevel.TRACE, "Make extruded outline");
                let builder = ShapeBuilder.new ();
                let epsilon = 1.0e-6;
                let halfLength = length / 2.0;

                let last = outline.length - 1;
                for (let m = 0; m < last; ++m) {
                    // the line segment mn is now going to be extruded along the z-axis
                    let n = m + 1;
                    let vm = outline[m], nm = normal[m];
                    let vn = outline[n], nn = normal[n];

                    // we allow degenerate faces by duplicating vertices in the outline, if the length
                    // between the two components is below the threshold, we skip this facet altogether.
                    if (Float2.norm (Float2.subtract (vm, vn)) > epsilon) {
                        // each facet of the outline is a quad, emit 2 triangles
                        let vm0 = builder.addVertexNormalTexture ([vm[0], vm[1], -halfLength], [nm[0], nm[1], 0], [0, m / last]);
                        let vm1 = builder.addVertexNormalTexture ([vm[0], vm[1], halfLength], [nm[0], nm[1], 0], [1, m / last]);

                        let vn0 = builder.addVertexNormalTexture ([vn[0], vn[1], -halfLength], [nn[0], nn[1], 0], [0, n / last]);
                        let vn1 = builder.addVertexNormalTexture ([vn[0], vn[1], halfLength], [nn[0], nn[1], 0], [1, n / last]);
                        builder.addFace ([vm0, vm1, vn1, vn0, vm0, vn1]);
                    }
                }

                return builder.makeBuffers ();
            }
        }, name);
    };
