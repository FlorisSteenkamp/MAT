import { CpNode } from "../cp-node.js";
import { getAllOnLoop } from "./get-all-on-loop.js";


function getHoleClosers(
        cpNode: CpNode) {

    return getAllOnLoop(cpNode)
    .filter(cpNode => cpNode.isHoleClosing);
}


export { getHoleClosers }
