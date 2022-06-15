    /**
     * A loader for external shader assets.
     *
     * @class LoaderShader
     */
    let LoaderShader = $.LoaderShader = function () {
        let _ = Object.create (LoaderPath);

        /**
         * the initializer for a shader loader.
         *
         * @method construct
         * @param {string} path the common path for a path loader.
         * @return {LoaderShader}
         */
        _.construct = function (path) {
            return SUPER.construct.call(this, { type: Shader, path: path });
        };

        let addNames = function (names, prefix) {
            names = Array.isArray(names) ? names : Array(1).fill(names);
            let result = [];
            for (let name of names) {
                result.push (prefix + "-" + name);
            }
            return result;
        };

        // this constant is from the spec, moved it here because of a cross dependency on
        // having created the context already. I hope it never changes.
        const VERTEX_SHADER = 0x8B31;
        _.addVertexShaders = function (names) {
            return SUPER.addItems.call (this, addNames (names, "vertex"), { type: VERTEX_SHADER });
        };

        // this constant is from the spec, moved it here because of a cross dependency on
        // having created the context already. I hope it never changes.
        const FRAGMENT_SHADER = 0x8B30;
        _.addFragmentShaders = function (names) {
            return SUPER.addItems.call (this, addNames (names, "fragment"), { type: FRAGMENT_SHADER });
        };

        return _;
    } ();
