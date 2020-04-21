import { Loop } from '../../loop';
import { IPointOnShape } from '../../point-on-shape';
/**
 * @hidden
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
declare function getInterestingPointsOnLoop(minBezLength: number, maxFlatness: number, maxLength: number): (loop: Loop) => IPointOnShape[];
export { getInterestingPointsOnLoop };
