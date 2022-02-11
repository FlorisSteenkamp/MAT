import { exponent } from 'big-float-ts';
import { CpNode } from '../../cp-node.js';
import { PointOnShape, calcPosOrder } from '../../point-on-shape.js';
import { isAnotherCpCloseby } from '../is-another-cp-closeby.js';
import { getNeighbouringPoints } from '../get-neighboring-cps.js';
/**
 * @hidden
 * Adds a 2-prong contact circle to the shape.
 * @param cpGraphs
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param holeClosing True if this is a hole-closing 2-prong, false otherwise
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function add2Prong(cpGraphs, circle, posSource, posAntipodes, holeClosing, extreme) {
    //let orderSource   = PointOnShape.calcOrder(circle, posSource);
    let orderSource = calcPosOrder(circle, posSource);
    let orderAntipodes = posAntipodes.map(posAntipode => {
        //console.log(circle.center)
        //return PointOnShape.calcOrder(circle, posAntipode.pos);
        return calcPosOrder(circle, posAntipode.pos);
    });
    let t_s = posSource.t;
    let curve;
    if (t_s === 0) {
        t_s = 1;
        curve = posSource.curve.prev;
        posSource = new PointOnShape(curve, t_s);
    }
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    // TODO - possibly combine n-prongs in this case
    let isCloseByAntipodes = false;
    for (let i = 0; i < posAntipodes.length; i++) {
        let posAntipode = posAntipodes[i];
        let orderAntipode = orderAntipodes[i];
        if (isAnotherCpCloseby(cpGraphs, posAntipode.pos, circle, orderAntipode, 0, extreme, 'red')) {
            isCloseByAntipodes = true;
            break;
        }
    }
    if (isAnotherCpCloseby(cpGraphs, posSource, circle, orderSource, 0, extreme, 'red') ||
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
        let cpAntipode = { pointOnShape: posAntipode.pos, circle, order: orderAntipode, order2: 0 };
        cpAntipodes.push(cpAntipode);
        let loopAntipode = posAntipode.pos.curve.loop;
        loopAntipodes.push(loopAntipode);
        let cpTreeAntipode = cpGraphs.get(loopAntipode);
        cpTreeAntipodes.push(cpTreeAntipode);
        let deltaAntipode = getNeighbouringPoints(cpTreeAntipode, posAntipode.pos, orderAntipode, 0);
        deltaAntipodes.push(deltaAntipode);
        newCpAntipodes.push(CpNode.insert(holeClosing, false, cpTreeAntipode, cpAntipode, deltaAntipode[0]));
    }
    // Source
    let cpSource = { pointOnShape: posSource, circle, order: orderSource, order2: 0 };
    let loopSource = posSource.curve.loop;
    let cpTreeSource = cpGraphs.get(loopSource);
    let deltaSource = getNeighbouringPoints(cpTreeSource, posSource, orderSource, 0);
    let newCpSource = CpNode.insert(holeClosing, false, cpTreeSource, cpSource, deltaSource[0]);
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
        let cpB2 = { pointOnShape: posAntipodes[0].pos, circle, order: cpAntipodes[0].order, order2: +1 };
        let newCpB2Node = CpNode.insert(true, false, cpTreeAntipodes[0], cpB2, newCpAntipodes[0]);
        let cpB1 = { pointOnShape: posSource, circle, order: cpSource.order, order2: -1 };
        let newCpB1Node = CpNode.insert(true, false, cpTreeSource, cpB1, newCpSource.prev);
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
/** @hidden */
function scale(n, exp) {
    return n * (2 ** -(exp + 1));
}
/** @hidden */
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
/** @hidden */
function byAngle(circle) {
    let c = circle.center;
    let r = circle.radius;
    let exp = exponent(r);
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
export { add2Prong };
//# sourceMappingURL=add-2-prong.js.map