import type { CpNode } from "../cp-node.js";
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
declare function getBoundaryBeziersBetween(cpNode1: CpNode, cpNode2: CpNode, inclAllIfEqual?: boolean): {
    pss: number[][][];
    hasHoleCloser: boolean;
};
export { getBoundaryBeziersBetween };
