import { getProngCount, getRealProngCount, isFullyTerminating, isOneProng, isSharp, isTerminating } from "./cp-node.js";
import { getCpNodeOrdering } from './get-cp-node-ordering.js';
function enhanceCpNode(cpNode) {
    const cp = cpNode.cp;
    const pos = cp.pointOnShape;
    const curve = pos.curve;
    return {
        ...cpNode,
        isTerminating: isTerminating(cpNode),
        isFullyTerminating: isFullyTerminating(cpNode),
        isSharp: isSharp(cpNode),
        isOneProng: isOneProng(cpNode),
        prongCount: getProngCount(cpNode),
        getRealProngCount: getRealProngCount(cpNode),
        ordering: getCpNodeOrdering(cpNode),
        curve,
        loop: curve.loop
    };
}
export { enhanceCpNode };
//# sourceMappingURL=enhance-cp-node.js.map