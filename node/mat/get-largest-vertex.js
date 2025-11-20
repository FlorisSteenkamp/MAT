import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
/** @internal */
function getLargestVertex(cpNode) {
    const cpNodes = getAllOnLoop(cpNode);
    return cpNodes.reduce(function (maxCpNode, cpNode) {
        return maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
            ? maxCpNode
            : cpNode;
    }, cpNodes[0]);
}
export { getLargestVertex };
//# sourceMappingURL=get-largest-vertex.js.map