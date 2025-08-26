import { Loop } from 'flo-boolean';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from "../cp-node.js";


function removeCpNode(
        cpNode: CpNode,
        cpTrees: Map<Loop, LlRbTree<CpNode>>): void {

    const prev = cpNode.prev;
    const next = cpNode.next;
    prev.next = next;
    next.prev = prev;

    const cpTree = cpTrees.get(cpNode.cp.pointOnShape.curve.loop)!;
    cpTree.remove(cpNode, false); 
}


export { removeCpNode }
