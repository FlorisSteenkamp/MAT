import type { CpNode } from "../cp-node.js";
import { LlRbTree } from "flo-ll-rb-tree";
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { comparePoss } from "../../point-on-shape/compare-poss.js";


function isOrderCorrect(
        cpTree: LlRbTree<CpNode>,
        pos: PointOnShape,
        next: CpNode): boolean {

    // TODO2
    const c = comparePoss(pos, next.pointOnShape);
    if (c < 0) { return true; }
    if (c === 0) {
        // TODO2
        // console.log('c === 0');
        return true;
    }

    const minNode = cpTree.getMinNode();
    if (minNode === undefined) {  // if tree not empty
        return true;
    }

    const min = minNode.datum;
    const max = cpTree.getMaxNode()!.datum;

    // larger than all -> crossing zero on loop
    return (comparePoss(max.pointOnShape!, pos) < 0 && min === next);
}


export { isOrderCorrect }
