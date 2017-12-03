import PointOnShape from '../../geometry/classes/point-on-shape';
import ListNode from '../../linked-list/list-node';
import PathCurve from '../classes/path-curve';
import Corner from '../classes/corner';
/**
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points.
 *
 * @param bezierNodes - The two bezier nodes.
 **/
declare function getContactCirclesAtBezierBezierInterface(bezierNodes: ListNode<PathCurve>[], dullCornerHash: {
    [index: string]: Corner;
}): PointOnShape[];
export default getContactCirclesAtBezierBezierInterface;
