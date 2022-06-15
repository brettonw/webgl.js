    let Sphere = $.Sphere = function () {
        let _ = Object.create (Primitive);

        _.name = "sphere";

        _.parameters = {
            baseShapeBuilderType: Icosahedron,
            subdivisions: 4
        };

        _.getShapeBuilder = function () {
            let builder = ShapeBuilder.new ();

            let addVertex = function (vertex) {
                return builder.addVertex (Float3.normalize (vertex));
            };

            let baseShapeBuilder = this.parameters.baseShapeBuilderType.getShapeBuilder ();

            // add all the vertices and faces from the baseShapeBuilder into ours...
            for (let vertex of baseShapeBuilder.vertices) {
                addVertex (vertex);
            }
            let vertices = builder.vertices;
            let faces = builder.faces = baseShapeBuilder.faces;

            // function to subdivide a face
            let subdivide = function () {
                // remove the triangle we want to subdivide, which is always the first one
                let tri = faces.splice (0, 1)[0];

                // compute three new vertices as the averages of each pair of vertices
                let v0 = addVertex (Float3.add (vertices[tri[0]], vertices[tri[1]]));
                let v1 = addVertex (Float3.add (vertices[tri[1]], vertices[tri[2]]));
                let v2 = addVertex (Float3.add (vertices[tri[2]], vertices[tri[0]]));

                // add 4 new triangles to replace the one we removed
                builder.addFace ([tri[0], v0, v2]);
                builder.addFace ([tri[1], v1, v0]);
                builder.addFace ([tri[2], v2, v1]);
                builder.addFace ([v0, v1, v2]);
            };

            // subdivide the triangles we already defined, do this the requested number of times (3
            // seems to be the minimum for a spherical appearance)
            LOG (LogLevel.TRACE, "Build sphere...");
            for (let j = 0; j < this.parameters.subdivisions; ++j) {
                LOG (LogLevel.TRACE, "Iteration " + j + " with " + vertices.length + " points in " + faces.length + " triangles");
                for (let i = 0, faceCount = faces.length; i < faceCount; ++i) {
                    subdivide ();
                }
            }
            LOG (LogLevel.TRACE, "Finished sphere with " + vertices.length + " points in " + faces.length + " triangles");
            return builder;
        };

        _.makeFromBuilder = function (name, builder) {
            DEFAULT_VALUE(name, this.name);
            return Shape.new ({
                buffers: function () {
                    let buffers = builder.makeBuffers ();
                    buffers.normal = buffers.position;
                    return buffers;
                }
            }, name);
        };

        _.makeN = function (n) {
            this.parameters.subdivisions = n;
            this.make (this.name + n);
        };

        return _;
    } ();
