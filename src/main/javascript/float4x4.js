let Float4x4 = function () {
    let _ = FloatNxN (4);

    _.inverse = function (from, to) {
        // adapted from a bit of obfuscated, unwound, code
        to = (typeof to !== "undefined") ? to : this.create ();
        let A = from[0] * from[5] - from[1] * from[4], B = from[0] * from[6] - from[2] * from[4],
            C = from[9] * from[14] - from[10] * from[13], D = from[9] * from[15] - from[11] * from[13],
            E = from[10] * from[15] - from[11] * from[14], F = from[0] * from[7] - from[3] * from[4],
            G = from[1] * from[6] - from[2] * from[5], H = from[1] * from[7] - from[3] * from[5],
            K = from[2] * from[7] - from[3] * from[6], L = from[8] * from[13] - from[9] * from[12],
            M = from[8] * from[14] - from[10] * from[12], N = from[8] * from[15] - from[11] * from[12],
            Q = 1 / (A * E - B * D + F * C + G * N - H * M + K * L);
        to[0] = (from[5] * E - from[6] * D + from[7] * C) * Q;
        to[1] = (-from[1] * E + from[2] * D - from[3] * C) * Q;
        to[2] = (from[13] * K - from[14] * H + from[15] * G) * Q;
        to[3] = (-from[9] * K + from[10] * H - from[11] * G) * Q;
        to[4] = (-from[4] * E + from[6] * N - from[7] * M) * Q;
        to[5] = (from[0] * E - from[2] * N + from[3] * M) * Q;
        to[6] = (-from[12] * K + from[14] * F - from[15] * B) * Q;
        to[7] = (from[8] * K - from[10] * F + from[11] * B) * Q;
        to[8] = (from[4] * D - from[5] * N + from[7] * L) * Q;
        to[9] = (-from[0] * D + from[1] * N - from[3] * L) * Q;
        to[10] = (from[12] * H - from[13] * F + from[15] * A) * Q;
        to[11] = (-from[8] * H + from[9] * F - from[11] * A) * Q;
        to[12] = (-from[4] * C + from[5] * M - from[6] * L) * Q;
        to[13] = (from[0] * C - from[1] * M + from[2] * L) * Q;
        to[14] = (-from[12] * G + from[13] * B - from[14] * A) * Q;
        to[15] = (from[8] * G - from[9] * B + from[10] * A) * Q;
        return to;
    };


    _.toRotationMat = function (a, b) {
        b || (b = _.create ());
        b[0] = a[0];
        b[1] = a[1];
        b[2] = a[2];
        b[3] = a[3];
        b[4] = a[4];
        b[5] = a[5];
        b[6] = a[6];
        b[7] = a[7];
        b[8] = a[8];
        b[9] = a[9];
        b[10] = a[10];
        b[11] = a[11];
        b[12] = 0;
        b[13] = 0;
        b[14] = 0;
        b[15] = 1;
        return b;
    };

    _.toMat3 = function (a, b) {
        b || (b = mat3.create ());
        b[0] = a[0];
        b[1] = a[1];
        b[2] = a[2];
        b[3] = a[4];
        b[4] = a[5];
        b[5] = a[6];
        b[6] = a[8];
        b[7] = a[9];
        b[8] = a[10];
        return b;
    };

    _.toInverseMat3 = function (a, b) {
        let c = a[0], d = a[1], e = a[2], g = a[4], f = a[5], h = a[6], i = a[8], j = a[9], k = a[10], l = k * f - h * j, o = -k * g + h * i, m = j * g - f * i, n = c * l + d * o + e * m;
        if (!n)return null;
        n = 1 / n;
        b || (b = mat3.create ());
        b[0] = l * n;
        b[1] = (-k * d + e * j) * n;
        b[2] = (h * d - e * f) * n;
        b[3] = o * n;
        b[4] = (k * c - e * i) * n;
        b[5] = (-h * c + e * g) * n;
        b[6] = m * n;
        b[7] = (-j * c + d * i) * n;
        b[8] = (f * c - d * g) * n;
        return b;
    };

    _.multiplyVec3 = function (a, b, c) {
        c || (c = b);
        let d = b[0], e = b[1];
        b = b[2];
        c[0] = a[0] * d + a[4] * e + a[8] * b + a[12];
        c[1] = a[1] * d + a[5] * e + a[9] * b + a[13];
        c[2] = a[2] * d + a[6] * e + a[10] * b + a[14];
        return c;
    };

    _.multiplyVec4 = function (a, b, c) {
        c || (c = b);
        let d = b[0], e = b[1], g = b[2];
        b = b[3];
        c[0] = a[0] * d + a[4] * e + a[8] * g + a[12] * b;
        c[1] = a[1] * d + a[5] * e + a[9] * g + a[13] * b;
        c[2] = a[2] * d + a[6] * e + a[10] * g + a[14] * b;
        c[3] = a[3] * d + a[7] * e + a[11] * g + a[15] * b;
        return c;
    };

    _.rotate = function (a, b, c, d) {
        let e = c[0], g = c[1];
        c = c[2];
        let f = Math.sqrt (e * e + g * g + c * c);
        if (!f)return null;
        if (f != 1) {
            f = 1 / f;
            e *= f;
            g *= f;
            c *= f
        }
        let h = Math.sin (b), i = Math.cos (b), j = 1 - i;
        b = a[0];
        f = a[1];
        let k = a[2], l = a[3], o = a[4], m = a[5], n = a[6], p = a[7], r = a[8], s = a[9], A = a[10], B = a[11], t = e * e * j + i, u = g * e * j + c * h, v = c * e * j - g * h, w = e * g * j - c * h, x = g * g * j + i, y = c * g * j + e * h, z = e * c * j + g * h;
        e = g * c * j - e * h;
        g = c * c * j + i;
        if (d) {
            if (a != d) {
                d[12] = a[12];
                d[13] = a[13];
                d[14] = a[14];
                d[15] = a[15]
            }
        } else d = a;
        d[0] = b * t + o * u + r * v;
        d[1] = f * t + m * u + s * v;
        d[2] = k * t + n * u + A * v;
        d[3] = l * t + p * u + B *
            v;
        d[4] = b * w + o * x + r * y;
        d[5] = f * w + m * x + s * y;
        d[6] = k * w + n * x + A * y;
        d[7] = l * w + p * x + B * y;
        d[8] = b * z + o * e + r * g;
        d[9] = f * z + m * e + s * g;
        d[10] = k * z + n * e + A * g;
        d[11] = l * z + p * e + B * g;
        return d;
    };

    _.rotateX = function (a, b, c) {
        let d = Math.sin (b);
        b = Math.cos (b);
        let e = a[4], g = a[5], f = a[6], h = a[7], i = a[8], j = a[9], k = a[10], l = a[11];
        if (c) {
            if (a != c) {
                c[0] = a[0];
                c[1] = a[1];
                c[2] = a[2];
                c[3] = a[3];
                c[12] = a[12];
                c[13] = a[13];
                c[14] = a[14];
                c[15] = a[15]
            }
        } else c = a;
        c[4] = e * b + i * d;
        c[5] = g * b + j * d;
        c[6] = f * b + k * d;
        c[7] = h * b + l * d;
        c[8] = e * -d + i * b;
        c[9] = g * -d + j * b;
        c[10] = f * -d + k * b;
        c[11] = h * -d + l * b;
        return c;
    };

    _.rotateY = function (a, b, c) {
        let d = Math.sin (b);
        b = Math.cos (b);
        let e = a[0], g = a[1], f = a[2], h = a[3], i = a[8], j = a[9], k = a[10], l = a[11];
        if (c) {
            if (a != c) {
                c[4] = a[4];
                c[5] = a[5];
                c[6] = a[6];
                c[7] = a[7];
                c[12] = a[12];
                c[13] = a[13];
                c[14] = a[14];
                c[15] = a[15]
            }
        } else c = a;
        c[0] = e * b + i * -d;
        c[1] = g * b + j * -d;
        c[2] = f * b + k * -d;
        c[3] = h * b + l * -d;
        c[8] = e * d + i * b;
        c[9] = g * d + j * b;
        c[10] = f * d + k * b;
        c[11] = h * d + l * b;
        return c;
    };

    _.rotateZ = function (a, b, c) {
        let d = Math.sin (b);
        b = Math.cos (b);
        let e = a[0], g = a[1], f = a[2], h = a[3], i = a[4], j = a[5], k = a[6], l = a[7];
        if (c) {
            if (a != c) {
                c[8] = a[8];
                c[9] = a[9];
                c[10] = a[10];
                c[11] = a[11];
                c[12] = a[12];
                c[13] = a[13];
                c[14] = a[14];
                c[15] = a[15]
            }
        } else c = a;
        c[0] = e * b + i * d;
        c[1] = g * b + j * d;
        c[2] = f * b + k * d;
        c[3] = h * b + l * d;
        c[4] = e * -d + i * b;
        c[5] = g * -d + j * b;
        c[6] = f * -d + k * b;
        c[7] = h * -d + l * b;
        return c;
    };

    _.frustum = function (a, b, c, d, e, g, f) {
        f || (f = _.create ());
        let h = b - a, i = d - c, j = g - e;
        f[0] = e * 2 / h;
        f[1] = 0;
        f[2] = 0;
        f[3] = 0;
        f[4] = 0;
        f[5] = e * 2 / i;
        f[6] = 0;
        f[7] = 0;
        f[8] = (b + a) / h;
        f[9] = (d + c) / i;
        f[10] = -(g + e) / j;
        f[11] = -1;
        f[12] = 0;
        f[13] = 0;
        f[14] = -(g * e * 2) / j;
        f[15] = 0;
        return f;
    };

    _.perspective = function (a, b, c, d, e) {
        a = c * Math.tan (a * Math.PI / 360);
        b = a * b;
        return _.frustum (-b, b, -a, a, c, d, e);
    };

    _.ortho = function (a, b, c, d, e, g, f) {
        f || (f = _.create ());
        let h = b - a, i = d - c, j = g - e;
        f[0] = 2 / h;
        f[1] = 0;
        f[2] = 0;
        f[3] = 0;
        f[4] = 0;
        f[5] = 2 / i;
        f[6] = 0;
        f[7] = 0;
        f[8] = 0;
        f[9] = 0;
        f[10] = -2 / j;
        f[11] = 0;
        f[12] = -(a + b) / h;
        f[13] = -(d + c) / i;
        f[14] = -(g + e) / j;
        f[15] = 1;
        return f;
    };

    _.lookAt = function (a, b, c, d) {
        d || (d = _.create ());
        let e = a[0], g = a[1];
        a = a[2];
        let f = c[0], h = c[1], i = c[2];
        c = b[1];
        let j = b[2];
        if (e == b[0] && g == c && a == j)return _.identity (d);
        let k, l, o, m;
        c = e - b[0];
        j = g - b[1];
        b = a - b[2];
        m = 1 / Math.sqrt (c * c + j * j + b * b);
        c *= m;
        j *= m;
        b *= m;
        k = h * b - i * j;
        i = i * c - f * b;
        f = f * j - h * c;
        if (m = Math.sqrt (k * k + i * i + f * f)) {
            m = 1 / m;
            k *= m;
            i *= m;
            f *= m
        } else f = i = k = 0;
        h = j * f - b * i;
        l = b * k - c * f;
        o = c * i - j * k;
        if (m = Math.sqrt (h * h + l * l + o * o)) {
            m = 1 / m;
            h *= m;
            l *= m;
            o *= m
        } else o = l = h = 0;
        d[0] = k;
        d[1] = h;
        d[2] = c;
        d[3] = 0;
        d[4] = i;
        d[5] = l;
        d[6] = j;
        d[7] = 0;
        d[8] = f;
        d[9] =
            o;
        d[10] = b;
        d[11] = 0;
        d[12] = -(k * e + i * g + f * a);
        d[13] = -(h * e + l * g + o * a);
        d[14] = -(c * e + j * g + b * a);
        d[15] = 1;
        return d;
    };

    return _;
} ();
