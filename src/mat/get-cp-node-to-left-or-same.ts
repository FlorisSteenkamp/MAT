import { LlRbTree } from 'flo-ll-rb-tree';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CpNode } from '../cp-node/cp-node.js';


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
        pos: PointOnShape,
        order: number,
        order2: number): CpNode | undefined {

    const cp = { pointOnShape: pos, order, order2 };
    const cps = cpTree.findBounds({ cp } as unknown as CpNode);

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
