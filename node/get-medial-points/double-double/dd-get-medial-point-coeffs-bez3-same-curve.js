import { toPowerBasisDd } from 'flo-bezier3';
import { ddMultDouble2, ddAddDd, ddMultDd, ddNegativeOf, ddMultByNeg2, ddMultBy2 } from 'double-double';
const qmd = ddMultDouble2;
const qaq = ddAddDd;
const qmq = ddMultDd;
const qno = ddNegativeOf;
const qmn2 = ddMultByNeg2;
const qm2 = ddMultBy2;
/**
 * Returns polynomial coefficients for the same-curve cubic medial-point case,
 * where `p = b(t)` on the same cubic bezier `ps` and `v` is normal to the
 * curve at that parameter `t`.
 *
 * The returned coefficients encode:
 * * `A`, `B`: `E2(s, τ) = (s - t)^2⋅(A(s)⋅τ + B(s))`
 * * `C`, `D`: `E1(s, τ) = (s - t)⋅(C(s)⋅τ + D(s))`
 * * `H`: the reduced eliminant in `s`
 *
 * Here `τ` is the ray parameter in `q(τ) = p + τ⋅v`.
 * For a candidate root `s` of `H`, recover `τ` from `A(s)⋅τ + B(s) = 0`, i.e.
 * `τ = -B(s)/A(s)` when `A(s) ≠ 0`.
 *
 * In this same-curve setup, the full eliminant has the form
 * `H_full(s) = (s - t)^4*H(s)`. This function returns only the reduced factor
 * `H(s)` (the repeated `(s - t)^4` factor is omitted).
 *
 * @param t parameter on `ps` where `p = b(t)`
 * @param v ray direction from `p`; assumed normal to `ps` at `t`
 * @param ps order 3 bezier control points, e.g. `[[0,0],[1,1],[2,1],[3,0]]`
 */
