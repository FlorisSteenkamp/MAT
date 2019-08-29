import { Loop } from '../../loop/loop';
import { PointOnShape } from '../../point-on-shape';
/**
 * @hidden
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
declare function createGetInterestingPointsOnLoop(additionalPointCount?: number): (loop: Loop) => PointOnShape[];
export { createGetInterestingPointsOnLoop };
