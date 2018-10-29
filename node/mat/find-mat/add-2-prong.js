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
function add2Prong(cpGraphs, circle, posSource, 
    //posAntipode   : PointOnShape, 
    posAntipodes, holeClosing, extreme) {
    let orderSource = point_on_shape_1.PointOnShape.calcOrder(circle, posSource);
    let orderAntipodes = posAntipodes.map(posAntipode => point_on_shape_1.PointOnShape.calcOrder(circle, posAntipode.pos));
    let t_s = posSource.t;
    let curve;
    if (t_s === 0) {
        t_s = 1;
        curve = posSource.curve.prev;
        posSource = new point_on_shape_1.PointOnShape(curve, t_s);
    }
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    // TODO - possibly combine n-prongs in this case
    let isCloseByAntipodes = false;
    for (let i = 0; i < posAntipodes.length; i++) {
        let posAntipode = posAntipodes[i];
        let orderAntipode = orderAntipodes[i];
        if (is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, posAntipode.pos, circle, orderAntipode, 0, extreme, 'red')) {
            isCloseByAntipodes = true;
            break;
        }
    }
    if (is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, posSource, circle, orderSource, 0, extreme, 'red') ||
        isCloseByAntipodes) {
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
    let newCpAntipodes = [];
    let cpAntipodes = [];
    let cpTreeAntipodes = [];
    let deltaAntipodes = [];
    let loopAntipodes = [];
    for (let i = 0; i < posAntipodes.length; i++) {
        let posAntipode = posAntipodes[i];
        let orderAntipode = orderAntipodes[i];
        let cpAntipode = new contact_point_1.ContactPoint(posAntipode.pos, circle, orderAntipode, 0);
        cpAntipodes.push(cpAntipode);
        let loopAntipode = posAntipode.pos.curve.loop;
        loopAntipodes.push(loopAntipode);
        let cpTreeAntipode = cpGraphs.get(loopAntipode);
        cpTreeAntipodes.push(cpTreeAntipode);
        let deltaAntipode = get_neighboring_cps_1.getNeighbouringPoints(cpTreeAntipode, posAntipode.pos, orderAntipode, 0);
        deltaAntipodes.push(deltaAntipode);
        newCpAntipodes.push(cp_node_1.CpNode.insert(holeClosing, false, cpTreeAntipode, cpAntipode, deltaAntipode[0]));
    }
    //console.log(cpAntipode.pointOnShape.t);
    // Source
    let cpSource = new contact_point_1.ContactPoint(posSource, circle, orderSource, 0);
    let loopSource = posSource.curve.loop;
    let cpTreeSource = cpGraphs.get(loopSource);
    let deltaSource = get_neighboring_cps_1.getNeighbouringPoints(cpTreeSource, posSource, orderSource, 0);
    let newCpSource = cp_node_1.CpNode.insert(holeClosing, false, cpTreeSource, cpSource, deltaSource[0]);
    //console.log(cpSource.pointOnShape.t);
    // Connect graph
    if (newCpAntipodes.length === 1) {
        newCpSource.prevOnCircle = newCpAntipodes[0];
        newCpSource.nextOnCircle = newCpAntipodes[0];
        newCpAntipodes[0].prevOnCircle = newCpSource;
        newCpAntipodes[0].nextOnCircle = newCpSource;
    }
    else {
        let cpNodes = newCpAntipodes.slice();
        cpNodes.push(newCpSource);
        cpNodes.sort(cp_node_1.CpNode.comparator);
        for (let i = 0; i < cpNodes.length; i++) {
            let iNext = (i + 1 === cpNodes.length) ? 0 : i + 1;
            let iPrev = (i === 0) ? cpNodes.length - 1 : i - 1;
            let cpNodeCurr = cpNodes[i];
            let cpNodeNext = cpNodes[iNext];
            let cpNodePrev = cpNodes[iPrev];
            cpNodeCurr.nextOnCircle = cpNodeNext;
            cpNodeCurr.prevOnCircle = cpNodePrev;
        }
    }
    if (holeClosing) {
        // TODO - important - take care of case where there are more than 1 antipode
        // Duplicate ContactPoints
        let cpB2 = new contact_point_1.ContactPoint(posAntipodes[0].pos, circle, cpAntipodes[0].order, +1);
        let newCpB2Node = cp_node_1.CpNode.insert(true, false, cpTreeAntipodes[0], cpB2, newCpAntipodes[0]);
        let cpB1 = new contact_point_1.ContactPoint(posSource, circle, cpSource.order, -1);
        let newCpB1Node = cp_node_1.CpNode.insert(true, false, cpTreeSource, cpB1, newCpSource.prev);
        // Connect graph
        newCpB1Node.prevOnCircle = newCpB2Node;
        newCpB1Node.nextOnCircle = newCpB2Node;
        newCpB2Node.prevOnCircle = newCpB1Node;
        newCpB2Node.nextOnCircle = newCpB1Node;
        newCpAntipodes[0].next = newCpSource;
        newCpSource.prev = newCpAntipodes[0];
        newCpB1Node.next = newCpB2Node;
        newCpB2Node.prev = newCpB1Node;
    }
    if (typeof _debug_ !== 'undefined') {
        let elems;
        if (holeClosing) {
            elems = _debug_.generated.elems['twoProng_holeClosing'];
        }
        else {
            elems = _debug_.generated.elems['twoProng_regular'];
        }
        let elem = elems[elems.length - 1];
        if (!newCpSource) {
            console.log('asas');
        }
        elem.cpNode = newCpSource;
    }
    return newCpSource;
}
exports.add2Prong = add2Prong;
//# sourceMappingURL=add-2-prong.js.map