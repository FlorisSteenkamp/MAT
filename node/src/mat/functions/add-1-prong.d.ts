import { LinkedLoop } from '../../linked-list/linked-loop';
import { PointOnShape } from '../classes/point-on-shape';
import { ContactPoint } from '../classes/contact-point';
/**
 * Add a 1-prong to the MAT.
 * @param shape
 * @param pos
 */
declare function add1Prong(cpGraphs: LinkedLoop<ContactPoint>[], pos: PointOnShape): void;
export { add1Prong };
