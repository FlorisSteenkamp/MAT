import { Node } from '../../linked-list/node';
import { PointOnShape } from '../classes/point-on-shape';
import { Corner } from '../classes/corner';
/**
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points.
 *
 * @param bezierNodes - The two bezier nodes.
 **/
declare function getContactCirclesAtBezierBezierInterface(bezierNodes: Node<number[][]>[], dullCornerHash: {
    [index: string]: Corner;
}): PointOnShape[];
export { getContactCirclesAtBezierBezierInterface };
