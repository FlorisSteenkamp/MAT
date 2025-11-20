import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';
import { getCpNodeToLeftOrSame } from './get-cp-node-to-left-or-same.js';
/** @internal */
const DEGREES = 1;
const ANGLE_THRESHOLD = Math.cos(DEGREES * (Math.PI / 180));
/**
 * @internal
 * If another `CpNode` is close by (to the given implied (via `pos`, `order` and
 * `order2`) then return it, else return `undefined`.
 *
 * @param meta
 * @param pos
 * @param circle
 * @param order
 * @param order2
 */
function getCloseByCpIfExist(meta, pos, circle, order, order2, forProngCount) {
    const { cpTrees, maxCoordinate } = meta;
    const DISTANCE_THRESHOLD = maxCoordinate * 2e-14;
    const DISTANCE_THRESHOLD_2 = DISTANCE_THRESHOLD * 2e-2;
    const cpTree = cpTrees.get(pos.curve.loop);
    const cur = getCpNodeToLeftOrSame(cpTree, pos, order, order2);
    if (!cur) {
        return undefined;
    }
    const cpNodes = [cur, cur.next];
    const { p, t } = pos;
    for (const cpNode of cpNodes) {
        const pos2 = cpNode.cp.pointOnShape;
        const p2 = pos2.p;
        const d = distanceBetween(p, p2);
        if (d > DISTANCE_THRESHOLD) {
            continue;
        }
        const v1 = toUnitVector(fromTo(p2, cpNode.cp.circle.center));
        const v2 = toUnitVector(fromTo(p, circle.center));
        const cosTheta = dot(v1, v2);
        if (cosTheta > ANGLE_THRESHOLD ||
            (d < DISTANCE_THRESHOLD_2 && t !== 0 && t !== 1)) {
            if (forProngCount === 3) {
                // console.log(cosTheta, d);
                // console.log(t);
                // console.log(d, DISTANCE_THRESHOLD_2)
                // console.log(p,p2);
            }
            return cpNode;
        }
    }
    return undefined;
}
export { getCloseByCpIfExist };
//# sourceMappingURL=get-closeby-cp-if-exist.js.map