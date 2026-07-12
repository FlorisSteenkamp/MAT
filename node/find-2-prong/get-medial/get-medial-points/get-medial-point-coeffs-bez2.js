/**
 * Returns polynomial coefficients for ray parameter values `t`, bezier
 * parameter values `s` and medial points for points `q(t)` and b(s) (an order
 * 2 bezier curve) that satisfy the medial condition with respect to `p` and `ps`:
 *
 * Let `p` be a fixed point in the plane.
 * Let `v` be a direction vector defining the ray `q(t) = p + t⋅v`.
 * Let `ps` be a quadratic bezier curve.
 *
 * * `q(t)` is equidistant from `p` and the nearest point on `ps`
 * * that common distance is locally minimal among such candidates
 *
 * In other words, this function returns candidate ray parameters for the
 * sought medial point(s). Selecting physically valid solutions (if needed)
 * is done by the caller or by a later stage of this routine.
 *
 * @param p base point
 * @param v ray direction from `p`
 * @param ps quadratic bezier control points, i.e. an order 2 bezier curve
 * given as an array of control points, e.g. `[[0,0],[1,1],[2,1]]`
 */
function getMedialPointCoeffsBez2(p, v, ps) {
    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------
    const [px, py] = p;
    const [vx, vy] = v;
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    // Quadratic bezier in power basis: b(s) = a⋅s² + b⋅s + c
    const ax = x0 - 2 * x1 + x2;
    const ay = y0 - 2 * y1 + y2;
    const bx = -2 * x0 + 2 * x1;
    const by = -2 * y0 + 2 * y1;
    const cx = x0;
    const cy = y0;
    // u(s) = p - b(s) = u2⋅s² + u1⋅s + u0
    const u2x = -ax;
    const u2y = -ay;
    const u1x = -bx;
    const u1y = -by;
    const u0x = px - cx;
    const u0y = py - cy;
    // b'(s) = w(s) = w1⋅s + w0
    const w1x = 2 * ax;
    const w1y = 2 * ay;
    const w0x = bx;
    const w0y = by;
    // -----------------------------------------------------
    // E1(s,t): (u(s) + t⋅v) ⋅ b'(s) = 0
    // => C(s)⋅t + D(s) = 0
    const c1 = vx * w1x + vy * w1y;
    const c0 = vx * w0x + vy * w0y;
    // -----------------------------------------------------
    // -----------------------------------------------------
    const d3 = u2x * w1x + u2y * w1y;
    const d2 = u2x * w0x + u2y * w0y + u1x * w1x + u1y * w1y;
    const d1 = u1x * w0x + u1y * w0y + u0x * w1x + u0y * w1y;
    const d0 = u0x * w0x + u0y * w0y;
    // -----------------------------------------------------
    // -----------------------------------------------------
    // E2(s,t): |t⋅v|² - |u(s) + t⋅v|² = 0
    //         => 2⋅(v⋅u(s))⋅t + |u(s)|² = 0
    //         => A(s)⋅t + B(s) = 0
    const a2 = 2 * (vx * u2x + vy * u2y);
    const a1 = 2 * (vx * u1x + vy * u1y);
    const a0 = 2 * (vx * u0x + vy * u0y);
    // -----------------------------------------------------
    // -----------------------------------------------------
    const b4 = u2x * u2x + u2y * u2y;
    const b3 = 2 * (u2x * u1x + u2y * u1y);
    const b2 = 2 * (u2x * u0x + u2y * u0y) + (u1x * u1x + u1y * u1y);
    const b1 = 2 * (u1x * u0x + u1y * u0y);
    const b0 = u0x * u0x + u0y * u0y;
    // -----------------------------------------------------
    // const A = [a2, a1, a0];          // degree 2 in s
    // const B = [b4, b3, b2, b1, b0];  // degree 4 in s
    // const C = [c1, c0];              // degree 1 in s
    // const D = [d3, d2, d1, d0];      // degree 3 in s
    // Eliminate t from:
    //   A(s)⋅t + B(s) = 0
    //   C(s)⋅t + D(s) = 0
    // by taking A(s)⋅D(s) - B(s)⋅C(s) = 0 (degree ≤ 5 in s)
    // Explicit expansion of AD = multiply(A, D), descending in s.
    // const AD = [
    //     a2*d3,
    //     a2*d2 + a1*d3,
    //     a2*d1 + a1*d2 + a0*d3,
    //     a2*d0 + a1*d1 + a0*d2,
    //     a1*d0 + a0*d1,
    //     a0*d0
    // ];
    const AD5 = a2 * d3;
    const AD4 = a2 * d2 + a1 * d3;
    const AD3 = a2 * d1 + a1 * d2 + a0 * d3;
    const AD2 = a2 * d0 + a1 * d1 + a0 * d2;
    const AD1 = a1 * d0 + a0 * d1;
    const AD0 = a0 * d0;
    // Explicit expansion of BC = multiply(B, C), descending in s.
    // const BC = [
    //     b4*c1,
    //     b4*c0 + b3*c1,
    //     b3*c0 + b2*c1,
    //     b2*c0 + b1*c1,
    //     b1*c0 + b0*c1,
    //     b0*c0
    // ];
    const BC5 = b4 * c1;
    const BC4 = b4 * c0 + b3 * c1;
    const BC3 = b3 * c0 + b2 * c1;
    const BC2 = b2 * c0 + b1 * c1;
    const BC1 = b1 * c0 + b0 * c1;
    const BC0 = b0 * c0;
    // const H = [
    //     AD5 - BC5,
    //     AD4 - BC4,
    //     AD3 - BC3,
    //     AD2 - BC2,
    //     AD1 - BC1,
    //     AD0 - BC0
    // ];
    const H5 = AD5 - BC5;
    const H4 = AD4 - BC4;
    const H3 = AD3 - BC3;
    const H2 = AD2 - BC2;
    const H1 = AD1 - BC1;
    const H0 = AD0 - BC0;
    return {
        A: [a2, a1, a0],
        B: [b4, b3, b2, b1, b0],
        C: [c1, c0],
        D: [d3, d2, d1, d0],
        H: [H5, H4, H3, H2, H1, H0]
    };
}
export { getMedialPointCoeffsBez2 };
//# sourceMappingURL=get-medial-point-coeffs-bez2.js.map