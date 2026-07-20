import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { find3Prong } from './find-3-prong.js';
import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
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
    // TODO - remove - debugging
    //-------------------------
    // ii++;
    // if (ii === 13) {
    //     //@ts-ignore
    //     if (_debug_.temp === undefined) { _debug_.temp = []; }
    //     //@ts-ignore
    //     _debug_.temp.push(δs);
    // }
    // //@ts-ignore
    // if (_debug_.temp2 === undefined) { _debug_.temp2 = []; }
    // //@ts-ignore
    // _debug_.temp2.push(δs.length);
    //-------------------------
    const threeProngInfo = find3Prong(δs, meta.maxCoordPowerOf2);
    const { circle, poss, δ3s } = threeProngInfo;
    const orders = [];
    for (let i = 0; i < 3; i++) {
        orders.push(calcPosOrder(circle.center, poss[i]));
    }
    const closeBysFor3Prong = [];
    for (let i = 0; i < poss.length; i++) {
        const pos = poss[i];
        const order = orders[i];
        const closeBy = getCloseByCpIfExist(meta, pos, circle, order, 0, 3);
        if (closeBy !== undefined) {
            const prongCount = getProngCount(closeBy);
            if (prongCount <= 2 && !closeBy.isHoleClosing) {
                closeBysFor3Prong.push(closeBy);
            }
        }
    }
    const cpNodes = closeBysFor3Prong.length === 0
        ? addToCpTree(true, false, circle, orders, meta, poss, δ3s.map(v => v[0])).cpNodes
        : [];
    return { closeBysFor3Prong, cpNodes: cpNodes };
}
export { findAndAdd3Prong };
//# sourceMappingURL=find-and-add-3-prong.js.map