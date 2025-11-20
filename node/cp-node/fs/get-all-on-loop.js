function getAllOnLoop(cpNode) {
    const cpStart = cpNode;
    const cpNodes = [cpStart];
    let cpNode_ = cpNode.next;
    while (cpNode_ !== cpStart) {
        cpNodes.push(cpNode_);
        cpNode_ = cpNode_.next;
    }
    return cpNodes;
}
export { getAllOnLoop };
//# sourceMappingURL=get-all-on-loop.js.map