"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector = require("flo-vector2d");
const cp_graph_1 = require("../../linked-list/cp-graph");
const contact_point_1 = require("../classes/contact-point");
//import { getNeighbouringPoints } from '../functions/find-mat/get-neighboring-points';
/**
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
const DISTANCE_THRESHOLD = 0.01;
//const ANGLE_THRESHOLD = Math.cos(3 * (Math.PI / 180));
//const ANGLE_THRESHOLD = 0.9986295347545738; // === Math.cos(3  degrees)
//const ANGLE_THRESHOLD = 0.9848077530122080; // === Math.cos(10 degrees)
//const ANGLE_THRESHOLD = 0.9998476951563913; // === Math.cos(1 degrees)
const ANGLE_THRESHOLD = 0.9999984769132877; // === Math.cos(0.1 degrees)   
//const ANGLE_THRESHOLD = 0.9999999847691291 // === Math.cos(0.01 degrees)   
/**
*
* @param shape The shape
* @param pos1
* @param circle1
*/
function checkForCloseCp(cpGraphs, pos1, circle1, order, order2, color) {
    let cpGraph = cpGraphs.get(pos1.bezierNode.loop);
    //let cps = getNeighbouringPoints(cpGraph, pos1, order, order2);
    let cps = cp_graph_1.CpGraph.getNeighbouringPoints(cpGraph, pos1, order, order2);
    if (!cps[0]) {
        return false;
    }
    for (let cp of cps) {
        let pos2 = cp.cp.pointOnShape;
        let p1 = pos1.p;
        let p2 = pos2.p;
        if (Vector.distanceBetween(p1, p2) > DISTANCE_THRESHOLD) {
            continue;
        }
        let v1 = Vector.toUnitVector(Vector.fromTo(cp.cp.pointOnShape.p, cp.cp.circle.center));
        let v2 = Vector.toUnitVector(Vector.fromTo(p1, circle1.center));
        let cosTheta = Vector.dot(v1, v2);
        if (cosTheta > ANGLE_THRESHOLD) {
            //console.log(`%c${cosTheta}`, `color: ${color}`);
            return true;
        }
    }
    return false;
}
exports.checkForCloseCp = checkForCloseCp;
