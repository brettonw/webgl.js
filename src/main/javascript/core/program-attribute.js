    let ProgramAttribute = function () {
        let _ = OBJ;

        _.construct = function (program, activeAttribute) {
            this.name = activeAttribute.name;
            this.type = activeAttribute.type;
            this.location = context.getAttribLocation (program, this.name);
            LOG (LogLevel.TRACE, "Program attribute: " + this.name + " at index " + this.location + " (type 0x" + this.type.toString(16) + ")");

            // set the bind function
            switch (this.type) {
                case 0x1404:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 1, context.INT, false, 0, 0);
                    };
                    break;
                case 0x8B53:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 2, context.INT, false, 0, 0);
                    };
                    break;
                case 0x8B54:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 3, context.INT, false, 0, 0);
                    };
                    break;
                case 0x8B55:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 4, context.INT, false, 0, 0);
                    };
                    break;
                case 0x1406:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 1, context.FLOAT, false, 0, 0);
                    };
                    break;
                case 0x8B50:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 2, context.FLOAT, false, 0, 0);
                    };
                    break;
                case 0x8B51:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 3, context.FLOAT, false, 0, 0);
                    };
                    break;
                case 0x8B52:
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        context.enableVertexAttribArray (this.location);
                        context.vertexAttribPointer (this.location, 4, context.FLOAT, false, 0, 0);
                    };
                    break;
                case 0x8B5C: // context.FLOAT_MAT4
                    this.bind = function () {
                        LOG(LogLevel.TRACE, "Bind attribute (" + this.name + ") at location " + this.location);
                        const bytesPerRow = 16;
                        const bytesPerMatrix = 4 * bytesPerRow;
                        for (let i = 0; i < 4; ++i) {
                            const location = this.location + i;
                            const offset = i * bytesPerRow;
                            context.enableVertexAttribArray (location);
                            context.vertexAttribPointer (location, 4, context.FLOAT, false, bytesPerMatrix, offset);
                            context.vertexAttribDivisor (location, 1);
                        }
                    };
                    break;
            }
            return this;
        };

        _.unbind = function () {
            LOG(LogLevel.TRACE, "Unbind attribute (" + this.name + ") at location " + this.location);
            context.disableVertexAttribArray (this.location);
        };

        _.new = function (program, activeAttribute) {
            return Object.create (_).construct (program, activeAttribute);
        };

        return _;
    } ();
