var makeSquare = function () {
    return makeShape("square", function () {
        return {
            vertices:[
                -1, -1, 0,
                -1, 1, 0,
                1, 1, 0,
                1, -1, 0
            ],
            indices:[
                2, 1, 3, 1, 0, 3
            ]
        };
    } );
};
