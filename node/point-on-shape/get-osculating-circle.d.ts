import { Circle } from '../circle.js';
import { PointOnShape } from './point-on-shape.js';
/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
declare function getOsculatingCircle(maxOsculatingCircleRadius: number, pos: PointOnShape): Circle;
export { getOsculatingCircle };
