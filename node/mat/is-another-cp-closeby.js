import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';
import { getNeighbouringPoints } from './get-neighboring-cps.js';
/** @hidden */
//const ANGLE_THRESHOLD = Math.cos(3 * (Math.PI / 180)); // 3 degrees
const ANGLE_THRESHOLD = 0.9986295347545738; // === Math.cos(3  degrees)
//const ANGLE_THRESHOLD = 0.9848077530122080; // === Math.cos(10 degrees)
//const ANGLE_THRESHOLD = 0.9998476951563913; // === Math.cos(1 degrees)
//const ANGLE_THRESHOLD = 0.9999984769132877; // === Math.cos(0.1 degrees)   
//const ANGLE_THRESHOLD = 0.9999999847691291  // === Math.cos(0.01 degrees)   
/**
 * @hidden
 * Returns true if another CpNode is close to the given implied (via pos, order
 * and order2) CpNode.
 * @param cpTrees
 * @param pos
 * @param circle
 * @param order
 * @param order2
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * @param color Used for debugging only
 */
function isAnotherCpCloseby(cpTrees, pos, circle, order, order2, extreme, color) {
    //console.log(extreme)
    //const DISTANCE_THRESHOLD = extreme * 1e-1; 
    //const DISTANCE_THRESHOLD = extreme * 1e-1;
    const DISTANCE_THRESHOLD = extreme * 1e-4;
    //const DISTANCE_THRESHOLD = extreme * 1e-4; - was this
    //const DISTANCE_THRESHOLD = extreme * 1e-6;
    //const DISTANCE_THRESHOLD = extreme * 1e-12;
    // It seems this can be zero else the ordering should be correct
    //const DISTANCE_THRESHOLD = 0;
    const cpTree = cpTrees.get(pos.curve.loop);
    const cpNodes = getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) {
        return false;
    }
    for (const cpNode of cpNodes) {
        const pos2 = cpNode.cp.pointOnShape;
        const p1 = pos.p;
        const p2 = pos2.p;
        if (distanceBetween(p1, p2) > DISTANCE_THRESHOLD) {
            continue;
        }
        const v1 = toUnitVector(fromTo(cpNode.cp.pointOnShape.p, cpNode.cp.circle.center));
        const v2 = toUnitVector(fromTo(p1, circle.center));
        const cosTheta = dot(v1, v2);
        if (cosTheta > ANGLE_THRESHOLD) {
            //console.log(`%c${cosTheta} - ${distanceBetween(p1,p2)}`, `color: ${color}`);
            return true;
        }
    }
    return false;
}
export { isAnotherCpCloseby };
//# sourceMappingURL=is-another-cp-closeby.js.map