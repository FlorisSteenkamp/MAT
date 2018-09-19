import { ListNode } from '../../linked-list/list-node';
import { Vertex } from '../classes/vertex/vertex';
import { ContactPoint } from '../classes/contact-point';
import { Circle } from '../classes/circle';
import { PointOnShape } from '../classes/point-on-shape';
import { LinkedLoop } from '../../linked-list/linked-loop';
/**
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated)
 * points on the shape.
 *
 * @param shape
 * @param circle
 * @param ps
 * @param deltas
 */
declare function add3Prong(cpGraphs: LinkedLoop<ContactPoint>[], orders: number[], threeProng: {
    circle: Circle;
    ps: PointOnShape[];
    δ3s: ListNode<ContactPoint>[][];
}): Vertex;
export { add3Prong };
