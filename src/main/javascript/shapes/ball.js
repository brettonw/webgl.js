    let makeBall = $.makeBall = function (name, steps) {
        LOG (LogLevel.TRACE, "Make ball...");
        // generate an outline, and then revolve it
        let outline = [];
        let normal = [];
        let stepAngle = Math.PI / steps;
        for (let i = 0; i <= steps; ++i) {
            let angle = stepAngle * i;

            // using an angle setup so that 0 is (0, 1), and Pi is (0, -1) means switching (x, y) so we
            // get an outline that can be revolved around the x=0 axis
            let value = Float2.fixNum([Math.sin (angle), Math.cos (angle)]);
            outline.push (value);
            normal.push (value);
        }

        // revolve the surface, the outline is a half circle, so the revolved surface needs to be twice
        // as many steps to go all the way around
        return makeRevolve(name, outline, normal, steps * 2);
    };
