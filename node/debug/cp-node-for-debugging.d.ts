import { CpNode } from '../cp-node/cp-node.js';
import { Generated } from './debug.js';
/**
 * @internal
 * Used for debugging only.
 */
interface ICpNodeForDebugging {
    generated: Generated;
    cpNode: CpNode;
}
export { ICpNodeForDebugging };