function ddGetMedialPointCoeffsBez3_SameCurve(t, v, ps) {
    // -----------------------------------------------------
    // See get-medial-points.md for implementation details.
    // -----------------------------------------------------
    const [vx, vy] = v;
    // Cubic bezier in power basis: b(s) = a*s^3 + b*s^2 + c*s + d
    const [[ax, bx, cx], [ay, by, cy]] = toPowerBasisDd(ps);
    // Shared dot products to reduce repeated multiplications.
    // const va = vx*ax + vy*ay;
    // const vb = vx*bx + vy*by;
    // const vc = vx*cx + vy*cy;
    // const aa = ax*ax + ay*ay;
    // const ab = ax*bx + ay*by;
    // const ac = ax*cx + ay*cy;
    // const bb = bx*bx + by*by;
    // const bc = bx*cx + by*cy;
    // const cc = cx*cx + cy*cy;
    // const vu0 = t*(t*(t*va + vb) + vc);
    // const u0a = t*(t*(t*aa + ab) + ac);
    // const u0b = t*(t*(t*ab + bb) + bc);
    const va = qaq(qmq(vx, ax), qmq(vy, ay));
    const vb = qaq(qmq(vx, bx), qmq(vy, by));
    const vc = qaq(qmq(vx, cx), qmq(vy, cy));
    const aa = qaq(qmq(ax, ax), qmq(ay, ay));
    const ab = qaq(qmq(ax, bx), qmq(ay, by));
    const ac = qaq(qmq(ax, cx), qmq(ay, cy));
    const bb = qaq(qmq(bx, bx), qmq(by, by));
    const bc = qaq(qmq(bx, cx), qmq(by, cy));
    const cc = qaq(qmq(cx, cx), qmq(cy, cy));
    const vu0 = qmd(t, qaq(qmd(t, qaq(qmd(t, va), vb)), vc));
    const u0a = qmd(t, qaq(qmd(t, qaq(qmd(t, aa), ab)), ac));
    const u0b = qmd(t, qaq(qmd(t, qaq(qmd(t, ab), bb)), bc));
    // -----------------------------------------------------
    // E1(s,t): (u(s) + t*v) * b'(s) = 0
    // => C(s)*t + D(s) = 0
    // const c2 = 3*va;
    // const c1 = 2*vb;
    const c2 = qmd(3, va);
    const c1 = qm2(vb);
    // v is normal at parameter t, so C(t) = 0.
    // const c0 = -t*(c2*t + c1);
    // Return reduced C such that C_full(s) = (s - t)*C(s).
    // const cr0 = c1 + t*c2;
    const cr0 = qaq(c1, qmd(t, c2));
    // -----------------------------------------------------
    // -----------------------------------------------------
    // const d5 = -3*aa;
    // const d4 = -5*ab;
    // const d3 = -4*ac - 2*bb;
    // const d2 = -3*bc + 3*u0a;
    // const d1 = -cc + 2*u0b;
    const d5 = qmd(-3, aa);
    const d4 = qmd(-5, ab);
    const d3 = qaq(qmd(-4, ac), qmn2(bb));
    const d2 = qaq(qmd(-3, bc), qmd(3, u0a));
    const d1 = qaq(qno(cc), qm2(u0b));
    // p = b(t) => D(t) = u(t)⋅w(t) = 0.
    // Return reduced D such that D_full(s) = (s - t)*D(s).
    const dr4 = d5;
    // const dr3 = d4 + t*dr4;
    // const dr2 = d3 + t*dr3;
    // const dr1 = d2 + t*dr2;
    // const dr0 = d1 + t*dr1;
    const dr3 = qaq(d4, qmd(t, dr4));
    const dr2 = qaq(d3, qmd(t, dr3));
    const dr1 = qaq(d2, qmd(t, dr2));
    const dr0 = qaq(d1, qmd(t, dr1));
    // -----------------------------------------------------
    // -----------------------------------------------------
    // E2(s,t): |t*v|^2 - |u(s) + t*v|^2 = 0
    //         => 2*(v*u(s))*t + |u(s)|^2 = 0
    //         => A(s)*t + B(s) = 0
    // A'(s) = -2*C(s) identically for bezier curves, hence:
    // const a3 = -2*va;
    // const a2 = -2*vb;
    const a3 = qmn2(va);
    const a2 = qmn2(vb);
    // const a1 = -2*vc;
    // p = b(t) => A(t) = 0.
    // const a0 = 2*vu0;
    // -----------------------------------------------------
    // -----------------------------------------------------
    const b6 = aa;
    // const b5 = 2*ab;
    // const b4 = 2*ac + bb;
    // const b3 = 2*bc - 2*u0a;
    // const b2 = cc - 2*u0b;
    const b5 = qm2(ab);
    const b4 = qaq(qm2(ac), bb);
    const b3 = qaq(qm2(bc), qmn2(u0a));
    const b2 = qaq(cc, qmn2(u0b));
    // -----------------------------------------------------
    // -----------------------------------------------------
    // Return reduced A and B such that:
    //   A_full(s) = (s - t)^2*A(s)
    //   B_full(s) = (s - t)^2*B(s)
    // where A is degree 1 and B is degree 4.
    const ar1 = a3;
    // const ar0 = a2 + 2*t*ar1;
    const ar0 = qaq(a2, qm2(qmd(t, ar1)));
    const br4 = b6;
    // const br3 = b5 + 2*t*br4;
    // const br2 = b4 + t*(2*br3 - t*br4);
    // const br1 = b3 + t*(2*br2 - t*br3);
    // const br0 = b2 + t*(2*br1 - t*br2);
    const br3 = qaq(b5, qm2(qmd(t, br4)));
    const br2 = qaq(b4, qmd(t, qaq(qm2(br3), qno(qmd(t, br4)))));
    const br1 = qaq(b3, qmd(t, qaq(qm2(br2), qno(qmd(t, br3)))));
    const br0 = qaq(b2, qmd(t, qaq(qm2(br1), qno(qmd(t, br2)))));
    // -----------------------------------------------------
    // Eliminate t from:
    //   A(s)*t + B(s) = 0
    //   C(s)*t + D(s) = 0
    // by taking A(s)*D(s) - B(s)*C(s) = 0 (degree <= 8 in s)
    // H8 = a3*d5 - b6*c2 = (-2*va)*(-3*aa) - aa*(3*va) = 3*va*aa.
    // const H8 = 3*va*aa;
    // const H7 = 4*(va*ab + vb*aa);
    // const H6 = va*b4 + 6*vb*ab + 5*vc*aa;
    // const H5 = 2*vb*b4 + 8*vc*ab - 6*vu0*aa;
    // const H4 = -va*b2 + vb*b3 + 3*vc*b4 - 10*vu0*ab;
    const H8 = qmd(3, qmq(va, aa));
    const H7 = qm2(qm2(qaq(qmq(va, ab), qmq(vb, aa))));
    const H6 = qaq(qaq(qmq(va, b4), qmd(6, qmq(vb, ab))), qmd(5, qmq(vc, aa)));
    const H5 = qaq(qaq(qm2(qmq(vb, b4)), qmd(8, qmq(vc, ab))), qno(qmd(6, qmq(vu0, aa))));
    const H4 = qaq(qaq(qno(qmq(va, b2)), qmq(vb, b3)), qaq(qmd(3, qmq(vc, b4)), qno(qmd(10, qmq(vu0, ab)))));
    // Reduce H_full(s) by its guaranteed (s - t)^4 factor:
    // H_full(s) = (s - t)^4*(q4*s^4 + q3*s^3 + q2*s^2 + q1*s + q0)
    // Match the high-order coefficients of H_full(s) explicitly.
    const q4 = H8;
    // const q3 = H7 + 4*t*q4;
    // const q2 = H6 + t*(4*q3 - 6*t*q4);
    // const q1 = H5 + t*(4*q2 + t*(-6*q3 + 4*t*q4));
    // const q0 = H4 + t*(4*q1 + t*(-6*q2 + t*(4*q3 - t*q4)));
    const q3 = qaq(H7, qm2(qm2(qmd(t, q4))));
    const q2 = qaq(H6, qmd(t, qaq(qm2(qm2(q3)), qno(qmd(6, qmd(t, q4))))));
    const q1 = qaq(H5, qmd(t, qaq(qm2(qm2(q2)), qmd(t, qaq(qmd(-6, q3), qm2(qm2(qmd(t, q4))))))));
    const q0 = qaq(H4, qmd(t, qaq(qm2(qm2(q1)), qmd(t, qaq(qmd(-6, q2), qmd(t, qaq(qm2(qm2(q3)), qno(qmd(t, q4)))))))));
    return {
        A: [ar1, ar0],
        B: [br4, br3, br2, br1, br0],
        C: [c2, cr0],
        D: [dr4, dr3, dr2, dr1, dr0],
        H: [q4, q3, q2, q1, q0]
    };
}
export { ddGetMedialPointCoeffsBez3_SameCurve };
//# sourceMappingURL=dd-get-medial-point-coeffs-bez3-same-curve.js.map