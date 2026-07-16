import { isOrderCorrect } from "./is-order-correct.js";
function insertCpNode(insertIfOrderWrong, isHoleClosing, isIntersection, cpTree, pos, _prev, lastInsertId) {
    if (_prev !== undefined &&
        !isOrderCorrect(cpTree, pos, _prev.next)) {
        if (!insertIfOrderWrong) {
            return undefined;
        }
    }
    const cpNode = {
        pointOnShape: pos,
        isHoleClosing,
        isIntersection,
        id: lastInsertId.id,
        next: undefined,
        prev: undefined,
        nextOnCircle: undefined,
        prevOnCircle: undefined
    };
    lastInsertId.id++;
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