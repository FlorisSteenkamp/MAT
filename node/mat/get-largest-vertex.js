"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLargestVertex(cpNodes) {
    return cpNodes.reduce(function (maxCpNode, cpNode) {
        return maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
            ? maxCpNode
            : cpNode;
    }, cpNodes[0]);
}
exports.getLargestVertex = getLargestVertex;
//# sourceMappingURL=get-largest-vertex.js.map