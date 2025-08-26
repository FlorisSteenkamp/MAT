import { totalLength } from "flo-bezier3";
import { sum } from "../../utils/sum";
import { CpNode } from "../cp-node";
import { getBoundaryBeziersBetween } from "./get-boundary-beziers-between";


function getBoundaryDistanceToNext(
        cpNode: CpNode) {
    
    const { pss } = getBoundaryBeziersBetween(cpNode, cpNode.next);

    return sum(pss.map(ps => totalLength(ps)));
}


export { getBoundaryDistanceToNext }
