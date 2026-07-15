import type { CpNode } from "../cp-node.js";
import type { MatMeta } from '../../mat/mat-meta.js';
import type { Mutable } from "../../utils/mutable.js";


function removeCpNode(
        cpNode: CpNode,
        meta: MatMeta): void {

    const { cpTrees } = meta;

    const prev = cpNode.prev;
    const next = cpNode.next;
    (prev as Mutable<CpNode>).next = next;
    (next as Mutable<CpNode>).prev = prev;

    const cpTree = cpTrees.get(cpNode.pointOnShape.curve.loop)!;
    cpTree.remove(cpNode, false); 
}


export { removeCpNode }
