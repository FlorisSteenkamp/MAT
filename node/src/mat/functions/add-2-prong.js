"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("../classes/contact-point");
const vertex_1 = require("../classes/vertex/vertex");
const point_on_shape_1 = require("../classes/point-on-shape");
const cp_hash_functions_1 = require("../functions/cp-hash-functions");
const get_neighboring_points_1 = require("../classes/shape/get-neighboring-points");
/**
 * Adds a 2-prong contact circle to the shape.
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param posSource - The source point on shape
 * @param posAntipode - The found antipodal point on shape
 * @param delta The boundary piece within which the new contact point should be
 * placed
 */
function add2Prong(cpGraphs, circle, posSource, posAntipode, holeClosing, kSource, kAntipode) {
    //------------------------------------
    //------------ ANTIPODE --------------
    //------------------------------------
    let orderSource = point_on_shape_1.PointOnShape.calcOrder(circle, posSource);
    let orderAntipode = point_on_shape_1.PointOnShape.calcOrder(circle, posAntipode);
    let cpAntipode = new contact_point_1.ContactPoint(posAntipode, undefined, orderAntipode, 0);
    let deltaAntipode = get_neighboring_points_1.getNeighbouringPoints(cpGraphs[posAntipode.bezierNode.loop.indx], posAntipode, orderAntipode, 0);
    if (cp_hash_functions_1.checkForCloseCp(cpGraphs, posAntipode, circle, orderAntipode, 0, 'red')) {
        if (typeof _debug_ !== 'undefined') {
            draw2Prong();
        }
        return;
    }
    //------------------------------------
    //------------- SOURCE ---------------
    //------------------------------------
    let cpSource = new contact_point_1.ContactPoint(posSource, undefined, orderSource, 0);
    if (cp_hash_functions_1.checkForCloseCp(cpGraphs, posSource, circle, orderSource, 0, 'red')) {
        if (typeof _debug_ !== 'undefined') {
            draw2Prong();
        }
        return;
    }
    let newCpAntipode = cpGraphs[kAntipode].insert(cpAntipode, deltaAntipode[0]);
    let deltaSource = get_neighboring_points_1.getNeighbouringPoints(cpGraphs[posSource.bezierNode.loop.indx], posSource, orderSource, 0);
    let newCpSource = cpGraphs[kSource].insert(cpSource, deltaSource[0]);
    let vertex = vertex_1.Vertex.create(circle, [newCpSource, newCpAntipode]);
    newCpSource.prevOnCircle = newCpAntipode;
    newCpSource.nextOnCircle = newCpAntipode;
    newCpAntipode.prevOnCircle = newCpSource;
    newCpAntipode.nextOnCircle = newCpSource;
    if (holeClosing) {
        let posA1 = posAntipode;
        let posB2 = posA1;
        let cpB2 = new contact_point_1.ContactPoint(posB2, undefined, cpAntipode.order, 1);
        let newCpB2Node = cpGraphs[kAntipode].insert(cpB2, newCpAntipode);
        let posA2 = posSource;
        let posB1 = posA2;
        let cpB1 = new contact_point_1.ContactPoint(posB1, undefined, cpSource.order, -1);
        let newCpB1Node = cpGraphs[kSource].insert(cpB1, newCpSource.prev);
        vertex_1.Vertex.create(circle, [newCpB1Node, newCpB2Node]);
        newCpB1Node.prevOnCircle = newCpB2Node;
        newCpB1Node.nextOnCircle = newCpB2Node;
        newCpB2Node.prevOnCircle = newCpB1Node;
        newCpB2Node.nextOnCircle = newCpB1Node;
        newCpAntipode.next = newCpSource;
        newCpSource.prev = newCpAntipode;
        newCpB1Node.next = newCpB2Node;
        newCpB2Node.prev = newCpB1Node;
    }
    if (typeof _debug_ !== 'undefined') {
        let twoProngs = _debug_.generated.elems.twoProngs;
        let len = twoProngs.length;
        let twoProng = twoProngs[len - 1];
        twoProng.data.vertex = vertex;
        twoProng.data.notAdded = false;
        draw2Prong();
    }
    return;
}
exports.add2Prong = add2Prong;
function draw2Prong() {
    let twoProngs = _debug_.generated.elems.twoProngs;
    let twoProng = twoProngs[twoProngs.length - 1];
    twoProng.$svg = _debug_.fs.drawElem.draw2Prong(twoProng.data, _debug_.config.toDraw.twoProngs[_debug_.fs.elemType.twoProngs(twoProng.data)]);
}
