function getAllOnCircle(cpNode, exclThis = false) {
    const startCpNode = cpNode;
    let cpNode_ = startCpNode;
    const cpNodes = [];
    do {
        if (!(exclThis && cpNode_ === startCpNode)) {
            cpNodes.push(cpNode_);
        }
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode);
    return cpNodes;
}
export { getAllOnCircle };
//# sourceMappingURL=get-all-on-circle.js.map