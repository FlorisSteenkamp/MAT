import { isOrderCorrect } from "./is-order-correct.js";
function insertCpNode(insertIfOrderWrong, isHoleClosing, isIntersection, cpTree, cp, _prev) {
    if (_prev !== undefined &&
        !isOrderCorrect(cpTree, cp, _prev.next)) {
        // console.log(compareCps(cp,_prev!.next.cp))
        if (!insertIfOrderWrong) {
            return undefined;
        }
    }
    const cpNode = { cp, isHoleClosing, isIntersection };
    const prev = _prev === undefined ? cpNode : _prev;
    const next = _prev === undefined ? cpNode : prev.next;
    next.prev = cpNode;
    prev.next = cpNode;
    cpNode.prev = prev;
    cpNode.next = next;
    cpTree.insert(cpNode);
    return cpNode;
}
export { insertCpNode };
//# sourceMappingURL=insert-cp-node.js.map