var webgl;

var initWebGL = function () {
    try {
        var canvas = document.getElementById("view-canvas");
        webgl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
        webgl.viewportWidth = canvas.width;
        webgl.viewportHeight = canvas.height;
        webgl.viewport(0, 0, webgl.viewportWidth, webgl.viewportHeight);

        // extensions I want for getting gradient infomation inside the fragment shader
        webgl.getExtension("OES_standard_derivatives");
        webgl.getExtension("EXT_shader_texture_lod");

        // oh for &#^%'s sake, alpha blending should be standard
        webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);
        webgl.enable(webgl.BLEND);

        webgl.enable(webgl.CULL_FACE);

        webgl.clearColor (1.0, 1.0, 1.0, 1.0);

        webgl.enable (webgl.DEPTH_TEST);
    } catch (e) {
        console.log("EXCEPTION");
    }
    if (!webgl) {
        console.log("Could not initialise WebGL, sorry :-(");
    }
};
