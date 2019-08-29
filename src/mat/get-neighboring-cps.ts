
import LlRbTree from 'flo-ll-rb-tree';
import { PointOnShape } from '../point-on-shape';
import { CpNode } from '../cp-node';
import { ContactPoint } from '../contact-point';


/**
 * @hidden
 * Returns the boundary piece that starts at the immediate previous point on the 
 * shape and ends at the immediate next point.  
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

    let cps = cpTree.findBounds(
        new CpNode(new ContactPoint(pos, undefined, order, order2), false, false)
    );

    if (!cps[0] && !cps[1]) { 
        // The tree is still empty
        return [undefined, undefined] as CpNode[];
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
        cps[0].data, 
        cps[1].data
    ] as CpNode[];  
}


export { getNeighbouringPoints }
