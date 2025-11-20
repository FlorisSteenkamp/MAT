import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";
function getRealProngCount(cpNode) {
    const nonTerminatingCpNodes = getAllOnCircle(cpNode)
        .filter(cpNode => !isTerminating(cpNode));
    return nonTerminatingCpNodes.length;
}
export { getRealProngCount };
//# sourceMappingURL=get-real-prong-count.js.map