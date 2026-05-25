/**
 * Return this (except if exclThis is truthy) and the the other CpNodes
 * around the maximal disk vertex circle in an anti-clockwise order.
 * @param exclThis If true the returned array does not include this
 * `CpNode`.
 */
function getAllOnCircle(cpNode, exclThis = false) {
    const startCpNode = cpNode;
    const cpNodes = exclThis ? [] : [cpNode];
    let cpNode_ = cpNode.nextOnCircle;
    while (cpNode_ !== startCpNode) {
        cpNodes.push(cpNode_);
        cpNode_ = cpNode_.nextOnCircle;
    }
    return cpNodes;
}
export { getAllOnCircle };
//# sourceMappingURL=get-all-on-circle.js.map