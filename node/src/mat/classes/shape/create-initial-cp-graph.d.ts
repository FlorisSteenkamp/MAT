import { LinkedLoop } from '../../../linked-list/linked-loop';
import { PointOnShape } from '../../classes/point-on-shape';
import { ContactPoint } from '../../classes/contact-point';
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornersArray
 */
declare function createInitialCpGraph(sharpCornersArray: PointOnShape[][]): LinkedLoop<ContactPoint>[];
export { createInitialCpGraph };
