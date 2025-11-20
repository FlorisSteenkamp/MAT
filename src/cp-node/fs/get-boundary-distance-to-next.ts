import { totalLength } from "flo-bezier3";
import { sum } from "../../utils/sum.js";
import { CpNode } from "../cp-node.js";
import { getBoundaryBeziersBetween } from "./get-boundary-beziers-between.js";


function getBoundaryDistanceToNext(
        cpNode: CpNode) {
    
    const { pss } = getBoundaryBeziersBetween(cpNode, cpNode.next);

    return sum(pss.map(ps => totalLength(ps)));
}


export { getBoundaryDistanceToNext }
