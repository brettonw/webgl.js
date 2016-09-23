var TestContainer = function () {
    var _ = Object.create (null);

    // test design philosophy is to be verbose on failure, and silent on pass
    let assertEquals = function (msg, a, b) {
        a = (!isNaN (a)) ? Utility.fixNum (a) : a;
        b = (!isNaN (b)) ? Utility.fixNum (b) : b;
        if (a != b) {
            LOG ("FAIL: " + msg + " (" + a + " == " + b + ")");
            return false;
        }
        return true;
    };

    let assertArrayEquals = function (msg, a, b) {
        if (a.length == b.length) {
            for (let i = 0; i < a.length; ++i) {
                if (!assertEquals(msg + "[" + i + "]", a[i], b[i])) {
                    return false;
                }
            }
            return true;
        } else {
            LOG (msg + " (mismatched arrays, FAIL)");
            return false;
        }
    };

    let tests = [
        function () {
            LOG ("Float4x4...");
            let viewMatrix = Float4x4.identity ();
            Float4x4.rotate (viewMatrix, Utility.degreesToRadians (27.5), [ 1, 0, 0 ]);
            viewMatrix  = Float4x4.multiply (Float4x4.translate ([ 0, -1.5, -3.5 ]), viewMatrix);
            Float4x4.rotate (viewMatrix, Utility.degreesToRadians (10), [ 0, 1, 0 ]);
            viewMatrix = Float4x4.multiply (Float4x4.scale ([ 2, 2, 2 ]), viewMatrix);
            viewMatrix  = Float4x4.multiply (Float4x4.translate ([ -0.5, -0.5, -0.5 ]), viewMatrix);

            let inverted = Float4x4.inverse(viewMatrix, Float4x4.create());
            let inverted2 = [
                0.49240389466285706, 1.7235358695799619e-9, 0.08682408928871155, 0,
                0.040090903639793396, 0.4435054361820221, -0.22736681997776031, 0,
                -0.07701390981674194, 0.23087431490421295, 0.4367676079273224, -0,
                0.1961156576871872, 1.25, 2.2234134674072266, 1
            ];
            assertArrayEquals("inverted == inverted2", inverted, inverted2)
        }
    ];

    _.runTests = function () {
        LOG ("Running Tests...");
        for (let test of tests) {
            LOG ("TEST");
            test ();
        }
        LOG ("Finished Running Tests.");
    };

    return _;
} ();

TestContainer.runTests();
