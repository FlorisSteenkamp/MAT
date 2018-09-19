"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector = require("flo-vector2d");
const contact_point_1 = require("../contact-point");
const get_neighboring_cps_1 = require("./get-neighboring-cps");
/**
 * Note: For debugging only
 * Checks the position of the ContactPoint (cp) on the boundary piece.
 * Returns < 0 if the cp is not on δ, > 0 if it is on the boundary piece
 * excluding the endpoints and 0 if it is on the endpoints. Also returns > 0 if
 * δ === undefined.
 * @param δ The boundary piece
 * @param cp The contact point
 */
function cmpCpOnδ(δ, cp) {
    if (δ[0] === undefined) {
        return 1;
    }
    let cmp = contact_point_1.ContactPoint.compare(δ[0].cp, δ[1].cp);
    let cmpPrev = contact_point_1.ContactPoint.compare(δ[0].cp, cp);
    let cmpNext = contact_point_1.ContactPoint.compare(cp, δ[1].cp);
    if (cmp < 0) {
        if (cmpPrev > 0 || cmpNext > 0) {
            console.log(`2-PRONG (antipode) Order is wrong - cmpPrev and cmpNext should be > 0; cmp: ${cmp}, cmpPrev: ${cmpPrev}, cmpNext ${cmpNext}`);
            _debug_.fs.draw.dot(cp.pointOnShape.p, 1, "blue");
            return -1;
        }
    }
    else if (cmp > 0) {
        if (cmpPrev > 0 && cmpNext > 0) {
            console.log(`2-PRONG (antipode) Order is wrong: ${cmpPrev}, ${cmpNext}`);
            _debug_.fs.draw.dot(cp.pointOnShape.p, 1, "blue");
            return -1;
        }
    }
    if (cmpPrev === 0 || cmpNext === 0) {
        console.log('2-PRONG orders are equal.');
        return 0;
    }
    return 1;
}
exports.cmpCpOnδ = cmpCpOnδ;
//const DISTANCE_THRESHOLD = 0.01;
//const ANGLE_THRESHOLD = Math.cos(3 * (Math.PI / 180));
//const ANGLE_THRESHOLD = 0.9986295347545738; // === Math.cos(3  degrees)
//const ANGLE_THRESHOLD = 0.9848077530122080; // === Math.cos(10 degrees)
const ANGLE_THRESHOLD = 0.9998476951563913; // === Math.cos(1 degrees)
//const ANGLE_THRESHOLD = 0.9999984769132877; // === Math.cos(0.1 degrees)   
//const ANGLE_THRESHOLD = 0.9999999847691291 // === Math.cos(0.01 degrees)   
/**
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
function checkForCloseCp(cpTrees, pos, circle, order, order2, extreme, color) {
    const DISTANCE_THRESHOLD = extreme * 1e-4;
    let cpTree = cpTrees.get(pos.curve.loop);
    let cpNodes = get_neighboring_cps_1.getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) {
        return false;
    }
    for (let cpNode of cpNodes) {
        let pos2 = cpNode.cp.pointOnShape;
        let p1 = pos.p;
        let p2 = pos2.p;
        if (Vector.distanceBetween(p1, p2) > DISTANCE_THRESHOLD) {
            continue;
        }
        let v1 = Vector.toUnitVector(Vector.fromTo(cpNode.cp.pointOnShape.p, cpNode.cp.circle.center));
        let v2 = Vector.toUnitVector(Vector.fromTo(p1, circle.center));
        let cosTheta = Vector.dot(v1, v2);
        if (cosTheta > ANGLE_THRESHOLD) {
            //console.log(`%c${cosTheta}`, `color: ${color}`);
            return true;
        }
    }
    return false;
}
exports.checkForCloseCp = checkForCloseCp;
