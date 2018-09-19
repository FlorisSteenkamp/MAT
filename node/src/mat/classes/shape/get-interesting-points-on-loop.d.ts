import { Loop } from '../../../linked-list/loop';
import { PointOnShape } from '../../classes/point-on-shape';
/**
 * Get useful points on the shape - these incude osculating points and points at
 * the bezier-bezier interfaces.
 * @param loop
 */
declare function getInterestingPointsOnLoop(loop: Loop): PointOnShape[];
export { getInterestingPointsOnLoop };
