import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from "./cp-node.js";


/**
 * Removes a cpNode from the MAT.
 * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
 * @param cpNode The [[CpNode]] to remove.
 */
function removeCpNode(cpNode: CpNode, cpTree?: LlRbTree<CpNode>): void {
    const prev = cpNode.prev;
    const next = cpNode.next;
    prev.next = next;
    next.prev = prev;

    const nextOpposite = next.prevOnCircle;
    const prevOpposite = prev.nextOnCircle;
    nextOpposite.next = prevOpposite;
    prevOpposite.prev = nextOpposite;
    
    if (cpTree) {
        cpTree.remove(cpNode, false); 
    }
}


export { removeCpNode }
