    let Shape = $.Shape = function () {
        let _ = ClassNamed ($.CLASS_NAME_REQUIRED);

        _.construct = function (parameters) {
            LOG (LogLevel.INFO, "Shape: " + parameters.name);

            let buffers = parameters.buffers ();

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

            // 8 vertex, color
            // 9 vertex, normal, color
            // 10 vertex, texture, color
            // 11 vertex, normal, texture, color
            // 12 vertex, color, index
            // 13 vertex, normal, color, index
            // 14 vertex, texture, color, index
            // 15 vertex, normal, texture, color, index

            // build the buffers
            const HAS_NORMAL = 1;
            const HAS_TEXTURE = 2;
            const HAS_INDEX = 4;
            const HAS_COLOR = 8;
            let drawFunctionIndex = 0;
            if ("position" in buffers) {
                this.positionBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.position), 3);
            } else {
                LOG (LogLevel.ERROR, "What you talking about willis?");
            }

            if ("normal" in buffers) {
                this.normalBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.normal), 3);
                drawFunctionIndex += HAS_NORMAL;
            }

            if ("texture" in buffers) {
                this.textureBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.texture), 2);
                drawFunctionIndex += HAS_TEXTURE;
            }

            if ("index" in buffers) {
                this.indexBuffer = makeBuffer (context.ELEMENT_ARRAY_BUFFER, new Uint16Array (buffers.index), 1);
                drawFunctionIndex += HAS_INDEX;
            }

            if ("color" in buffers) {
                this.colorBuffer = makeBuffer (context.ARRAY_BUFFER, new Float32Array (buffers.color), 4);
                drawFunctionIndex += HAS_COLOR;
            }

            this.draw = [
                // 0 vertex only
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced(context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 1 vertex, normal
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced (context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 2 vertex, texture
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced (context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 3 vertex, normal, texture
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced(context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 4 vertex, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 5 vertex, normal, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 6 vertex, texture, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 7 vertex, normal, texture, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },

                // 8 vertex, color
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced (context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 9 vertex, normal, color
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced (context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 10 vertex, texture, color
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced (context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 11 vertex, normal, texture, color
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                        }
                        context.drawArraysInstanced (context.TRIANGLES, 0, this.positionBuffer.numItems, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 12 vertex, color, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 13 vertex, normal, color, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 14 vertex, texture, color, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
                // 15 vertex, normal, texture, color, index
                function () {
                    try {
                        let program = Program.getCurrentProgram ();
                        if (program.useShape (this)) {
                            program
                                .bindPositionAttribute (this.positionBuffer)
                                .bindNormalAttribute (this.normalBuffer)
                                .bindTextureAttribute (this.textureBuffer)
                                .bindColorAttribute (this.colorBuffer)
                                .bindModelMatrixAttribute (this.instanceTransforms.buffer);
                            context.bufferSubData(context.ARRAY_BUFFER, 0, this.instanceTransforms.data);
                            context.bindBuffer (context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                        }
                        context.drawElementsInstanced (context.TRIANGLES, this.indexBuffer.numItems, context.UNSIGNED_SHORT, 0, this.instanceTransforms.count);
                    } catch (err) {
                        LOG (LogLevel.ERROR, err.message);
                    }
                },
            ][drawFunctionIndex];

            // create a default instance transform that is a single identity matrix
            // XXX nodes will create their own default objects
            //this.instanceTransforms = this.createInstanceTransforms ();

            return this;
        };

        _.createInstanceTransforms = function (matrices) {
            const bytesPerFloat = 4;
            const floatsPerMatrix = 16;

            // make the source valid, matrices could be undefined, a number, or an empty array
            if (typeof (matrices) === "undefined") {
                // make it be a number to be initialized by the next step
                matrices = 1;
            }
            if ((typeof(matrices) === "number") || (matrices.length === 0)) {
                let tmp = [];
                for (let i = 0, end = Math.max (1, matrices); i < end; ++i) {
                    tmp.push (Float4x4.IDENTITY);
                }
                matrices = tmp;
            }
            let count = matrices.length;

            // create the transforms
            let instanceTransforms = {
                count: count,
                data: new Float32Array(count * floatsPerMatrix),
                matrices: [],
                buffer: function () {
                    let buffer = context.createBuffer ();
                    context.bindBuffer (context.ARRAY_BUFFER, buffer);
                    context.bufferData (context.ARRAY_BUFFER, count * floatsPerMatrix * bytesPerFloat, context.DYNAMIC_DRAW);
                    return buffer;
                } ()
            };

            // create "views" into the data so we can update the transforms easily
            for (let i = 0; i < count; ++i) {
                const byteOffsetToMatrix = i * floatsPerMatrix * bytesPerFloat;
                let view = new Float32Array (instanceTransforms.data.buffer, byteOffsetToMatrix, floatsPerMatrix)
                instanceTransforms.matrices.push(view);

                // and init it to the source
                Float4x4.copy (matrices[i], view);
            }

            // return the result
            return instanceTransforms;
        };

        return _;
    } ();
