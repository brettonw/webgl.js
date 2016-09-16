"use strict;"

var makeTetrahedron = function () {
    return makeShape("tetrahedron", function () {
        var overSqrt2 = 1 / Math.sqrt(2);
        return {
            vertices:[
                 1,  0, -overSqrt2,
                -1,  0, -overSqrt2,
                 0,  1,  overSqrt2,
                 0, -1,  overSqrt2
            ],
            indices:[
                0, 1, 2,
                1, 3, 2,
                2, 3, 0,
                3, 1, 0
            ]
        };
    } );
};
