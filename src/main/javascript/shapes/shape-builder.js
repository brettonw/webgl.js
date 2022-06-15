    let ShapeBuilder = $.ShapeBuilder = function () {
        let _ = OBJ;

        _.construct = function (precision) {
            this.precision = DEFAULT_VALUE(precision, 7);
            this.vertexIndex = OBJ;
            this.vertices = [];
            this.faces = [];
            this.normals = [];
            this.texture = [];
            return this;
        };

        _.addVertex = function (vertex) {
            let str = Float3.str(vertex);
            if (str in this.vertexIndex) {
                return this.vertexIndex[str];
            } else {
                let index = this.vertices.length;
                this.vertices.push(vertex);
                this.vertexIndex[str] = index;
                return index;
            }
        };

        _.addVertexNormal = function (vertex, normal) {
            let str = Float3.str(vertex) + Float3.str(normal);
            if (str in this.vertexIndex) {
                return this.vertexIndex[str];
            } else {
                let index = this.vertices.length;
                this.vertices.push(vertex);
                this.normals.push (normal);
                this.vertexIndex[str] = index;
                return index;
            }
        };

        _.addVertexTexture = function (vertex, texture) {
            let str = Float3.str(vertex) + Float2.str(texture);
            if (str in this.vertexIndex) {
                return this.vertexIndex[str];
            } else {
                let index = this.vertices.length;
                this.vertices.push(vertex);
                this.texture.push (texture);
                this.vertexIndex[str] = index;
                return index;
            }
        };

        _.addVertexNormalTexture = function (vertex, normal, texture) {
            let str = Float3.str(vertex) + Float3.str(normal) + Float2.str(texture);
            if (str in this.vertexIndex) {
                return this.vertexIndex[str];
            } else {
                let index = this.vertices.length;
                this.vertices.push(vertex);
                this.normals.push (normal);
                this.texture.push (texture);
                this.vertexIndex[str] = index;
                return index;
            }
        };

        _.addFace = function (face) {
            this.faces.push(face);
        };

        _.makeBuffers = function () {
            LOG(LogLevel.TRACE, this.vertices.length + " vertices for " + this.faces.length + " faces");
            let result = {
                position: Utility.flatten(this.vertices),
                index: Utility.flatten(this.faces)
            };
            if (this.normals.length > 0) {
                result.normal = Utility.flatten(this.normals);
            }
            if (this.texture.length > 0) {
                result.texture = Utility.flatten(this.texture);
            }
            return result;
        };

        _.makeFacets = function () {
            let vertex = [];
            let normal = [];
            for (let face of this.faces) {
                // get the first three vertices of the face to compute the normal
                let a = this.vertices[face[0]];
                let b = this.vertices[face[1]];
                let c = this.vertices[face[2]];
                let ab = Float3.normalize(Float3.subtract(b, a));
                let bc = Float3.normalize(Float3.subtract(c, b));
                let n = Float3.cross(ab, bc);

                // now loop over all of the points to add them to the vertices
                for (let i = 0; i < face.length; ++i) {
                    vertex.push(this.vertices[face[i]]);
                    normal.push(n);
                }
            }
            return {
                position: Utility.flatten(vertex),
                normal: Utility.flatten(normal)
            };
        };

        _.new = function (precision) {
            return Object.create (ShapeBuilder).construct (precision);
        };

        return _;
    } ();
