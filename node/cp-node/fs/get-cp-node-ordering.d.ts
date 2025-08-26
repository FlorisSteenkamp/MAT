import { CpNode } from '../cp-node.js';
/**
 * For debugging.
 * @param cpNode
 */
declare function getCpNodeOrdering(cpNode: CpNode): {
    idx: number;
    t: number;
    order: number;
    order2: number;
};
export { getCpNodeOrdering };
