import { getMedialPointCoeffsBez2 } from './get-medial-point-coeffs-bez2';
import { getMedialPointCoeffsBez1 } from './get-medial-point-coeffs-bez1';
import { getMedialPointCoeffsBez3 } from './get-medial-point-coeffs-bez3';
import { getMedialPointCoeffsBez0 } from './get-medial-point-coeffs-bez0';


const getMedialPointCoeffss = [
    ,
    getMedialPointCoeffsBez0,
    getMedialPointCoeffsBez1,
    getMedialPointCoeffsBez2,
    getMedialPointCoeffsBez3
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
function getMedialPointCoeffs(
        p: number[],
        v: number[],
        ps: number[][]) {

    return getMedialPointCoeffss[ps.length]!(p,v,ps);
}


export { getMedialPointCoeffs }
