import { CpNode } from "../cp-node.js";
/**
 * Returns all `CpNode`s between the two given ones (exclisive the last one).
 *
 * * If the second `CpNode` is never encountered all on the loop will be
 * returned.
 *
 * @param cpNodeS
 * @param cpNodeE
 * @param inclAllIfEqual if `true` and first and last `CpNode`s are equal then
 * include all `CpNode`s around the loop, otherwise include none.
 */
declare function getAllBetween(cpNodeS: CpNode, cpNodeE: CpNode, inclAllIfEqual?: boolean): {
    cpNodes: CpNode[];
    hasHoleCloser: boolean;
};
export { getAllBetween };
