import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";
/**
 * Returns the number of contact points (up to planar coordinates) on the
 * maximal disk circle implied by this `CpNode`.
 *
 * See also `getProngCount`.
 */
function getRealProngCount(cpNode) {
    const nonTerminatingCpNodes = getAllOnCircle(cpNode)
        .filter(cpNode => !isTerminating(cpNode));
    return nonTerminatingCpNodes.length;
}
export { getRealProngCount };
//# sourceMappingURL=get-real-prong-count.js.map