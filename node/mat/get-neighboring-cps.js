import { CpNode } from '../cp-node.js';
/**
 * @hidden
 * Returns the boundary piece that starts at the immediate previous point on the
 * shape and ends at the immediate next point.
 * @param cpTree
 * @param pos
 * @param order
 * @param order2
 */
function getNeighbouringPoints(cpTree, pos, order, order2) {
    let cps = cpTree.findBounds(new CpNode({ pointOnShape: pos, circle: undefined, order, order2 }, false, false));
    if (!cps[0] && !cps[1]) {
        // The tree is still empty
        return [undefined, undefined];
    }
    if (!cps[0] || !cps[1]) {
        // Smaller than all -> cptree.min() === cps[1].data OR
        // Larger  than all -> cptree.max() === cps[0].data
        return [
            cpTree.max(cpTree.root),
            cpTree.min(cpTree.root)
        ];
    }
    return [
        cps[0].datum,
        cps[1].datum
    ];
}
export { getNeighbouringPoints };
//# sourceMappingURL=get-neighboring-cps.js.map