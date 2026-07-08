import { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";


/**
 * Returns true if the 2 given `CpNode`s are on the same maximal disk 
 * circle.
 * 
 * @param cpNode1 A `CpNode`.
 * @param cpNode2 Another `CpNode`
 */
function isOnSameCircle(
        cpNode1: CpNode,
        cpNode2: CpNode) {

    // const cpNodes = getAllOnCircle(cpNode1, true);
    const cpNodes = getAllOnCircle(cpNode1);

    return cpNodes.indexOf(cpNode2) >= 0;
}


export { isOnSameCircle }
