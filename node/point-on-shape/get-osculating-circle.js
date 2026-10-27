import { ddCurvatureND, tangent2 } from 'flo-bezier3';
import { ddDivDd } from 'double-double';
import { clamp } from 'flo-boolean';
const { sqrt } = Math;
/**
 * Returns the osculating circle at this point of the curve as
 * `[center, radius]`.
 *
 * @param maxRadius the circle radius will be limited to this
 * value (i.e. the curvature is taken to be at least its reciprocal)
 * @param pos the `PointOnShape` identifying the point
 * @param norm the (not necessarily unit) normal at the point pointing towards
 * the center of the circle
 */
function getOsculatingCircle(minRadius, maxRadius, pos, norm) {
    const { curve, p, t } = pos;
    const { ps } = curve;
    const maxCurvature = 1 / minRadius;
    const minCurvature = 1 / maxRadius;
    const k = clamp(getCurvature(ps, t), minCurvature, maxCurvature);
    if (k === maxCurvature) {
        return undefined;
    }
    const [tx, ty] = norm;
    const l = sqrt(tx * tx + ty * ty);
    const scale = l * k;
    return [
        [p[0] + tx / scale, p[1] + ty / scale],
        1 / k
    ];
}
/**
 * Returns the curvature of the given bezier curve at `t`
 *
 * * intermediate calculations done in double-double precision
 * * returns `±Infinity` instead of `NaN` for infinite curvature, i.e. at an
 * end where the first derivative vanishes (signed by the side the curve
 * bends to) or at an interior cusp (always `+Infinity`)
 *
 * @param ps
 * @param t
 */
function getCurvature(ps, t) {
    const [N, D] = ddCurvatureND(ps, t);
    if (N[1] === 0) {
        if (D[1] !== 0) {
            return 0;
        }
        // 0/0 - the first derivative vanishes
        if (t !== 0 && t !== 1) {
            return Infinity;
        } // interior cusp
        // Near the end the curve leaves the (limit) tangent line towards the
        // opposite end point
        const len = ps.length;
        const pE = t === 0 ? ps[0] : ps[len - 1]; // the end point
        const pF = t === 0 ? ps[len - 1] : ps[0]; // the opposite end point
        const [tx, ty] = tangent2(ps, t);
        const c = tx * (pF[1] - pE[1]) - ty * (pF[0] - pE[0]);
        // the sign is flipped to match the convention below; `c === 0` means
        // a straight line
        return c === 0 ? 0 : (c < 0 ? Infinity : -Infinity);
    }
    const kDd = ddDivDd(N, D); // not degenerate
    return -(kDd[0] + kDd[1]);
}
export { getOsculatingCircle, getCurvature };
//# sourceMappingURL=get-osculating-circle.js.map