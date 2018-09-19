import { Curve } from '../curve';
import { PointOnShape } from '../point-on-shape';
/**
 * Finds the osculating circles for the given bezier.
 * @param curve
 */
declare function getBezierOsculatingCircles(curve: Curve): PointOnShape[];
export { getBezierOsculatingCircles };
