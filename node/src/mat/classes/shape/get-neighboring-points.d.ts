import { ListNode } from '../../../linked-list/list-node';
import { ContactPoint } from '../../classes/contact-point';
import { PointOnShape } from '../../classes/point-on-shape';
import { LinkedLoop } from '../../../linked-list/linked-loop';
/**
 * Returns the boundary piece that starts at the immediate previous point on
 * the shape and ends at the immediate next point.
 */
declare function getNeighbouringPoints(cpGraph: LinkedLoop<ContactPoint>, pos: PointOnShape, order: number, order2: number): ListNode<ContactPoint>[];
export { getNeighbouringPoints };
