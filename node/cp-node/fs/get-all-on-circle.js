/**
 * Returns all the `CpNode`s on the same circle.
 *
 * @param cpNode
 * @param exclThis
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