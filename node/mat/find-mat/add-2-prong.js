"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_numerical_1 = require("flo-numerical");
const cp_node_1 = require("../../cp-node/cp-node");
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
    //console.log(circle.center[0], circle.center[1])
    /*
    if (posAntipodes.length > 1) {
        console.log('>1')
    }
    */
    /*
    if (circle.center[0] === 241 && circle.center[1] === -342.0764118857498) {
        return;
    }
    */
    let orderSource = point_on_shape_1.PointOnShape.calcOrder(circle, posSource);
    let orderAntipodes = posAntipodes.map(posAntipode => {
        //console.log(circle.center)
        return point_on_shape_1.PointOnShape.calcOrder(circle, posAntipode.pos);
    });
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
        // This sometimes didn't work as it compares only according to it's own
        // loop.
        //cpNodes.sort(CpNode.comparator);
        // Order points according to their angle with the x-axis
        cpNodes.sort(byAngle(circle));
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
function scale(n, exp) {
    return n * (Math.pow(2, -(exp + 1)));
}
function getSize(x, y) {
    // Get size of a
    if (x > 0) {
        if (x > 0.5) {
            return y; // ~ -0.7 -> 0.7, i.e. -(sqrt(2)/2) -> +(sqrt(2)/2) 
        }
        else {
            if (y < 0) {
                return x - 2; // ~ -2.0 -> -1.3
            }
            else {
                return -x + 2; // ~ 1.3 -> 2.0
            }
        }
    }
    else {
        if (x < -0.5) {
            return -y + 4; // ~ 3.3 -> 4.7
        }
        else {
            if (y < 0) {
                return x + 6; // ~ 5.3 -> 6.0
            }
            else {
                return -x + 2; // ~ 2 -> 2.7
            }
        }
    }
}
function byAngle(circle) {
    let c = circle.center;
    let r = circle.radius;
    let exp = flo_numerical_1.exponent(r);
    return function (_a, _b) {
        let a = _a.cp.pointOnShape.p;
        let b = _b.cp.pointOnShape.p;
        // Move onto origin
        a = [a[0] - c[0], a[1] - c[1]];
        b = [b[0] - c[0], b[1] - c[1]];
        // Scale
        let ax = scale(a[0], exp);
        let ay = scale(a[1], exp);
        let bx = scale(b[0], exp);
        let by = scale(b[1], exp);
        // Get 'size'
        let sa = getSize(ax, ay);
        let sb = getSize(bx, by);
        return sb - sa;
    };
}
//# sourceMappingURL=add-2-prong.js.map