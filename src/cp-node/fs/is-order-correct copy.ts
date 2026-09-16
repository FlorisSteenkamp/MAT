import type { CpNode } from "../cp-node.js";
import { RbTree } from "flo-ll-rb-tree";
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { comparePoss } from "../../point-on-shape/compare-poss.js";


/**
 * 
 * @param cpTree 
 * @param pos 
 * @param succ 
 * @param alreadyInserted set to `true` if the given `pos` has already been
 * inserted, `false` otherwise.
 */
function isOrderCorrect(
        cpTree: RbTree<CpNode>,
        pred: CpNode,
        pos: PointOnShape,
        succ: CpNode,
        alreadyInserted: boolean): boolean {

    if (cpTree.size <= (alreadyInserted ? 2 : 1)) {
        return true;
    }

    const c = comparePoss(pos, succ.pointOnShape);


    if (c < 0) { return true; }
    if (c === 0) { return false; }

    const minNode = cpTree.getMinNode()!.datum;
    const maxNode = cpTree.getMaxNode()!.datum;

    // larger than all -> crossing zero on loop
    const largerThanAll = comparePoss(pos, maxNode.pointOnShape!) >= 0;
    const r = 
        largerThanAll &&
        minNode === succ;


    // const r = (pos === max.pointOnShape) && (next === min);

    if (!r) {
        console.log(c);
        console.log(cpTree.toArr().map(v => {
            return {
                curveIdx: v.pointOnShape.curve.idx,
                t: v.pointOnShape.t,
                order: v.pointOnShape.order,
                order2: v.pointOnShape.order2
            }
        }));
    }

    return r;
}


export { isOrderCorrect }
