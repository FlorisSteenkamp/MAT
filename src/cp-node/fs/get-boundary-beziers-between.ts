import type { CpNode } from "../cp-node.js";
import { getAllBetween } from "./get-all-between.js";
import { getBoundaryBeziersToNext } from "./get-boundary-beziers-to-next.js";


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
function getBoundaryBeziersBetween(
        cpNode1: CpNode,
        cpNode2: CpNode,
        inclAllIfEqual = true): {
            pss: number[][][],
            hasHoleCloser: boolean
        } {

    const { cpNodes, hasHoleCloser } =
        getAllBetween(cpNode1,cpNode2,inclAllIfEqual);

    const pss = cpNodes.flatMap(getBoundaryBeziersToNext);

    return { pss, hasHoleCloser }
}


export { getBoundaryBeziersBetween }
