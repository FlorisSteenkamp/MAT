import { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";


function isOnSameCircle(
        cpNode1: CpNode,
        cpNode2: CpNode) {

    // const cpNodes = getAllOnCircle(cpNode1, true);
    const cpNodes = getAllOnCircle(cpNode1);

    return cpNodes.indexOf(cpNode2) >= 0;
}


export { isOnSameCircle }
