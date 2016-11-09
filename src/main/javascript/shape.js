let Shape = function () {
    let _ = Named (NAME_REQUIRED);

    _.construct = function (parameters) {
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
        if ("position" in parameters) {
            this.positionBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (parameters.position), 3);
        } else {
            LOG (LogLevel.ERROR, "What you talking about willis?");
        }

        if ("normal" in parameters) {
            this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (parameters.normal), 3);
            drawFunctionIndex += HAS_NORMAL;
        }

        if ("texture" in parameters) {
            this.textureBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (parameters.texture), 2);
            drawFunctionIndex += HAS_TEXTURE;
        }

        if ("index" in parameters) {
            this.indexBuffer = makeBuffer (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (parameters.index), 1);
            drawFunctionIndex += HAS_INDEX;
        }

        this.draw = [
            // 0 vertex only
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program.bindPositionAttribute (this.positionBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 1 vertex, normal
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 2 vertex, texture
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 3 vertex, normal, texture
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                    }
                    context.drawArrays (context.TRIANGLES, 0, this.positionBuffer.numItems);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 4 vertex, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program.bindPositionAttribute (this.positionBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 5 vertex, normal, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 6 vertex, texture, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
            // 7 vertex, normal, texture, index
            function () {
                try {
                    let program = Program.getCurrentProgram();
                    if (program.useShape (this)) {
                        program
                            .bindPositionAttribute (this.positionBuffer)
                            .bindNormalAttribute (this.normalBuffer)
                            .bindTextureAttribute (this.textureBuffer);
                        context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    }
                    context.drawElements (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0);
                } catch (err) {
                    LOG (LogLevel.ERROR, err.message);
                }
            },
        ][drawFunctionIndex];

        return this;
    };

    return _;
} ();
