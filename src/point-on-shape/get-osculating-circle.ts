import { tangentExact, ddCurvature } from 'flo-bezier3';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from './point-on-shape.js';



/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
function getOsculatingCircle(
        minCurvature: number, 
        pos: PointOnShape,
        useMaxRadius = false): Circle {

    const ps = pos.curve.ps;
    const { p, t } = pos;

    let k = -ddCurvature(ps, t);

    if (k < minCurvature || useMaxRadius) {
        k = minCurvature;
    }

    const tangent_ = tangentExact(ps,t).map(c => c[c.length-1]);
    const normal_ = [-tangent_[1],tangent_[0]];
    const l = Math.sqrt(normal_[0]**2 + normal_[1]**2);
    const circleCenter = [
        p[0] - normal_[0]/(k*l),
        p[1] - normal_[1]/(k*l)
    ];

    return { center: circleCenter, radius: 1/k };
}


export { getOsculatingCircle }
