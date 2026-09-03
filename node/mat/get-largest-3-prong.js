import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';
function getLargest3Prong(cpNode) {
    const cpNodes = getAllOnLoop(cpNode)
        .filter(cpNode => getRealProngCount(cpNode) >= 3);
    if (cpNodes.length === 0) {
        return undefined;
    }
    return cpNodes.reduce(function (maxCpNode, cpNode) {
        return maxCpNode.pointOnShape.circle.radius >= cpNode.pointOnShape.circle.radius
            ? maxCpNode
            : cpNode;
    }, cpNodes[0]);
}
export { getLargest3Prong };
//# sourceMappingURL=get-largest-3-prong.js.map