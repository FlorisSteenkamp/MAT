import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';
import { getVertexOnSameDisk } from './get-vertex-on-same-disk.js';
import { addToVertex } from './add-to-vertex.js';
/**
 * @internal
 * Adds an n-prong (n >= 2) maximal disk (not a hole-closer) to the MAT and
 * returns one of its `CpNode`s (or `undefined` if nothing was added).
 *
 * If some contact point lies on top of a contact point of an existing vertex
 * with the same maximal disk then the new contact points are added to that
 * vertex instead. Otherwise, if any contact point lies on top of an existing
 * `CpNode`, nothing is added (it can cause floating point stability issues).
 *
 * @param meta
 * @param circle the maximal disk
 * @param poss the contact points
 */
function addNProng(meta, circle, poss) {
    // A point at `t === 0` is represented as the end of the previous curve
    poss = poss.map(pos => pos.t === 0
        ? { ...pos, curve: pos.curve.prev, t: 1 }
        : pos);
    const orders = poss.map(pos => calcPosOrder(circle.center, pos));
    const closeBys = poss.map((pos, i) => getCloseByCpIfExist(meta, pos, circle, orders[i], 0, poss.length));
    const vertex = getVertexOnSameDisk(meta, circle, closeBys);
    if (vertex !== undefined) {
        const newPoss = poss.filter((_, i) => closeBys[i] === undefined);
        if (newPoss.length === 0) {
            return undefined;
        }
        return addToVertex(false, meta, vertex, newPoss)?.[0];
    }
    if (closeBys.some(closeBy => closeBy !== undefined)) {
        return undefined;
    }
    const { anyFailed, cpNodes } = addToCpTree(false, false, circle, orders, meta, poss);
    if (anyFailed) {
        cpNodes.forEach(cpNode => {
            if (cpNode !== undefined) {
                removeCpNode(cpNode, meta);
            }
        });
        return undefined;
    }
    return cpNodes[0];
}
export { addNProng };
//# sourceMappingURL=add-n-prong.js.map