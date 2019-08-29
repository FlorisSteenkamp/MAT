import { CpNode } from '../cp-node/cp-node';
import { ContactPoint } from '../contact-point';
/**
 * @hidden
 * Note: For debugging only
 * Checks the position of the ContactPoint (cp) on the boundary piece.
 * Returns < 0 if the cp is not on δ, > 0 if it is on the boundary piece
 * excluding the endpoints and 0 if it is on the endpoints. Also returns > 0 if
 * δ === undefined.
 * @param δ The boundary piece
 * @param cp The contact point
 */
declare function cmpCpOnδ(δ: CpNode[], cp: ContactPoint): 0 | 1 | -1;
export { cmpCpOnδ };
