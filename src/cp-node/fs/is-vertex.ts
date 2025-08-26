import { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";


function isVertex(
        f: (cpNode: CpNode) => boolean) {

    return (cpNode: CpNode) => getAllOnCircle(cpNode).some(f);
}


export { isVertex }
