    let makeRevolve = $.makeRevolve = function (name, outline, normal, steps, projection) {
        // outline is an array of Float2, and the axis of revolution is x = 0, we make a number of
        // wedges, from top to bottom, to complete the revolution.
        // projection is a function to map the position to a texture coordinate

        let epsilon = 1.0e-6;
        let last = outline.length - 1;

        // make sure we have normals, generating a default set if necessary
        DEFAULT_VALUE (normal, makeNormal (outline));

        // default projection is a plate carree, equirectangular projection
        // https://en.wikipedia.org/wiki/Equirectangular_projection
        DEFAULT_VALUE (projection, function (uvY) { return uvY; });

        return Shape.new ({
            buffers: function () {
                // compute the steps we need to make to build the rotated shape
                LOG (LogLevel.TRACE, "Make revolved outline");
                let builder = ShapeBuilder.new ();
                let stepAngle = (-2.0 * Math.PI) / steps;
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
                        if (Float2.norm (Float2.subtract (vm, vn)) > epsilon) {
                            // for each facet of the wedge, it's either a degenerate segment, an upward
                            // facing triangle, a downward facing triangle, or a quad.
                            let facetType = ((vm[0] < epsilon) ? 0 : 2) + ((vn[0] < epsilon) ? 0 : 1);
                            switch (facetType) {
                                case 0: // degenerate, emit nothing
                                    break;
                                case 1: { // top cap, emit 1 triangle
                                    let vim = builder.addVertexNormalTexture ([0, vm[1], 0], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, projection (m / last)]);
                                    let vin = builder.addVertexNormalTexture ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, projection (n / last)]);
                                    let vjn = builder.addVertexNormalTexture ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle], [j / steps, projection (n / last)]);
                                    builder.addFace ([vim, vin, vjn]);
                                    break;
                                }
                                case 2: { // bottom cap, emit 1 triangle
                                    let vim = builder.addVertexNormalTexture ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, projection (m / last)]);
                                    let vjm = builder.addVertexNormalTexture ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle], [j / steps, projection (m / last)]);
                                    let vin = builder.addVertexNormalTexture ([0, vn[1], 0], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, projection (n / last)]);
                                    builder.addFace ([vim, vin, vjm]);
                                    break;
                                }
                                case 3: { // quad, emit 2 triangles
                                    let vim = builder.addVertexNormalTexture ([vm[0] * iCosAngle, vm[1], vm[0] * iSinAngle], [nm[0] * iCosAngle, nm[1], nm[0] * iSinAngle], [i / steps, projection (m / last)]);
                                    let vin = builder.addVertexNormalTexture ([vn[0] * iCosAngle, vn[1], vn[0] * iSinAngle], [nn[0] * iCosAngle, nn[1], nn[0] * iSinAngle], [i / steps, projection (n / last)]);
                                    let vjm = builder.addVertexNormalTexture ([vm[0] * jCosAngle, vm[1], vm[0] * jSinAngle], [nm[0] * jCosAngle, nm[1], nm[0] * jSinAngle], [j / steps, projection (m / last)]);
                                    let vjn = builder.addVertexNormalTexture ([vn[0] * jCosAngle, vn[1], vn[0] * jSinAngle], [nn[0] * jCosAngle, nn[1], nn[0] * jSinAngle], [j / steps, projection (n / last)]);
                                    builder.addFace ([vjm, vim, vjn, vjn, vim, vin]);
                                    break;
                                }
                            }
                        }
                    }
                }

                return builder.makeBuffers ();
            }
        }, name);
    };
