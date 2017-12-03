import MatCircle from '../../mat/classes/mat-circle';
import ContactPoint from '../../mat/classes/contact-point';
import ListNode from '../../linked-list/list-node';
import Shape from '../../geometry/classes/shape';
import Circle from '../../geometry/classes/circle';
import PointOnShape from '../../geometry/classes/point-on-shape';
/**
 * Adds a 3-prong MAT circle according to the 3 given
 * (previously calculated) points on the shape.
 *
 * @param shape
 * @param circle
 * @param [p1,p2,p3]
 * @param deltas
 * @returns {MatCircle} matCircle
 */
declare function add3Prong(shape: Shape, threeProng: {
    circle: Circle;
    ps: PointOnShape[];
    delta3s: ListNode<ContactPoint>[][];
}): MatCircle;
export default add3Prong;
