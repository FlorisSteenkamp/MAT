import { cpNodesToBoundaryBeziers } from "./cp-nodes-to-boundary-beziers.js";
import { getAllBetween } from "./get-all-between.js";
/**
 * Returns all `CpNode`s between the two given ones (inclusive).
 *
 * * If the second `CpNode` is never encountered all on the loop will be
 * returned.
 *
 * @param cpNode1
 * @param cpNode2
 * @param inclAllIfEqual if `true` and first and last `CpNode`s are equal then
 * include all `CpNode`s around the loop, otherwise include none.
 */
function getBoundaryBeziersBetween(cpNode1, cpNode2, inclAllIfEqual = true) {
    const allBetween = getAllBetween(cpNode1, cpNode2, inclAllIfEqual);
    return {
        pss: cpNodesToBoundaryBeziers(allBetween.cpNodes),
        hasHoleCloser: allBetween.hasHoleCloser
    };
}
export { getBoundaryBeziersBetween };
//# sourceMappingURL=get-boundary-beziers-between.js.map