/**
 * @internal
 *
 * Returns the predecessor `CpNode` in the `CpTree` or the same one if they fall
 * on top of each other.
 *
 * * returns `undefined` if the tree is still empty
 *
 * @param cpTree
 * @param pos
 * @param order
 * @param order2
 */
function getCpNodeNeighbors(cpTree, pos, order, order2) {
    const pointOnShape = { ...pos, order, order2 };
    const cps = cpTree.findBounds({ pointOnShape });
    const [cp0, cp1] = cps;
    if (cp0 === undefined && cp1 === undefined) {
        // The tree is still empty
        return undefined;
    }
    if (cp0 === undefined || cp1 === undefined) {
        // Smaller than all OR larger than all
        const minNode = cpTree.getMinNode()?.datum;
        const maxNode = cpTree.getMaxNode()?.datum;
        return [maxNode, minNode];
    }
    return [cp0.datum, cp1.datum];
}
export { getCpNodeNeighbors };
//# sourceMappingURL=get-cp-node-neighbors.js.map