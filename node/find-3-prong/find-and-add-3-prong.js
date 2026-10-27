import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { find3Prong } from './find-3-prong.js';
import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
import { getVertexOnSameDisk } from '../add-n-prong.ts/get-vertex-on-same-disk.js';
import { addToVertex } from '../add-n-prong.ts/add-to-vertex.js';
let ii = 0;
/**
 * @internal
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpTrees
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(meta, visitedCps) {
    const δs = [];
    for (const visitedCp of visitedCps) {
        δs.push([visitedCp, visitedCp.next]);
    }
    const threeProngInfo = find3Prong(δs, meta.maxCoordPowerOf2);
    const { circle, poss, δ3s } = threeProngInfo;
    const orders = [];
    for (let i = 0; i < 3; i++) {
        orders.push(calcPosOrder(circle.center, poss[i]));
    }
    const closeBys = poss.map((pos, i) => getCloseByCpIfExist(meta, pos, circle, orders[i], 0, 3));
    // If the 3-prong is (numerically) the maximal disk of an existing vertex
    // then add its contact points to that vertex (making it an n-prong)
    // instead of adding a vertex on top of it
    const vertex = getVertexOnSameDisk(meta, circle, closeBys);
    if (vertex !== undefined) {
        const newPoss = poss.filter((_, i) => closeBys[i] === undefined);
        const cpNodes = newPoss.length > 0
            ? addToVertex(true, meta, vertex, newPoss)
            : undefined;
        if (cpNodes !== undefined) {
            return { closeBysFor3Prong: [], cpNodes };
        }
    }
    const closeBysFor3Prong = [];
    for (const closeBy of closeBys) {
        if (closeBy !== undefined) {
            const prongCount = getProngCount(closeBy);
            if (prongCount <= 2 && !closeBy.isHoleClosing) {
                closeBysFor3Prong.push(closeBy);
            }
        }
    }
    const cpNodes = closeBysFor3Prong.length === 0
        ? addToCpTree(true, false, circle, orders, meta, poss, δ3s).cpNodes
        : [];
    return { closeBysFor3Prong, cpNodes: cpNodes };
}
export { findAndAdd3Prong };
//# sourceMappingURL=find-and-add-3-prong.js.map