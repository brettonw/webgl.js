let Shape = function () {
    let _ = Object.create (null);

    let shapes = Object.create (null);
    let currentShape;

    _.construct = function (name, buffers) {
        this.name = name;

        let makeBuffer = function (bufferType, source, itemSize) {
            let buffer = context.createBuffer ();
            context.bindBuffer (bufferType, buffer);
            context.bufferData (bufferType, source, context.STATIC_DRAW);
            buffer.itemSize = itemSize;
            buffer.numItems = source.length / itemSize;
            return buffer;
        };

        // we will use the combination of input
        // 0 vertex only
        // 1 vertex, normal
        // 2 vertex, texture
        // 3 vertex, normal, texture
        // 4 vertex, index
        // 5 vertex, normal, index
        // 6 vertex, texture, index
        // 7 vertex, normal, texture, index

        // build the buffers
        let HAS_NORMAL = 1;
        let HAS_TEXTURE = 2;
        let HAS_INDEX = 4;
        let drawFunctionIndex = 0;
        if ("position" in buffers) {
            this.positionBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.position), 3);
        } else {
            LOG("What you talking about willis?");
        }

        if ("normal" in buffers) {
            this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.normal), 3);
            drawFunctionIndex += HAS_NORMAL;
        }

        if ("texture" in buffers) {
            this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.texture), 2);
            drawFunctionIndex += HAS_TEXTURE;
        }

        if ("index" in buffers) {
            this.indexBuffer =  makeBuffer (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (buffers.index), 1);
            drawFunctionIndex += HAS_INDEX;
        }

        this.draw = [
            // 0 vertex only
            function () {
                if (this.setCurrentShape ()) {
                    Shader.bindPositionAttribute (this.positionBuffer);
                }
                context.drawArrays(context.TRIANGLES, 0, this.positionBuffer.numItems);
            },
            // 1 vertex, normal
            function () {
                if (this.setCurrentShape ()) {
                    Shader
                        .bindPositionAttribute (this.positionBuffer)
                        .bindNormalAttribute (this.normalBuffer);
                }
                context.drawArrays(context.TRIANGLES, 0, this.positionBuffer.numItems);
            },
            // 2 vertex, texture
            function () {
                if (this.setCurrentShape ()) {
                    Shader
                        .bindPositionAttribute (this.positionBuffer)
                        .bindTextureAttribute (this.textureBuffer);
                }
                context.drawArrays(context.TRIANGLES, 0, this.positionBuffer.numItems);
            },
            // 3 vertex, normal, texture
            function () {
                if (this.setCurrentShape ()) {
                    Shader
                        .bindPositionAttribute (this.positionBuffer)
                        .bindNormalAttribute (this.normalBuffer)
                        .bindTextureAttribute (this.textureBuffer);
                }
                context.drawArrays(context.TRIANGLES, 0, this.positionBuffer.numItems);
            },
            // 4 vertex, index
            function () {
                if (this.setCurrentShape ()) {
                    Shader.bindPositionAttribute (this.positionBuffer);
                    context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                }
                context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
            },
            // 5 vertex, normal, index
            function () {
                if (this.setCurrentShape ()) {
                    Shader
                        .bindPositionAttribute (this.positionBuffer)
                        .bindNormalAttribute (this.normalBuffer);
                    context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                }
                context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
            },
            // 6 vertex, texture, index
            function () {
                if (this.setCurrentShape ()) {
                    Shader
                        .bindPositionAttribute (this.positionBuffer)
                        .bindTextureAttribute (this.textureBuffer);
                    context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                }
                context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
            },
            // 7 vertex, normal, texture, index
            function () {
                if (this.setCurrentShape ()) {
                    Shader
                        .bindPositionAttribute (this.positionBuffer)
                        .bindNormalAttribute (this.normalBuffer)
                        .bindTextureAttribute (this.textureBuffer);
                    context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                }
                context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
            },
        ][drawFunctionIndex];

        return this;
    };

    _.setCurrentShape = function () {
        if (currentShape !== this) {
            currentShape = this;
            return true;
        }
        return false;
    };

    _.new = function (name, buffers) {
        return (shapes[name] = Object.create (_).construct (name, buffers ()));
    };

    _.get = function (name) {
        return shapes[name];
    };

    return _;
} ();
