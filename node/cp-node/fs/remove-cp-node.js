function removeCpNode(cpNode, meta) {
    const { cpTrees } = meta;
    const prev = cpNode.prev;
    const next = cpNode.next;
    prev.next = next;
    next.prev = prev;
    const cpTree = cpTrees.get(cpNode.pointOnShape.curve.loop);
    cpTree.remove(cpNode, false);
}
export { removeCpNode };
//# sourceMappingURL=remove-cp-node.js.map