import { getAllBetween } from "./get-all-between.js";
import { getBoundaryBeziersToNext } from "./get-boundary-beziers-to-next.js";
/**
 * Returns the bezier curves of the shape boundary from the contact point of
 * the first given `CpNode` to that of the second (following `next`), together
 * with whether a hole closer was passed on the way.
 *
 * * If the second `CpNode` is never encountered the entire boundary is
 * returned.
 *
 * @param cpNode1
 * @param cpNode2
 * @param inclAllIfEqual if `true` and the two `CpNode`s are equal then return
 * the entire boundary, otherwise return nothing.
 */
function getBoundaryBeziersBetween(cpNode1, cpNode2, inclAllIfEqual = true) {
    const { cpNodes, hasHoleCloser } = getAllBetween(cpNode1, cpNode2, inclAllIfEqual);
    const pss = cpNodes.flatMap(getBoundaryBeziersToNext);
    return { pss, hasHoleCloser };
}
export { getBoundaryBeziersBetween };
//# sourceMappingURL=get-boundary-beziers-between.js.map