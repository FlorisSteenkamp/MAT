import { evalDeCasteljau, tangent } from 'flo-bezier3';
import { toUnitVector } from 'flo-vector2d';
import { calcOsculatingCircleRadius } from './calc-osculating-circle-radius.js';
import { isPosSharpCorner } from './is-pos-sharp-corner.js';
/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
function getOsculatingCircle(maxOsculatingCircleRadius, pos) {
    if (isPosSharpCorner(pos)) {
        return { center: pos.p, radius: 0 };
    }
    let radius = calcOsculatingCircleRadius(pos);
    if (radius < 0) {
        radius = Number.POSITIVE_INFINITY;
    }
    radius = Math.min(radius, maxOsculatingCircleRadius);
    const ps = pos.curve.ps;
    const t = pos.t;
    const tangent_ = tangent(ps, t);
    const normal_ = toUnitVector([-tangent_[1], tangent_[0]]);
    const p = evalDeCasteljau(ps, t); // TODO2
    const circleCenter = [
        p[0] - normal_[0] * radius,
        p[1] - normal_[1] * radius
    ];
    return { center: circleCenter, radius };
}
export { getOsculatingCircle };
//# sourceMappingURL=get-osculating-circle.js.map