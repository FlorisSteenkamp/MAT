import type { PointOnShape } from './point-on-shape.js';
import { tangent } from 'flo-bezier3';
import { translate } from 'flo-vector2d';


/**
 * Returns a line segment starting at the given point on the shape boundary and
 * being tangent to the boundary at that point.
 * 
 * * the returned line is of the form `[p, p + tangent]` where `p` is the
 * point on the shape (the tangent is not normalized)
 * * if the point falls on the boundary between two curves then the curve
 * the point starts (if `fromElseTo` is `true`) or ends (if `fromElseTo` is 
 * `false`) is used
 * 
 * @param pos the point on the shape
 * @param fromElseTo `true` if the tangent is to be taken as leaving the point,
 * `false` if it is to be taken as arriving at the point
 * 
 * @internal
 */
function getBoundaryTangentLine(
        pos: PointOnShape,
        fromElseTo: boolean): number[][] {

    let { curve, t } = pos;
    const { p } = pos;

    if (fromElseTo && t === 1) { t = 0; curve = curve.next; }
    if (!fromElseTo && t === 0) { t = 1; curve = curve.prev; }

    return [p, translate(p, tangent(curve.ps, t))];
}


export { getBoundaryTangentLine }
