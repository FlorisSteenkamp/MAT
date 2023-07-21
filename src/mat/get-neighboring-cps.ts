import { LlRbTree } from 'flo-ll-rb-tree';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CpNode } from '../cp-node/cp-node.js';
import { createCpNode } from '../cp-node/create-cp-node.js';


/**
 * @internal
 * 
 * Returns the boundary piece that starts at the immediate previous point on the 
 * shape and ends at the immediate next point.  
 * 
 * @param cpTree 
 * @param pos 
 * @param order 
 * @param order2 
 */
function getNeighbouringPoints(
        cpTree: LlRbTree<CpNode>,
        pos: PointOnShape,
        order: number,
        order2: number) {

    const cps = cpTree.findBounds(
        createCpNode({ pointOnShape: pos, circle: undefined!, order, order2 }, false, false)
    );

    if (!cps[0] && !cps[1]) { 
        // The tree is still empty
        return [undefined!, undefined!] as CpNode[];
    }

    if (!cps[0] || !cps[1]) { 
        // Smaller than all -> cptree.min() === cps[1].data OR
        // Larger  than all -> cptree.max() === cps[0].data
        return [
            cpTree.max(cpTree.root), 
            cpTree.min(cpTree.root) 
        ] as CpNode[];
    }

    return [
        cps[0].datum, 
        cps[1].datum
    ] as CpNode[];  
}


export { getNeighbouringPoints }
