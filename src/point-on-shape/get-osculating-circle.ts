import type { PointOnShape } from './point-on-shape.js';
import { ddCurvature } from 'flo-bezier3';

const { sqrt } = Math;


/**
 * Returns the osculating circle at this point of the curve.
 * 
 * @param minCurvature if not `Infinity` then the circle radius will be limited
 * to this value
 * @param pos the `PointOnShape` identifying the point
 * @param useMaxRadius
 */
function getOsculatingCircle(
        maxOsculatingCircleRadius: number, 
        pos: PointOnShape,
        norm: number[]): [number[],number] {

    const { curve, p, t } = pos;
    const { ps } = curve;

    const minCurvature = 1/maxOsculatingCircleRadius;

    const k_ = -(ddCurvature(ps, t)[1]);
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
