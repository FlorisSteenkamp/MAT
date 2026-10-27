import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';
import { getCpNodeNeighbors } from '../mat/get-cp-node-neighbors.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { joinSpokes } from './join-spokes.js';
/**
 * @internal
 * Adds the given contact points to the existing vertex (maximal disk) of the
 * given `CpNode`, e.g. turning a 3-prong into a 4-prong, and returns the newly
 * inserted `CpNode`s (or `undefined` if they could not be inserted, in which
 * case nothing changes).
 *
 * The contact points are assumed to lie on the vertex's circle.
 *
 * @param insertIfOrderIsWrong
 * @param meta
 * @param vertex a `CpNode` on the vertex
 * @param poss the contact points to add
 */
function addToVertex(insertIfOrderIsWrong, meta, vertex, poss) {
    const { cpTrees, lastInsertId } = meta;
    const { circle } = vertex.pointOnShape;
    const cpNodes = [];
    for (const pos of poss) {
        const order = calcPosOrder(circle.center, pos);
        const cpTree = cpTrees.get(pos.curve.loop);
        const r = getCpNodeNeighbors(cpTree, pos, order, 0);
        const pred = r?.[0];
        const succ = r?.[1];
        const cpNode = insertCpNode(insertIfOrderIsWrong, false, false, cpTree, { ...pos, circle, order, order2: 0 }, pred, succ, lastInsertId);
        if (cpNode === undefined) {
            cpNodes.forEach(cpNode => removeCpNode(cpNode, meta));
            return undefined;
        }
        cpNodes.push(cpNode);
    }
    joinSpokes(circle, [...getAllOnCircle(vertex), ...cpNodes]);
    return cpNodes;
}
export { addToVertex };
//# sourceMappingURL=add-to-vertex.js.map