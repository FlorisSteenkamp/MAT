import { Circle } from '../classes/circle';
import { ContactPoint } from '../classes/contact-point';
import { PointOnShape } from '../classes/point-on-shape';
import { LinkedLoop } from '../../linked-list/linked-loop';
/**
 * Adds a 2-prong contact circle to the shape.
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param posSource - The source point on shape
 * @param posAntipode - The found antipodal point on shape
 * @param delta The boundary piece within which the new contact point should be
 * placed
 */
declare function add2Prong(cpGraphs: LinkedLoop<ContactPoint>[], circle: Circle, posSource: PointOnShape, posAntipode: PointOnShape, holeClosing: boolean, kSource: number, kAntipode: number): void;
export { add2Prong };
