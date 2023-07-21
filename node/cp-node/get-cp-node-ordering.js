function getCpNodeOrdering(cpNode) {
    const cp = cpNode.cp;
    const pos = cp.pointOnShape;
    return {
        'idx': pos.curve.idx,
        't': pos.t,
        'order': cp.order,
        'order2': cp.order2
    };
}
export { getCpNodeOrdering };
//# sourceMappingURL=get-cp-node-ordering.js.map