import { CpNode } from '../cp-node';
import { Generated } from './debug';
/**
 * @hidden
 * Used for debugging only.
 */
interface ICpNodeForDebugging {
    generated: Generated;
    cpNode: CpNode;
}
export { ICpNodeForDebugging };
