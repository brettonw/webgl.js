    let makeNormal = function (outline) {
        let last = outline.length - 1;

        // variable and function to capture the computed normals
        let N = [];
        let pushNormal = function (a, c) {
            let ac = Float2.subtract (a, c);
            let acPerp = Float2.perpendicular (ac);
            N.push (Float2.normalize (acPerp));
        };

        // loop over the outline points to compute a normal for each one, we use a vector that is
        // perpendicular to the segment ac as the normal.
        if (Float2.equals (outline[0], outline[last])) {
            // the shape is closed, so we want to wrap around
            for (let b = 0; b <= last; ++b) {
                let a = outline[((b - 1) + last) % last];
                let c = outline[(b + 1) % last];
                pushNormal (a, c);
            }
        } else {
            // the shape is open, so we double the first and last points for the normals
            // XXX there might be better ways to do this...
            for (let b = 0; b <= last; ++b) {
                let a = outline[(b === 0) ? b : b - 1];
                let c = outline[(b === last) ? b : b + 1];
                pushNormal (a, c);
            }
        }
        return N;
    };
