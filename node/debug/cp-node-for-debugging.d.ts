import { CpNode } from '../cp-node.js';
import { Generated } from './debug.js';
/**
 * @hidden
 * Used for debugging only.
 */
interface ICpNodeForDebugging {
    generated: Generated;
    cpNode: CpNode;
}
export { ICpNodeForDebugging };
