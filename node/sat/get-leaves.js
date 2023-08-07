import { getAllOnLoop, isTerminating } from '../cp-node/cp-node.js';
/** @internal */
function getLeaves(cpNode) {
    const leaves = [];
    const cps = getAllOnLoop(cpNode);
    for (const cp of cps) {
        if (isTerminating(cp)) {
            leaves.push(cp);
        }
    }
    return leaves;
}
export { getLeaves };
//# sourceMappingURL=get-leaves.js.map