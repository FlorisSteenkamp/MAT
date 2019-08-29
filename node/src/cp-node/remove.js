"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes a cpNode from the MAT.
 * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
 * @param cpNode The [[CpNode]] to remove.
 */
function removeCpNode(cpNode, cpTree) {
    let prev = cpNode.prev;
    let next = cpNode.next;
    prev.next = next;
    next.prev = prev;
    let nextOpposite = next.prevOnCircle;
    let prevOpposite = prev.nextOnCircle;
    nextOpposite.next = prevOpposite;
    prevOpposite.prev = nextOpposite;
    if (cpTree) {
        cpTree.remove(cpNode, false);
    }
}
exports.removeCpNode = removeCpNode;
//# sourceMappingURL=remove.js.map