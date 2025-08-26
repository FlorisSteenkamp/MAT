import { CpNode } from "../cp-node.js";
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
declare function getBoundaryBeziersBetween(cpNode1: CpNode, cpNode2: CpNode, inclAllIfEqual?: boolean): {
    pss: number[][][];
    hasHoleCloser: boolean;
};
export { getBoundaryBeziersBetween };
