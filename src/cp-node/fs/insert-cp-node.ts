import { LlRbTree } from "flo-ll-rb-tree";
import { compareCps, ContactPoint } from "../../contact-point/contact-point.js";
import { CpNode } from "../cp-node.js";
import { isOrderCorrect } from "./is-order-correct.js";


function insertCpNode(
        insertIfOrderWrong: boolean,
        isHoleClosing: boolean,
        isIntersection: boolean,
        cpTree: LlRbTree<CpNode>,
        cp: ContactPoint, 
        _prev: CpNode | undefined) {

    if (_prev !== undefined &&
        !isOrderCorrect(cpTree, cp, _prev.next)) {

        // console.log(compareCps(cp,_prev!.next.cp))
        if (!insertIfOrderWrong) {
            return undefined;
        }
    }

    const cpNode = { cp, isHoleClosing, isIntersection } as CpNode;

    const prev = _prev === undefined ? cpNode : _prev;
    const next = _prev === undefined ? cpNode : prev.next;

    next.prev = cpNode;
    prev.next = cpNode;
    cpNode.prev = prev;
    cpNode.next = next;

    cpTree.insert(cpNode);

    return cpNode;
}


export { insertCpNode }
