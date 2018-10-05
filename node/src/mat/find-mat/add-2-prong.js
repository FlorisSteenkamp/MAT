"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp_node_1 = require("../../cp-node");
const contact_point_1 = require("../../contact-point");
const point_on_shape_1 = require("../../point-on-shape");
const is_another_cp_closeby_1 = require("../is-another-cp-closeby");
const get_neighboring_cps_1 = require("../get-neighboring-cps");
/**
 * Adds a 2-prong contact circle to the shape.
 * @param cpGraphs
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param holeClosing True if this is a hole-closing 2-prong, false otherwise
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function add2Prong(cpGraphs, circle, posSource, posAntipode, holeClosing, extreme) {
    let orderSource = point_on_shape_1.PointOnShape.calcOrder(circle, posSource);
    let orderAntipode = point_on_shape_1.PointOnShape.calcOrder(circle, posAntipode);
    let t_s = posSource.t;
    let curve;
    if (t_s === 0) {
        t_s = 1;
        curve = posSource.curve.prev;
        posSource = new point_on_shape_1.PointOnShape(curve, t_s);
    }
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    if (is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, posSource, circle, orderSource, 0, extreme, 'red') ||
        is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, posAntipode, circle, orderAntipode, 0, extreme, 'red')) {
        if (typeof _debug_ !== 'undefined') {
            if (holeClosing) {
                _debug_.generated.elems['twoProng_holeClosing'].pop();
            }
            else {
                _debug_.generated.elems['twoProng_regular'].pop();
            }
        }
        return;
    }
    // Antipode
    let cpAntipode = new contact_point_1.ContactPoint(posAntipode, circle, orderAntipode, 0);
    let loopAntipode = posAntipode.curve.loop;
    let cpTreeAntipode = cpGraphs.get(loopAntipode);
    let deltaAntipode = get_neighboring_cps_1.getNeighbouringPoints(cpTreeAntipode, posAntipode, orderAntipode, 0);
    let newCpAntipode = cp_node_1.CpNode.insert(holeClosing, false, cpTreeAntipode, cpAntipode, deltaAntipode[0]);
    //console.log(cpAntipode.pointOnShape.t);
    // Source
    let cpSource = new contact_point_1.ContactPoint(posSource, circle, orderSource, 0);
    let loopSource = posSource.curve.loop;
    let cpTreeSource = cpGraphs.get(loopSource);
    let deltaSource = get_neighboring_cps_1.getNeighbouringPoints(cpTreeSource, posSource, orderSource, 0);
    let newCpSource = cp_node_1.CpNode.insert(holeClosing, false, cpTreeSource, cpSource, deltaSource[0]);
    //console.log(cpSource.pointOnShape.t);
    // Connect graph
    newCpSource.prevOnCircle = newCpAntipode;
    newCpSource.nextOnCircle = newCpAntipode;
    newCpAntipode.prevOnCircle = newCpSource;
    newCpAntipode.nextOnCircle = newCpSource;
    if (holeClosing) {
        // Duplicate ContactPoints
        let cpB2 = new contact_point_1.ContactPoint(posAntipode, circle, cpAntipode.order, +1);
        let newCpB2Node = cp_node_1.CpNode.insert(true, false, cpTreeAntipode, cpB2, newCpAntipode);
        let cpB1 = new contact_point_1.ContactPoint(posSource, circle, cpSource.order, -1);
        let newCpB1Node = cp_node_1.CpNode.insert(true, false, cpTreeSource, cpB1, newCpSource.prev);
        // Connect graph
        newCpB1Node.prevOnCircle = newCpB2Node;
        newCpB1Node.nextOnCircle = newCpB2Node;
        newCpB2Node.prevOnCircle = newCpB1Node;
        newCpB2Node.nextOnCircle = newCpB1Node;
        newCpAntipode.next = newCpSource;
        newCpSource.prev = newCpAntipode;
        newCpB1Node.next = newCpB2Node;
        newCpB2Node.prev = newCpB1Node;
    }
    return newCpSource;
}
exports.add2Prong = add2Prong;
