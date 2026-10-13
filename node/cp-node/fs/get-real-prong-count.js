import { isTerminating } from "./is-terminating.js";
/**
 * Returns the number of contact points (up to planar coordinates) on the
 * maximal disk circle implied by this `CpNode`, i.e. the number of
 * non-terminating `CpNode`s on its circle.
 *
 * See also `getProngCount`.
 */
function getRealProngCount(cpNode) {
    let count = 0;
    let cpNode_ = cpNode;
    do {
        if (!isTerminating(cpNode_)) {
            count++;
        }
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== cpNode);
    return count;
}
export { getRealProngCount };
//# sourceMappingURL=get-real-prong-count.js.map