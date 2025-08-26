import { CpNode } from '../cp-node.js';


/**
 * For debugging.
 * @param cpNode 
 */
function getCpNodeOrdering(cpNode: CpNode) {
    const cp = cpNode.cp;
    const pos = cp.pointOnShape;

    return {
        'idx': pos.curve.idx,
        't': pos.t,
        'order': cp.order,
        'order2': cp.order2
    };
}


export { getCpNodeOrdering }
