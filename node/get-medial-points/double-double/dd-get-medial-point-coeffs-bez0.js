import { ddAddDd, ddMultDd, ddMultBy2, ddDiffDouble } from 'double-double';
const qaq = ddAddDd;
const qmq = ddMultDd;
const qm2 = ddMultBy2;
const qdd = ddDiffDouble;
// TODO - move all these upstream to flo-bezier3
/**
 * Returns the coefficients `a0` and `b0` for the linear equation
 * `a0⋅t + b0 = 0`, so the ray parameter can be recovered as `t = -b0/a0`.
 * That parameter value makes `q(t) = p + t⋅v` equidistant from `p` and `P`.
 *
 * Let `p` be a fixed point in the plane.\
 * Let `v` be a direction vector defining the ray `q(t) = p + t⋅v`.\
 * Let `P` be another point.\
 *
 * In other words, this function returns the coefficients needed to solve for
 * the ray parameter of the medial point on the ray.
 *
 * @param p base point
 * @param v ray direction from `p`
 * @param P another "target" point, e.g. `[1,2]`
 */
function ddGetMedialPointCoeffsBez0(p, v, P) {
    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------
    const [px, py] = p;
    const [vx, vy] = v;
    const [x0, y0] = P;
    // Constant bezier in power basis: b(s) = c
    // u(s) = p - b(s) = u0
    // const u0x = px - x0;
    // const u0y = py - y0;
    const u0x = qdd(px, x0);
    const u0y = qdd(py, y0);
    // E2(s,t): |t⋅v|² - |u(s) + t⋅v|² = 0
    //         => 2⋅(v⋅u(s))⋅t + |u(s)|² = 0
    //         => A(s)⋅t + B(s) = 0
    // const a0 = 2*(vx*u0x + vy*u0y);
    // const b0 = u0x*u0x + u0y*u0y;
    const a0 = qaq(qmq(qm2(vx), u0x), qmq(qm2(vy), u0y));
    const b0 = qaq(qmq(u0x, u0x), qmq(u0y, u0y));
    return { a0, b0 };
}
export { ddGetMedialPointCoeffsBez0 };
//# sourceMappingURL=dd-get-medial-point-coeffs-bez0.js.map