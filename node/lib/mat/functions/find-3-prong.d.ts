import Circle from '../../geometry/classes/circle';
import PointOnShape from '../../geometry/classes/point-on-shape';
import Shape from '../../geometry/classes/shape';
import ListNode from '../../linked-list/list-node';
import ContactPoint from '../classes/contact-point';
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
declare function find3Prong(shape: Shape, δs: ListNode<ContactPoint>[][]): {
    circle: Circle;
    ps: PointOnShape[];
    delta3s: ListNode<ContactPoint>[][];
};
export default find3Prong;
