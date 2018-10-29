"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const get_neighboring_cps_1 = require("./get-neighboring-cps");
//const ANGLE_THRESHOLD = Math.cos(3 * (Math.PI / 180)); // 3 degrees
const ANGLE_THRESHOLD = 0.9986295347545738; // === Math.cos(3  degrees)
//const ANGLE_THRESHOLD = 0.9848077530122080; // === Math.cos(10 degrees)
//const ANGLE_THRESHOLD = 0.9998476951563913; // === Math.cos(1 degrees)
//const ANGLE_THRESHOLD = 0.9999984769132877; // === Math.cos(0.1 degrees)   
//const ANGLE_THRESHOLD = 0.9999999847691291  // === Math.cos(0.01 degrees)   
/**
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
    //const DISTANCE_THRESHOLD = extreme * 1e-3; 
    //const DISTANCE_THRESHOLD = extreme * 1e-1;             
    //const DISTANCE_THRESHOLD = extreme * 1e-4; - was this
    const DISTANCE_THRESHOLD = extreme * 1e-12;
    // It seems this can be zero else the ordering should be correct
    //const DISTANCE_THRESHOLD = 0;
    let cpTree = cpTrees.get(pos.curve.loop);
    let cpNodes = get_neighboring_cps_1.getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) {
        return false;
    }
    for (let cpNode of cpNodes) {
        let pos2 = cpNode.cp.pointOnShape;
        let p1 = pos.p;
        let p2 = pos2.p;
        if (flo_vector2d_1.distanceBetween(p1, p2) > DISTANCE_THRESHOLD) {
            continue;
        }
        let v1 = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(cpNode.cp.pointOnShape.p, cpNode.cp.circle.center));
        let v2 = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(p1, circle.center));
        let cosTheta = flo_vector2d_1.dot(v1, v2);
        if (cosTheta > ANGLE_THRESHOLD) {
            //console.log(`%c${cosTheta} - ${distanceBetween(p1,p2)}`, `color: ${color}`);
            return true;
        }
    }
    return false;
}
exports.isAnotherCpCloseby = isAnotherCpCloseby;
//# sourceMappingURL=is-another-cp-closeby.js.map