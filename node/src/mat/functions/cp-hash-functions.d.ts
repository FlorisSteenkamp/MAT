import { CpNode } from '../../linked-list/cp-node';
import { Loop } from '../../linked-list/loop';
import { CpGraph } from '../../linked-list/cp-graph';
import { ContactPoint } from '../classes/contact-point';
import { PointOnShape } from '../classes/point-on-shape';
import { Circle } from '../classes/circle';
/**
 * Checks the position of the ContactPoint (cp) on the boundary piece.
 * Returns < 0 if the cp is not on δ, > 0 if it is on the boundary piece
 * excluding the endpoints and 0 if it is on the endpoints. Also returns > 0 if
 * δ === undefined.
 * @param δ The boundary piece
 * @param cp The contact point
 */
declare function cmpCpOnδ(δ: CpNode[], cp: ContactPoint): 0 | 1 | -1;
/**
*
* @param shape The shape
* @param pos1
* @param circle1
*/
declare function checkForCloseCp(cpGraphs: Map<Loop, CpGraph>, pos1: PointOnShape, circle1: Circle, order: number, order2: number, color: string): boolean;
export { cmpCpOnδ, checkForCloseCp };
