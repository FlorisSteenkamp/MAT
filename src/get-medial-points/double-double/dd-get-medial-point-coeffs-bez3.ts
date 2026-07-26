import { toPowerBasisDd } from 'flo-bezier3';
import { twoDiff, ddMultDouble2, ddAddDd, ddMultDd, ddNegativeOf, ddMultByNeg2, ddMultBy2, ddDiffDouble } from 'double-double';

const td = twoDiff;
const qmd = ddMultDouble2;
const qaq = ddAddDd;
const qmq = ddMultDd;
const qno = ddNegativeOf;
const qmn2 = ddMultByNeg2;
const qm2 = ddMultBy2;
const qdd = ddDiffDouble;


/**
 * Returns the polynomial coefficients for the ray parameter `t` and the
 * curve parameter `s` that encode the medial condition for `q(t) = p + t⋅v`
 * and a cubic bezier curve `ps`.
 *
 * The returned coefficients describe the equations whose common solutions
 * satisfy:
 * * `q(t)` is equidistant from `p` and the nearest point on `ps`
 * * that common distance is locally minimal among such candidates
 *
 * More specifically, this function returns:
 * * `A` and `B`: the coefficients of `E2(s,t) = A(s)⋅t + B(s)`
 * * `C` and `D`: the coefficients of `E1(s,t) = C(s)⋅t + D(s)`
 * * `H`: the eliminated polynomial `A(s)⋅D(s) - B(s)⋅C(s)` whose roots are
 *   candidate `s` values for medial points
 *
 * @param p base point
 * @param v ray direction from `p`
 * @param ps cubic bezier control points, i.e. an order 3 bezier curve
 * given as an array of control points, e.g. `[[0,0],[1,1],[2,1],[3,0]]`
 */
