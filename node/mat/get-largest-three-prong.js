/** @hidden */
function getLargestThreeProng(cpNodes) {
    return cpNodes.reduce(function (maxCpNode, cpNode) {
        return cpNode === undefined || maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
            ? maxCpNode
            : cpNode;
    }, undefined);
}
export { getLargestThreeProng };
//# sourceMappingURL=get-largest-three-prong.js.map