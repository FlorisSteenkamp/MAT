import { isTerminating } from "./is-terminating.js";
function traverseCp(cpStart) {
    let cpNode = cpStart;
    if (isTerminating(cpNode)) {
        return [cpNode]; // one-sharp corner
    }
    const visitedCps = [];
    do {
        visitedCps.push(cpNode);
        const next = cpNode.next.prevOnCircle;
        cpNode = cpNode === next
            ? cpNode = cpNode.next.next // Terminal vertex
            : cpNode = next; // Take last exit
    } while (cpNode !== cpStart);
    return visitedCps;
}
export { traverseCp };
//# sourceMappingURL=traverse-cp.js.map