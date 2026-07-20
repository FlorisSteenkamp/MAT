import { isOnSameLoop } from "../cp-node/fs/is-on-same-loop.js";
import { isFullyTerminating } from "./is-fully-terminating.js";
import { getAllOnLoop_ByLoop } from "./get-all-on-loop-by-loop.js";
function getCpNodessForSat(sat) {
    let { cpNode } = sat;
    while (!isFullyTerminating(cpNode)) {
        cpNode = cpNode.next;
    }
    if (!isOnSameLoop(cpNode, cpNode.next)) {
        cpNode = cpNode.holeCloserTwin;
    }
    return getAllOnLoop_ByLoop(cpNode);
}
export { getCpNodessForSat };
//# sourceMappingURL=get-cp-nodess-for-sat.js.map