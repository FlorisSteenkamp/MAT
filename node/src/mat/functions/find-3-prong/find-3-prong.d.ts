import { ListNode } from '../../../linked-list/list-node';
import { Circle } from '../../classes/circle';
import { PointOnShape } from '../../classes/point-on-shape';
import { ContactPoint } from '../../classes/contact-point';
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
declare function find3Prong(δs: ListNode<ContactPoint>[][]): {
    circle: Circle;
    ps: PointOnShape[];
    δ3s: ListNode<ContactPoint>[][];
};
export { find3Prong };
