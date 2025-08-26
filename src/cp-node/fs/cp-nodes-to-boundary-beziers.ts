import { CpNode } from "../cp-node.js";
import { getBoundaryBeziersToNext } from "./get-boundary-beziers-to-next.js";


function cpNodesToBoundaryBeziers(cpNodes: CpNode[]) {
    return cpNodes.flatMap(getBoundaryBeziersToNext)
}


export { cpNodesToBoundaryBeziers }
