import type { CpNode } from "../cp-node.js";
import type { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import type { Mutable } from "../../utils/mutable.js";
import { LlRbTree } from "flo-ll-rb-tree";
import { isOrderCorrect } from "./is-order-correct.js";


function insertCpNode(
        insertIfOrderWrong: boolean,
        isHoleClosing: boolean,
        isIntersection: boolean,
        cpTree: LlRbTree<CpNode>,
        pos: PointOnShape,
        _prev: CpNode | undefined,
        lastInsertId: { id: number }): CpNode | undefined {

    if (_prev !== undefined &&
        !isOrderCorrect(cpTree, pos, _prev.next)) {

        if (!insertIfOrderWrong) {
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

    const prev = _prev === undefined ? cpNode : _prev;
    const next = _prev === undefined ? cpNode : prev.next;

    (next as Mutable<CpNode>).prev = cpNode;
    (prev as Mutable<CpNode>).next = cpNode;
    cpNode.prev = prev;
    cpNode.next = next;

    cpTree.insert(cpNode);

    return cpNode as CpNode;
}


export { insertCpNode }
