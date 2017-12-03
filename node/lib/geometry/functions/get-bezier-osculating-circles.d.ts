import ListNode from '../../linked-list/list-node';
import PointOnShape from '../../geometry/classes/point-on-shape';
import PathCurve from '../classes/path-curve';
/**
 * Finds the osculating circles for the given bezier.
 */
declare function getBezierOsculatingCircles(bezierNode: ListNode<PathCurve>): PointOnShape[];
export default getBezierOsculatingCircles;
