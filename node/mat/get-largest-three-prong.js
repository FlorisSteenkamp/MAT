"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLargestThreeProng(cpNodes) {
    return cpNodes.reduce(function (maxCpNode, cpNode) {
        return cpNode === undefined || maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
            ? maxCpNode
            : cpNode;
    }, undefined);
}
exports.getLargestThreeProng = getLargestThreeProng;
//# sourceMappingURL=get-largest-three-prong.js.map