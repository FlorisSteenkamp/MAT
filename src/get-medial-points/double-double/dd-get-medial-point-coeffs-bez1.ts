import { twoDiff, ddAddDd, ddMultDd, ddNegativeOf, ddMultByNeg2, ddDiffDouble, ddMultBy2 } from 'double-double';

const td = twoDiff;
const qaq = ddAddDd;
const qmq = ddMultDd;
const qno = ddNegativeOf;
const qmn2 = ddMultByNeg2;
const qm2 = ddMultBy2;
const qdd = ddDiffDouble;


/**
 * Returns the polynomial coefficients used to recover ray parameter values `t`
 * for a ray `q(t) = p + t⋅v` and an order-1 bezier curve `ps`.
 *
 * The returned polynomials encode the medial-condition equations in `s` and
 * `t`. For any valid solution, `t` is recovered by eliminating `s` and solving
 * the resulting ray equation, or equivalently by using the linear form
 * `A(s)⋅t + B(s) = 0`, which gives `t = -B(s)/A(s)`.
 *
 * More specifically, the returned values represent:
 * * `A` and `B`: the coefficients of `E2(s,t) = A(s)⋅t + B(s)`
 * * `C` and `D`: the coefficients of `E1(s,t) = C(s)⋅t + D(s)`
 * * `H`: the eliminated polynomial `A(s)⋅D(s) - B(s)⋅C(s)` whose roots are
 *   candidate `s` values for medial points
 *
 * @param p base point
 * @param v ray direction vector starting from `p`
 * @param ps order 1 bezier control points, i.e. a line segment
 * given as an array of control points, e.g. `[[0,0],[2,1]]`
 */
function ddGetMedialPointCoeffsBez1(
        p: number[][],
        v: number[][],
        ps: number[][]) {

    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------
    const [px, py] = p;
    const [vx, vy] = v;
    const [[x0, y0], [x1, y1]] = ps;

    // Linear bezier in power basis: b(s) = b*s + c
    // We can also use: `const [[bx,by], [cx,cy]] = toPowerBasis1(ps)`
    // const bx = x1 - x0;
    // const by = y1 - y0;
    const bx = td(x1,x0);
    const by = td(y1,y0);

    // u(s) = p - b(s) = u1*s + u0
    // const u0x = px - x0;
    // const u0y = py - y0;
    const u0x = qdd(px,x0);
    const u0y = qdd(py,y0);

    // b'(s) = w(s) = w0

    // -----------------------------------------------------
    // E1(s,t): (u(s) + t⋅v) ⋅ b'(s) = 0
    // => C(s)⋅t + D(s) = 0
    // const c0 = vx*bx + vy*by;
    const c0 = qaq(qmq(vx,bx),qmq(vy,by));
    // -----------------------------------------------------

    // -----------------------------------------------------
    // const d1 = -(bx*bx + by*by);
    // const d0 = bx*u0x + by*u0y;
    // const d1 = qmd(-1,qaq(qmq(bx,bx),qmq(by,by)));
    const d1 = qno(qaq(qmq(bx,bx), qmq(by,by)));
    const d0 = qaq(qmq(bx,u0x), qmq(by,u0y));
    // -----------------------------------------------------

    // -----------------------------------------------------
    // E2(s,t): |t⋅v|² - |u(s) + t⋅v|² = 0
    //         => 2⋅(v⋅u(s))⋅t + |u(s)|² = 0
    //         => A(s)⋅t + B(s) = 0
    // const a1 = -2*c0;
    // const a0 = 2*(vx*u0x + vy*u0y);
    const a1 = qmn2(c0);
    const a0 = qaq(qmq(qm2(vx),u0x), qmq(qm2(vy),u0y));
    // -----------------------------------------------------

    // -----------------------------------------------------
    // const b2 = -d1;
    // const b1 = -2*d0;
    // const b0 = u0x*u0x + u0y*u0y;
    const b2 = qno(d1);
    const b1 = qmn2(d0);
    const b0 = qaq(qmq(u0x,u0x), qmq(u0y,u0y));
    // -----------------------------------------------------


    // Eliminate t from:
    //   A(s)⋅t + B(s) = 0
    //   C(s)⋅t + D(s) = 0
    // by taking A(s)⋅D(s) - B(s)⋅C(s) = 0 (degree ≤ 2 in s)

    // const H2 = b2*c0;
    // const H1 = a0*d1;
    // const H0 = a0*d0 - b0*c0;
    const H2 = qmq(b2,c0);
    const H1 = qmq(a0,d1);
    const H0 = qaq(qmq(a0,d0), qno(qmq(b0,c0)));

    return {
        A: [a1, a0],
        B: [b2, b1, b0],
        C: [c0],
        D: [d1, d0],
        H: [H2, H1, H0]
    };
}


export { ddGetMedialPointCoeffsBez1 }
