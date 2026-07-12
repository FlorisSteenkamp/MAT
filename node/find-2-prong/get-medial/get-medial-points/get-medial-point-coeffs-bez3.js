/**
 * Returns polynomial coefficients for ray parameter values `t`, bezier
 * parameter values `s` and medial points for points `q(t)` and b(s) (an order
 * 3 bezier curve) that satisfy the medial condition with respect to `p` and `ps`:
 *
 * Let `p` be a fixed point in the plane.
 * Let `v` be a direction vector defining the ray `q(t) = p + t⋅v`.
 * Let `ps` be a cubic bezier curve.
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
 * @param ps cubic bezier control points, i.e. an order 3 bezier curve
 * given as an array of control points, e.g. `[[0,0],[1,1],[2,1],[3,0]]`
 */
function getMedialPointCoeffsBez3(p, v, ps) {
    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------
    const [px, py] = p;
    const [vx, vy] = v;
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    // Cubic bezier in power basis: b(s) = a*s^3 + b*s^2 + c*s + d
    const ax = -x0 + 3 * x1 - 3 * x2 + x3;
    const ay = -y0 + 3 * y1 - 3 * y2 + y3;
    const bx = 3 * x0 - 6 * x1 + 3 * x2;
    const by = 3 * y0 - 6 * y1 + 3 * y2;
    const cx = -3 * x0 + 3 * x1;
    const cy = -3 * y0 + 3 * y1;
    const dx = x0;
    const dy = y0;
    // u(s) = p - b(s) = u3*s^3 + u2*s^2 + u1*s + u0
    const u3x = -ax;
    const u3y = -ay;
    const u2x = -bx;
    const u2y = -by;
    const u1x = -cx;
    const u1y = -cy;
    const u0x = px - dx;
    const u0y = py - dy;
    // b'(s) = w(s) = w2*s^2 + w1*s + w0
    const w2x = 3 * ax;
    const w2y = 3 * ay;
    const w1x = 2 * bx;
    const w1y = 2 * by;
    const w0x = cx;
    const w0y = cy;
    // -----------------------------------------------------
    // E1(s,t): (u(s) + t*v) * b'(s) = 0
    // => C(s)*t + D(s) = 0
    const c2 = vx * w2x + vy * w2y;
    const c1 = vx * w1x + vy * w1y;
    const c0 = vx * w0x + vy * w0y;
    // -----------------------------------------------------
    // -----------------------------------------------------
    const d5 = u3x * w2x + u3y * w2y;
    const d4 = u3x * w1x + u3y * w1y + u2x * w2x + u2y * w2y;
    const d3 = u3x * w0x + u3y * w0y + u2x * w1x + u2y * w1y + u1x * w2x + u1y * w2y;
    const d2 = u2x * w0x + u2y * w0y + u1x * w1x + u1y * w1y + u0x * w2x + u0y * w2y;
    const d1 = u1x * w0x + u1y * w0y + u0x * w1x + u0y * w1y;
    const d0 = u0x * w0x + u0y * w0y;
    // -----------------------------------------------------
    // -----------------------------------------------------
    // E2(s,t): |t*v|^2 - |u(s) + t*v|^2 = 0
    //         => 2*(v*u(s))*t + |u(s)|^2 = 0
    //         => A(s)*t + B(s) = 0
    const a3 = 2 * (vx * u3x + vy * u3y);
    const a2 = 2 * (vx * u2x + vy * u2y);
    const a1 = 2 * (vx * u1x + vy * u1y);
    const a0 = 2 * (vx * u0x + vy * u0y);
    // -----------------------------------------------------
    // -----------------------------------------------------
    const b6 = u3x * u3x + u3y * u3y;
    const b5 = 2 * (u3x * u2x + u3y * u2y);
    const b4 = 2 * (u3x * u1x + u3y * u1y) + (u2x * u2x + u2y * u2y);
    const b3 = 2 * (u3x * u0x + u3y * u0y) + 2 * (u2x * u1x + u2y * u1y);
    const b2 = 2 * (u2x * u0x + u2y * u0y) + (u1x * u1x + u1y * u1y);
    const b1 = 2 * (u1x * u0x + u1y * u0y);
    const b0 = u0x * u0x + u0y * u0y;
    // -----------------------------------------------------
    // const A = [a3, a2, a1, a0];                  // degree 3 in s
    // const B = [b6, b5, b4, b3, b2, b1, b0];      // degree 6 in s
    // const C = [c2, c1, c0];                      // degree 2 in s
    // const D = [d5, d4, d3, d2, d1, d0];          // degree 5 in s
    // Eliminate t from:
    //   A(s)*t + B(s) = 0
    //   C(s)*t + D(s) = 0
    // by taking A(s)*D(s) - B(s)*C(s) = 0 (degree <= 8 in s)
    const AD8 = a3 * d5;
    const AD7 = a3 * d4 + a2 * d5;
    const AD6 = a3 * d3 + a2 * d4 + a1 * d5;
    const AD5 = a3 * d2 + a2 * d3 + a1 * d4 + a0 * d5;
    const AD4 = a3 * d1 + a2 * d2 + a1 * d3 + a0 * d4;
    const AD3 = a3 * d0 + a2 * d1 + a1 * d2 + a0 * d3;
    const AD2 = a2 * d0 + a1 * d1 + a0 * d2;
    const AD1 = a1 * d0 + a0 * d1;
    const AD0 = a0 * d0;
    const BC8 = b6 * c2;
    const BC7 = b6 * c1 + b5 * c2;
    const BC6 = b6 * c0 + b5 * c1 + b4 * c2;
    const BC5 = b5 * c0 + b4 * c1 + b3 * c2;
    const BC4 = b4 * c0 + b3 * c1 + b2 * c2;
    const BC3 = b3 * c0 + b2 * c1 + b1 * c2;
    const BC2 = b2 * c0 + b1 * c1 + b0 * c2;
    const BC1 = b1 * c0 + b0 * c1;
    const BC0 = b0 * c0;
    const H8 = AD8 - BC8;
    const H7 = AD7 - BC7;
    const H6 = AD6 - BC6;
    const H5 = AD5 - BC5;
    const H4 = AD4 - BC4;
    const H3 = AD3 - BC3;
    const H2 = AD2 - BC2;
    const H1 = AD1 - BC1;
    const H0 = AD0 - BC0;
    return {
        A: [a3, a2, a1, a0],
        B: [b6, b5, b4, b3, b2, b1, b0],
        C: [c2, c1, c0],
        D: [d5, d4, d3, d2, d1, d0],
        H: [H8, H7, H6, H5, H4, H3, H2, H1, H0]
    };
}
export { getMedialPointCoeffsBez3 };
//# sourceMappingURL=get-medial-point-coeffs-bez3.js.map