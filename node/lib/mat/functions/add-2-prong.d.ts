import Circle from '../../geometry/classes/circle';
import Shape from '../../geometry/classes/shape';
import PointOnShape from '../../geometry/classes/point-on-shape';
/**
 * Adds a 2-prong contact circle to the shape.
 *
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param pos1 - First point on shape
 * @param pos2 - Second point on shape
 * @param delta The boundary piece within which the new contact point should be
 * placed
 */
declare function add2Prong(shape: Shape, circle: Circle, pos1: PointOnShape, pos2: PointOnShape, holeClosing: boolean): void;
export default add2Prong;
