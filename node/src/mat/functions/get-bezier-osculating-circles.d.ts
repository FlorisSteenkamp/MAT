import { Curve } from '../../linked-list/curve';
import { PointOnShape } from '../classes/point-on-shape';
/**
 * Finds the osculating circles for the given bezier.
 */
declare function getBezierOsculatingCircles(bezierNode: Curve): PointOnShape[];
export { getBezierOsculatingCircles };
