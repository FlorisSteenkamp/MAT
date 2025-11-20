import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";
function isFullyTerminating(cpNode) {
    const otherOnCircle = getAllOnCircle(cpNode.prevOnCircle, true);
    return otherOnCircle.every(isTerminating);
}
export { isFullyTerminating };
//# sourceMappingURL=is-fully-terminating.js.map