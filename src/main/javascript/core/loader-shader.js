/**
 * A loader for external shader assets.
 *
 * @class LoaderShader
 */
let LoaderShader = function () {
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
    }

    _.addVertexShaders = function (names) {
        return SUPER.addItems.call (this, addNames (names, "vertex"), { type: context.VERTEX_SHADER });
    };

    _.addFragmentShaders = function (names) {
        return SUPER.addItems.call (this, addNames (names, "fragment"), { type: context.FRAGMENT_SHADER });
    };

    return _;
} ();
