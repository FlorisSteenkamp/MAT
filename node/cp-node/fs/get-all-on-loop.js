/**
 * Returns all `CpNode`s on the MAT that this `CpNode` is part of
 * starting from the current one and going anti-clockwise around the shape.
 */
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