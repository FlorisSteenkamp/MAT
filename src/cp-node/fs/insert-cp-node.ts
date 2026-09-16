import type { CpNode } from "../cp-node.js";
import type { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import type { Mutable } from "../../utils/mutable.js";
import { RbTree } from "flo-ll-rb-tree";
import { isOrderCorrect } from "./is-order-correct.js";


/**
 * 
 * @param insertIfOrderWrong order cannot be checked for hole-closers since they're on different loops
 * @param isHoleClosing 
 * @param isIntersection 
 * @param cpTree 
 * @param pos 
 * @param pred predecessor (to `pos`) on sampe loop (found via `cpTree`)
 * @param succ successor (to `pos`) on sampe loop (found via `cpTree`)
 * @param lastInsertId 
 */
function insertCpNode(
        insertIfOrderWrong: boolean,
        isHoleClosing: boolean,
        isIntersection: boolean,
        cpTree: RbTree<CpNode>,
        pos: PointOnShape,
        pred: CpNode | undefined,
        succ: CpNode | undefined,
        lastInsertId: { id: number }): CpNode | undefined {

    if (pred !== undefined && succ !== undefined) {
        // !isOrderCorrect(cpTree, pos, pred.next, false)) {
        const orderCorrect = isOrderCorrect(cpTree, pred, pos, succ, false);
        // if (!orderCorrect) {
        //     console.log('aaaaa');
        // }
        if (!insertIfOrderWrong && !orderCorrect) {
            return undefined;
        }
    }

    const cpNode: Mutable<CpNode> = {
        pointOnShape: pos,
        isHoleClosing,
        isIntersection,
        id: lastInsertId.id,
        next: undefined!,
        prev: undefined!,
        nextOnCircle: undefined!,
        prevOnCircle: undefined!
    };
    lastInsertId.id++;

    const prev = pred === undefined ? cpNode : pred;
    const next = pred === undefined ? cpNode : prev.next;

    (next as Mutable<CpNode>).prev = cpNode;
    (prev as Mutable<CpNode>).next = cpNode;
    cpNode.prev = prev;
    cpNode.next = next;

    cpTree.insert(cpNode);

    return cpNode as CpNode;
}


export { insertCpNode }
