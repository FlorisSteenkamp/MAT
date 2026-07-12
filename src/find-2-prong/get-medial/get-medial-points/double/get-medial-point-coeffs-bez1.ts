// TODO - move to flo-bezier
/**
 * Returns polynomial coefficients for ray parameter values `t`, bezier
 * parameter values `s` and medial points for points `q(t)` and b(s) (an order
 * 1 bezier curve) that satisfy the medial condition with respect to `p` and `ps`:
 * 
 * Let `p` be a fixed point in the plane.
 * Let `v` be a direction vector defining the ray `q(t) = p + t⋅v`.
 * Let `ps` be an order 1 bezier curve (a line segment).
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
 * @param ps order 1 bezier control points, i.e. a line segment
 * given as an array of control points, e.g. `[[0,0],[2,1]]`
 */
function getMedialPointCoeffsBez1(
        p: number[],
        v: number[],
        ps: number[][]) {

    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------
    const [px, py] = p;
    const [vx, vy] = v;
    const [[x0, y0], [x1, y1]] = ps;

    // Linear bezier in power basis: b(s) = b*s + c
    const bx = -x0 + x1;
    const by = -y0 + y1;
    const cx = x0;
    const cy = y0;

    // u(s) = p - b(s) = u1*s + u0
    const u1x = -bx;
    const u1y = -by;
    const u0x = px - cx;
    const u0y = py - cy;

    // b'(s) = w(s) = w0
    const w0x = bx;
    const w0y = by;

    // -----------------------------------------------------
    // E1(s,t): (u(s) + t⋅v) ⋅ b'(s) = 0
    // => C(s)⋅t + D(s) = 0
    const c0 = vx*w0x + vy*w0y;
    // -----------------------------------------------------

    // -----------------------------------------------------
    const d1 = u1x*w0x + u1y*w0y;
    const d0 = u0x*w0x + u0y*w0y;
    // -----------------------------------------------------

    // -----------------------------------------------------
    // E2(s,t): |t⋅v|² - |u(s) + t⋅v|² = 0
    //         => 2⋅(v⋅u(s))⋅t + |u(s)|² = 0
    //         => A(s)⋅t + B(s) = 0
    const a1 = 2*(vx*u1x + vy*u1y);
    const a0 = 2*(vx*u0x + vy*u0y);
    // -----------------------------------------------------

    // -----------------------------------------------------
    const b2 = u1x*u1x + u1y*u1y;
    const b1 = 2*(u1x*u0x + u1y*u0y);
    const b0 = u0x*u0x + u0y*u0y;
    // -----------------------------------------------------


    // const A = [a1, a0];      // degree 1 in s
    // const B = [b2, b1, b0];  // degree 2 in s
    // const C = [c0];          // degree 0 in s
    // const D = [d1, d0];      // degree 1 in s

    // Eliminate t from:
    //   A(s)⋅t + B(s) = 0
    //   C(s)⋅t + D(s) = 0
    // by taking A(s)⋅D(s) - B(s)⋅C(s) = 0 (degree ≤ 2 in s)

    const AD2 = a1*d1;
    const AD1 = a1*d0 + a0*d1;
    const AD0 = a0*d0;

    const BC2 = b2*c0;
    const BC1 = b1*c0;
    const BC0 = b0*c0;

    const H2 = AD2 - BC2;
    const H1 = AD1 - BC1;
    const H0 = AD0 - BC0;

    return {
        A: [a1, a0],
        B: [b2, b1, b0],
        C: [c0],
        D: [d1, d0],
        H: [H2, H1, H0]
    };
}


export { getMedialPointCoeffsBez1 }
