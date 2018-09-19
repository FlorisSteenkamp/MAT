import LlRbTree from 'flo-ll-rb-tree/node';
import { CpNode } from '..//cp-node';
import { Loop } from '../loop';
import { ContactPoint } from '../contact-point';
import { PointOnShape } from '../point-on-shape';
import { Circle } from '../circle';
/**
 * Note: For debugging only
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
 * @param cpTrees
 * @param pos
 * @param circle
 * @param order
 * @param order2
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * @param color Used for debugging only
 */
declare function checkForCloseCp(cpTrees: Map<Loop, LlRbTree<CpNode>>, pos: PointOnShape, circle: Circle, order: number, order2: number, extreme: number, color: string): boolean;
export { cmpCpOnδ, checkForCloseCp };
