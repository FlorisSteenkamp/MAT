/**
 * For debugging.
 * @param cpNode
 */
function getCpNodeOrdering(cpNode) {
    // const cp = cpNode.cp;
    const pos = cpNode.pointOnShape;
    return {
        'idx': pos.curve.idx,
        't': pos.t,
        'order': pos.order,
        'order2': pos.order2
    };
}
export { getCpNodeOrdering };
//# sourceMappingURL=get-cp-node-ordering.js.map