"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TODO: description very wrong
 * Removes a cpNode from the Mat. Returns true if successful, false if the
 * [[CpNode]] has contact point count !== 2. 3-prongs and above cannot be
 * removed since it would cause a change in MAT topology. Leaves are also not
 * removed. Even if there are >= 3 contact points and some are terminating such
 * that it is effectively a two-prong, it is not removed.
 *
 * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
 * @param cpNode The [[CpNode]] to remove.
 */
function removeCpNode(cpNode, cpTree) {
    /*
    let isTerminating = cpNode.isTerminating();
    let childCount = cpNode.getChildren().length;
    if (isTerminating /*|| childCount !== 1*/ /*) {
        return false;
    }*/
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