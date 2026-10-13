import type { PrePointOnShape } from './point-on-shape.js';
import { ddCurvature } from 'flo-bezier3';

const { sqrt } = Math;


/**
 * Returns the osculating circle at this point of the curve as
 * `[center, radius]`.
 *
 * @param maxOsculatingCircleRadius the circle radius will be limited to this
 * value (i.e. the curvature is taken to be at least its reciprocal)
 * @param pos the `PointOnShape` identifying the point
 * @param norm the (not necessarily unit) normal at the point pointing towards
 * the center of the circle
 */
function getOsculatingCircle(
        maxOsculatingCircleRadius: number, 
        pos: PrePointOnShape,
        norm: number[]): [number[],number] {

    const { curve, p, t } = pos;
    const { ps } = curve;

    const minCurvature = 1/maxOsculatingCircleRadius;

    const kDd = ddCurvature(ps, t);
    const k_ = -(kDd[0] + kDd[1]);
    const k = k_ < minCurvature ? minCurvature : k_;

    const [tx, ty] = norm;
    const l = sqrt(tx*tx + ty*ty);
    const scale = l*k;

    return [
        [p[0] + tx/scale, p[1] + ty/scale],
        1/k
    ];
}


export { getOsculatingCircle }
