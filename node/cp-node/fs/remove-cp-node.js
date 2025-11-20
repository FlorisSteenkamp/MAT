function removeCpNode(cpNode, cpTrees) {
    const prev = cpNode.prev;
    const next = cpNode.next;
    prev.next = next;
    next.prev = prev;
    const cpTree = cpTrees.get(cpNode.cp.pointOnShape.curve.loop);
    cpTree.remove(cpNode, false);
}
export { removeCpNode };
//# sourceMappingURL=remove-cp-node.js.map