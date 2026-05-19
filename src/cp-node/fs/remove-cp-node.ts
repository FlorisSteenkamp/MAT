// import { Loop } from 'flo-boolean';
// import { LlRbTree } from 'flo-ll-rb-tree';
import type { CpNode } from "../cp-node.js";
import type { MatMeta } from '../../mat/mat-meta.js';


function removeCpNode(
        cpNode: CpNode,
        meta: MatMeta): void {
        // cpTrees: Map<Loop, LlRbTree<CpNode>>): void {

    const { cpTrees } = meta;

    const prev = cpNode.prev;
    const next = cpNode.next;
    prev.next = next;
    next.prev = prev;

    const cpTree = cpTrees.get(cpNode.cp.pointOnShape.curve.loop)!;
    cpTree.remove(cpNode, false); 
}


export { removeCpNode }
