/**
 * Returns all `CpNode`s on the MAT that this `CpNode` is part of
 * starting from the current one and going anti-clockwise around the shape.
 */
function getAllOnLoop(cpNode) {
    const cpStart = cpNode;
    const cpNodes = [];
    do {
        cpNodes.push(cpNode);
        cpNode = cpNode.next;
    } while (cpNode !== cpStart);
    return cpNodes;
}
export { getAllOnLoop };
//# sourceMappingURL=get-all-on-loop.js.map