import { CpNode } from "../cp-node.js";
import { getRealProngCount } from "./get-real-prong-count.js";


function isSpecial(
        cpNode: CpNode) {

    return (
        (getRealProngCount(cpNode) !== 2) &&
        !cpNode.isHoleClosing/* && cpNode.cp.circle.radius !== 0*/
        // !cpNode.isHoleClosing && cpNode.cp.circle.radius !== 0 // TODO2
    )
}


export { isSpecial }
