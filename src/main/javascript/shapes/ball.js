let makeBall = function (name, steps) {
    // generate an outline, and then revolve it
    let outline = [];
    let stepAngle = Math.PI / steps;
    for (let i = 0; i <= steps; ++i) {
        let angle = stepAngle * i;

        // using an angle setup so that 0 is (0, 1), and Pi is (0, -1) means switching (x, y) so we
        // get an outline that can be revolved around the x=0 axis
        outline.push (Float2.fixNum([Math.sin (angle), Math.cos (angle)]));
    }

    // revolve the surface, the outline is a half circle, so the revolved surface needs to be twice
    // as many steps to go all the way around
    return makeRevolve(name, outline, steps * 2);
};
