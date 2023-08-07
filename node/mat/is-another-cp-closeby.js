import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';
import { getNeighbouringPoints } from './get-neighboring-cps.js';
/** @internal */
const DEGREES = 3;
const ANGLE_THRESHOLD = Math.cos(DEGREES * (Math.PI / 180));
/**
 * @internal
 * If another `CpNode` is close by (to the given implied (via `pos`, `order` and
 * `order2`) then return it, else return `undefined`.
 *
 * @param cpTrees
 * @param pos
 * @param circle
 * @param order
 * @param order2
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * @param color Used for debugging only
 */
function isAnotherCpCloseby(cpTrees, pos, circle, order, order2, extreme) {
    const DISTANCE_THRESHOLD = extreme * 2e-14;
    const DISTANCE_THRESHOLD_2 = DISTANCE_THRESHOLD * 2e-2;
    const cpTree = cpTrees.get(pos.curve.loop);
    const cpNodes = getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) {
        return undefined;
    }
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
            // console.log(d, DISTANCE_THRESHOLD2)
            return cpNode;
        }
    }
    return undefined;
}
export { isAnotherCpCloseby };
//# sourceMappingURL=is-another-cp-closeby.js.map