/**
 * A 4x4 matrix used as a 3D transformation
 *
 * @class Float4x4
 * @extends FloatNxN
 */
let Float4x4 = function () {
    let dim = 4;
    let _ = FloatNxN (dim);

    _.inverse = function (from, to) {
        // adapted from a bit of obfuscated, unwound, code
        to = DEFAULT_FUNCTION(to, _.create);
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


    _.multiplyVec4 = function (a, b, c) {
        c || (c = b);
        let d = b[0], e = b[1], g = b[2]; b = b[3];
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

    /**
     *
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     * @param to
     * @returns {*}
     */
    let frustum = function (left, right, bottom, top, near, far, to) {
        to = DEFAULT_FUNCTION(to, _.create);
        let width = right - left, height = top - bottom, depth = far - near;
        to[0] = (near * 2) / width; to[1] = 0; to[2] = 0; to[3] = 0;
        to[4] = 0; to[5] = (near * 2) / height; to[6] = 0; to[7] = 0;
        to[8] = (right + left) / width; to[9] = (top + bottom) / height; to[10] = -(far + near) / depth; to[11] = -1;
        to[12] = 0; to[13] = 0; to[14] = (-2.0 * far * near) / depth; to[15] = 0;
        return to;
    };
    _.frustum = frustum;

    /**
     *
     * @param fov
     * @param aspectRatio
     * @param nearPlane
     * @param farPlane
     * @param to
     */
    _.perspective = function (fov, aspectRatio, nearPlane, farPlane, to) {
        let halfWidth = nearPlane * Math.tan (Utility.degreesToRadians(fov * 0.5));
        let halfHeight = halfWidth * aspectRatio;
        return frustum (-halfHeight, halfHeight, -halfWidth, halfWidth, nearPlane, farPlane, to);
    };

    /**
     *
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     * @param to
     * @returns {*}
     */
    _.orthographic = function (left, right, bottom, top, near, far, to) {
        to = DEFAULT_FUNCTION(to, _.create);
        let width = right - left, height = top - bottom, depth = far - near;
        to[0] = 2 / width; to[1] = 0; to[2] = 0; to[3] = 0;
        to[4] = 0; to[5] = 2 / height; to[6] = 0; to[7] = 0;
        to[8] = 0; to[9] = 0; to[10] = -2 / depth; to[11] = 0;
        to[12] = -(left + right) / width; to[13] = -(top + bottom) / height; to[14] = -(far + near) / depth; to[15] = 1;
        return to;
    };

    /**
     *
     * @param u
     * @param v
     * @param n
     * @param from
     * @returns {FloatNxN|Object}
     */
    let viewMatrix = function (u, v, n, from) {
        let to = _.create();
        to[0] = u[0]; to[1] = u[1]; to[2] = u[2]; to[3] = 0;
        to[4] = v[0]; to[5] = v[1]; to[6] = v[2]; to[7] = 0;
        to[8] = n[0]; to[9] = n[1]; to[10] = n[2]; to[11] = 0;
        to[12] = -Float3.dot (from, u); to[13] = -Float3.dot (from, v); to[14] = -Float3.dot (from, n); to[15] = 1;
        return to;
    };
    _.viewMatrix = viewMatrix;

    /**
     *
     * @param from
     * @param at
     * @param up
     */
    _.lookFromAt = function (from, at, up) {
        up = DEFAULT_VALUE(up, [0, 1, 0]);
        let viewPlaneNormal = Float3.normalize (Float3.subtract (from, at));
        let u =  Float3.cross (Float3.normalize (up), viewPlaneNormal);
        let v = Float3.cross (viewPlaneNormal, u);
        return viewMatrix (u, v, viewPlaneNormal, from);
    };

    /**
     * 
     * @param span
     * @param fov
     * @param along
     * @param at
     * @param up
     * @returns {FloatNxN|Object}
     */
    _.lookAlongAt = function (span, fov, along, at, up) {
        up = DEFAULT_VALUE(up, [0, 1, 0]);
        let viewPlaneNormal = Float3.normalize (along);
        let u =  Float3.cross (Float3.normalize (up), viewPlaneNormal);
        let v = Float3.cross (viewPlaneNormal, u);

        // compute the actual camera location based on the field of view and desired view span
        let distance = span / Math.tan (Utility.degreesToRadians(fov * 0.5));
        let from = Float3.add (at, Float3.scale (viewPlaneNormal, distance));
        return viewMatrix (u, v, viewPlaneNormal, from);

    };

    /*
    eval (function () {
        let index = _.index;
        let str = "_.copy = function (from, to) { ";
        str += "to = (typeof to !== 'undefined') ? to : _.create (); ";
        for (let i = 0; i < size; ++i) {
            str += "to[" + i + "] = from[" + i + "]; ";
        }
        str += "return to; ";
        str += "}; ";
        return str;
    } ());
*/
/*
    matrix_3d	RotateX (real angle)																									//	build a transformation matrix_3d
    {																																								//	begin
        angle = DegreesToRadians (angle);																							//	convert degrees to radians
        real	cosine = COS (angle),																										//	compute the cosine of the angle
        sine = SIN (angle);																											//	compute the sine of the angle
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (1, 1) = cosine;																														//	scale the y rotation by the cosine
        m (2, 2) = cosine;																														//	scale the z rotation by the cosine
        m (2, 1) = -sine;																															//	scale the y rotation by the -sine
        m (1, 2) = sine;																															//	scale the z rotation by the sine
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation to rotate a point_3d about the y axis
//------------------------------------------------------------------------------
    matrix_3d	RotateY (real angle)																									//	build a transformation matrix_3d
    {																																								//	begin
        angle = DegreesToRadians (angle);																							//	convert degrees to radians
        real	cosine = COS (angle),																										//	compute the cosine of the angle
        sine = SIN (angle);																											//	compute the sine of the angle
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (0, 0) = cosine;																														//	scale the x rotation by the cosine
        m (2, 2) = cosine;																														//	scale the z rotation by the cosine
        m (2, 0) = sine;																															//	scale the x rotation by the sine
        m (0, 2) = -sine;																															//	scale the z rotation by the -sine
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation to rotate a point_3d about the z axis
//------------------------------------------------------------------------------
    matrix_3d	RotateZ (real angle)																									//	build a transformation matrix_3d
    {																																								//	begin
        angle = DegreesToRadians (angle);																							//	convert degrees to radians
        real	cosine = COS (angle),																										//	compute the cosine of the angle
        sine = SIN (angle);																												//	compute the sine of the angle
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (0, 0) = cosine;																														//	scale the x rotation by the cosine
        m (1, 1) = cosine;																														//	scale the y rotation by the cosine
        m (1, 0) = -sine;																															//	scale the x rotation by the -sine
        m (0, 1) = sine;																															//	scale the y rotation by the sine
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation to translate a point_3d by a specified amount
//------------------------------------------------------------------------------
    matrix_3d	Translate (real x, real y, real z)																		//	build a transformation matrix_3d
    {																																								//	begin
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (3, 0) = x;																																	//	translate the x axis
        m (3, 1) = y;																																	//	translate the y axis
        m (3, 2) = z;																																	//	translate the z axis
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation to scale a point_3d by a specified amount
//------------------------------------------------------------------------------
    matrix_3d	Scale (real x, real y, real z)																				//	build a transformation matrix_3d
    {																																								//	begin
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (0, 0) = x;																																	//	scale the x axis
        m (1, 1) = y;																																	//	scale the y axis
        m (2, 2) = z;																																	//	scale the z axis
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation to produce a perspective projection
//------------------------------------------------------------------------------
    matrix_3d	Perspective (real distance)																						//	build a transformation matrix_3d
    {																																								//	begin
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (2, 3) = R(-1.0) / distance;																								//	set the perspective factor to 1.0 / distance to the picture plane_3d
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation for rotating to an arbitrary normalized basis
//------------------------------------------------------------------------------
    matrix_3d	VectorMatrix (tuple_3d &n)																						//	build a vector_3d rotation matrix_3d
    {																																								//	begin
        vector_3d	t (n),																															//	copy it
        w (n);
        t[w.MinorAxis ()] = R(1.0);																										//	set the minor axis to 1.0
        vector_3d	u = (t ^ w).Normalize (),																						//	compute a normal perpendicular vector_3d to w and t
        v = w ^ u;																														//	compute a normal perpendicular vector_3d to w and u
        matrix_3d	m (matrix_3d::identity);																						//	new identity matrix_3d
        m (0, 0) = u[X];																															//	assign the first row
        m (0, 1) = u[Y];
        m (0, 2) = u[Z];

        m (1, 0) = v[X];																															//	assign the second row
        m (1, 1) = v[Y];
        m (1, 2) = v[Z];

        m (2, 0) = w[X];																															//	assign the third row
        m (2, 1) = w[Y];
        m (2, 2) = w[Z];
        return m;																																			//	return the matrix_3d
    }																																								//	end

//------------------------------------------------------------------------------
//	Transformation for rotating to an arbitrary basis at an arbitrary location
//------------------------------------------------------------------------------
    matrix_3d	ViewMatrix (const vector_3d &u, const vector_3d &v, const vector_3d &n, const point_3d &r)	//	build a viewing matrix_3d from a vector_3d set
    {																																								//	begin
        matrix_3d	m;																																	//	new matrix_3d
        m (0, 0) = u[X];																															//	assign the first column
        m (1, 0) = u[Y];
        m (2, 0) = u[Z];
        m (3, 0) = -(r | u);

        m (0, 1) = v[X];																															//	assign the second column
        m (1, 1) = v[Y];
        m (2, 1) = v[Z];
        m (3, 1) = -(r | v);

        m (0, 2) = n[X];																															//	assign the third column
        m (1, 2) = n[Y];
        m (2, 2) = n[Z];
        m (3, 2) = -(r | n);

        m (0, 3) = R(0.0);																														//	assign the fourth column
        m (1, 3) = R(0.0);
        m (2, 3) = R(0.0);
        m (3, 3) = R(1.0);
        return m;																																			//	return the matrix_3d
    }																																								//	end
*/

    return _;
} ();
