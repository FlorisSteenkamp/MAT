import { isTerminating } from "./is-terminating.js";
/**
 * Returns the first `CpNode` *after* the given one (by successively applying
 * `.nextOnCircle`) that exits the circle, i.e. the first one that is not
 * terminating - the given `CpNode` itself is never returned.
 *
 * * returns `undefined` if no other `CpNode` on the circle exits (e.g. the
 *   other `CpNode` of a 1-prong, or the MAT is a single point)
 */
function getFirstExit(cpNode) {
    let cpNode_ = cpNode.nextOnCircle;
    while (cpNode_ !== cpNode) {
        if (!isTerminating(cpNode_)) {
            return cpNode_;
        }
        cpNode_ = cpNode_.nextOnCircle;
    }
    return undefined;
}
export { getFirstExit };
//# sourceMappingURL=get-first-exit.js.map