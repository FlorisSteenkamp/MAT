import { CpNode } from '../cp-node/cp-node';
import { Generated } from './debug';
/**
 * @hidden
 * Class used for debugging only.
 */
declare class CpNodeForDebugging {
    generated: Generated;
    cpNode: CpNode;
    cpsSimple: string[][];
    constructor(generated: Generated, cpNode: CpNode);
}
export { CpNodeForDebugging };
