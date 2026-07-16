import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { CpNode } from '../cp-node/cp-node.js';
import { LlRbTree } from 'flo-ll-rb-tree';


/**
 * @internal
 * 
 * Returns the predecessor `CpNode` in the `CpTree` or the same one if they fall
 * on top of each other.
 * 
 * * returns `undefined` if the tree is still empty
 * 
 * @param cpTree 
 * @param pos 
 * @param order 
 * @param order2 
 */
function getCpNodeToLeftOrSame(
        cpTree: LlRbTree<CpNode>,
        pos: PrePointOnShape,
        order: number,
        order2: number): CpNode | undefined {

    const pointOnShape = { ...pos, order, order2 };
    const cps = cpTree.findBounds({ pointOnShape } as CpNode);

    if (cps[0] === undefined && cps[1] === undefined) { 
        // The tree is still empty
        return undefined;
    }

    if (cps[0] === undefined || cps[1] === undefined) { 
        // Smaller than all -> cptree.min() === cps[1].data OR
        // Larger  than all -> cptree.max() === cps[0].data
        return cpTree.max(cpTree.root);
    }

    return cps[0].datum;
}


export { getCpNodeToLeftOrSame }