function ddGetMedialPointCoeffsBez3(
        p: number[][],
        v: number[][],
        ps: number[][]) {

    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------

    const [px, py] = p;
    const [vx, vy] = v;

    // Cubic bezier in power basis: b(s) = a*s^3 + b*s^2 + c*s + d
    const [[ax,bx,cx,[,dx]],[ay,by,cy,[,dy]]] = toPowerBasisDd(ps);

    // const u0x = px - dx;
    // const u0y = py - dy;
    const u0x = qdd(px,dx);
    const u0y = qdd(py,dy);

    // Reuse dot products across A, B, C, D, and H.
    // const va = vx*ax + vy*ay;
    // const vb = vx*bx + vy*by;
    // const vc = vx*cx + vy*cy;
    // const vu0 = vx*u0x + vy*u0y;
    const va = qaq(qmq(vx,ax),qmq(vy,ay));
    const vb = qaq(qmq(vx,bx),qmq(vy,by));
    const vc = qaq(qmq(vx,cx),qmq(vy,cy));
    const vu0 = qaq(qmq(vx,u0x),qmq(vy,u0y));

    // const b6 = ax*ax + ay*ay;
    // const ab = ax*bx + ay*by;
    // const ac = ax*cx + ay*cy;
    // const bb = bx*bx + by*by;
    // const bc = bx*cx + by*cy;
    // const cc = cx*cx + cy*cy;
    const b6 = qaq(qmq(ax,ax),qmq(ay,ay));
    const ab = qaq(qmq(ax,bx),qmq(ay,by));
    const ac = qaq(qmq(ax,cx),qmq(ay,cy));
    const bb = qaq(qmq(bx,bx),qmq(by,by));
    const bc = qaq(qmq(bx,cx),qmq(by,cy));
    const cc = qaq(qmq(cx,cx),qmq(cy,cy));

    // const au0 = ax*u0x + ay*u0y;
    // const bu0 = bx*u0x + by*u0y;
    // const d0 = cx*u0x + cy*u0y;
    // const b0 = u0x*u0x + u0y*u0y;
    const au0 = qaq(qmq(ax,u0x),qmq(ay,u0y));
    const bu0 = qaq(qmq(bx,u0x),qmq(by,u0y));
    const d0 = qaq(qmq(cx,u0x),qmq(cy,u0y));
    const b0 = qaq(qmq(u0x,u0x),qmq(u0y,u0y));

    // -----------------------------------------------------
    // E1(s,t): (u(s) + t*v) * b'(s) = 0
    // => C(s)*t + D(s) = 0
    // const c2 = 3*va;
    // const c1 = 2*vb;
    // const c0 = vc;
    const c2 = qmd(3,va);
    const c1 = qm2(vb);
    const c0 = vc;
    // -----------------------------------------------------

    // -----------------------------------------------------
    // const d5 = -3*b6;
    // const d4 = -5*ab;
    // const d3 = -4*ac - 2*bb;
    // const d2 = 3*au0 - 3*bc;
    // const d1 = 2*bu0 - cc;
    const d5 = qmd(-3,b6);
    const d4 = qmd(-5,ab);
    const d3 = qaq(qmd(-4,ac),qmn2(bb));
    const d2 = qaq(qmd(3,au0),qmd(-3,bc));
    const d1 = qaq(qm2(bu0),qno(cc));
    // -----------------------------------------------------

    // -----------------------------------------------------
    // E2(s,t): |t*v|^2 - |u(s) + t*v|^2 = 0
    //         => 2*(v*u(s))*t + |u(s)|^2 = 0
    //         => A(s)*t + B(s) = 0
    // const a3 = -2*va;
    // const a2 = -2*vb;
    // const a1 = -2*vc;
    // const a0 = 2*vu0;
    const a3 = qmn2(va);
    const a2 = qmn2(vb);
    const a1 = qmn2(vc);
    const a0 = qm2(vu0);
    // -----------------------------------------------------

    // -----------------------------------------------------
    // const b5 = 2*ab;
    // const b4 = 2*ac + bb;
    // const b3 = 2*bc - 2*au0;
    // const b2 = cc - 2*bu0;
    // const b1 = -2*d0;
    const b5 = qm2(ab);
    const b4 = qaq(qm2(ac),bb);
    const b3 = qaq(qm2(bc),qmn2(au0));
    const b2 = qaq(cc,qmn2(bu0));
    const b1 = qmn2(d0);
    // -----------------------------------------------------


    // Eliminate t from:
    //   A(s)*t + B(s) = 0
    //   C(s)*t + D(s) = 0
    // by taking H(s) = A(s)*D(s) - B(s)*C(s) = 0 (degree <= 8 in s).
    // Using:
    //   a2 = -c1, a1 = -2*c0,
    //   d5 = -3*b6, d4 = -(5/2)*b5, d3 = -2*b4, d2 = -(3/2)*b3,
    //   d1 = -b2, d0 = -(1/2)*b1,
    // we can compute H directly with fewer operations.
    // const H8 = 3*va*b6;
    // const H7 = 4*(va*ab + vb*b6);
    // const H6 = va*b4 + 6*vb*ab + 5*vc*b6;
    // const H5 = 2*vb*b4 + 8*vc*ab - 6*vu0*b6;
    // const H4 = -va*b2 + vb*b3 + 3*vc*b4 - 10*vu0*ab;
    // const H3 = -2*va*b1 + 2*vc*b3 - 4*vu0*b4;
    // const H2 = vc*b2 - vb*b1 - 3*vu0*b3 - 3*va*b0;
    // const H1 = -2*vu0*b2 - 2*vb*b0;
    // const H0 = -vu0*b1 - vc*b0;
    const H8 = qmd(3,qmq(va,b6));
    const H7 = qm2(qm2(qaq(qmq(va,ab),qmq(vb,b6))));
    const H6 = qaq(qaq(qmq(va,b4),qmd(6,qmq(vb,ab))),qmd(5,qmq(vc,b6)));
    const H5 = qaq(qaq(qm2(qmq(vb,b4)),qmd(8,qmq(vc,ab))),qno(qmd(6,qmq(vu0,b6))));
    const H4 = qaq(qaq(qno(qmq(va,b2)),qmq(vb,b3)),qaq(qmd(3,qmq(vc,b4)),qno(qmd(10,qmq(vu0,ab)))));
    const H3 = qaq(qaq(qmn2(qmq(va,b1)),qm2(qmq(vc,b3))),qno(qm2(qm2(qmq(vu0,b4)))));
    const H2 = qaq(qaq(qaq(qmq(vc,b2),qno(qmq(vb,b1))),qno(qmd(3,qmq(vu0,b3)))),qno(qmd(3,qmq(va,b0))));
    const H1 = qaq(qmn2(qmq(vu0,b2)),qmn2(qmq(vb,b0)));
    const H0 = qaq(qno(qmq(vu0,b1)),qno(qmq(vc,b0)));

    return {
        A: [a3, a2, a1, a0],
        B: [b6, b5, b4, b3, b2, b1, b0],
        C: [c2, c1, c0],
        D: [d5, d4, d3, d2, d1, d0],
        H: [H8, H7, H6, H5, H4, H3, H2, H1, H0]
    };
}


export { ddGetMedialPointCoeffsBez3 }
