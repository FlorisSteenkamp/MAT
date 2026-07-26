import { ddGetMedialPointCoeffsBez2 } from './dd-get-medial-point-coeffs-bez2.js';
import { ddGetMedialPointCoeffsBez1 } from './dd-get-medial-point-coeffs-bez1.js';
import { ddGetMedialPointCoeffsBez3 } from './dd-get-medial-point-coeffs-bez3.js';
import { ddGetMedialPointCoeffsBez0 } from './dd-get-medial-point-coeffs-bez0.js';


const getMedialPointCoeffss = [
    ,,
    ddGetMedialPointCoeffsBez1,
    ddGetMedialPointCoeffsBez2,
    ddGetMedialPointCoeffsBez3
];


/**
 * Returns polynomial coefficients for ray parameter values `t`, bezier
 * parameter values `s` and medial points for points `q(t)` and b(s) (an order
 * 0, 1, 2 or 3 bezier curve) that satisfy the medial condition with respect to `p` and `ps`:
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
 * @param ps bezier control points, e.g. `[[0,0],[1,1],[2,1],[3,0]]`
 */
function ddGetMedialPointCoeffs(
        p: number[][],
        v: number[][],
        ps: number[][]) {

    if (ps.length === 1) {
        const { a0, b0 } = ddGetMedialPointCoeffsBez0(p,v,ps[0]);
        return { A: [a0], B: [b0], C: [], D: [], H: [] };
    }
    return getMedialPointCoeffss[ps.length]!(p,v,ps);
}


export { ddGetMedialPointCoeffs }
