import type { PrePointOnShape } from './point-on-shape.js';
import { ddCurvatureND } from 'flo-bezier3';
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
function getOsculatingCircle(
        minRadius: number,
        maxRadius: number,
        pos: PrePointOnShape,
        norm: number[]): [number[],number] | undefined {

    const { curve, p, t } = pos;
    const { ps } = curve;

    const maxCurvature = 1/minRadius;
    const minCurvature = 1/maxRadius;

    const k = clamp(getCurvature(ps, t), minCurvature, maxCurvature);
    if (k === maxCurvature) { return undefined; }

    const [tx, ty] = norm;
    const l = sqrt(tx*tx + ty*ty);
    const scale = l*k;

    return [
        [p[0] + tx/scale, p[1] + ty/scale],
        1/k
    ];
}


/**
 * Returns the curvature of the given bezier curve at `t`
 * 
 * * intermediate calculations done in double-double precision
 * * returns `Infinite` instead of `NaN` for infinite curvature
 * 
 * @param ps 
 * @param t 
 */
function getCurvature(
        ps: number[][],
        t: number) {

    const [N,D] = ddCurvatureND(ps, t);
    if (N[1] === 0) {
        if (D[1] === 0) {
            return Infinity;
        }
        return 0;
    }

    const kDd = ddDivDd(N,D);  // not degenerate

    return -(kDd[0] + kDd[1]);
}


export { getOsculatingCircle, getCurvature }
