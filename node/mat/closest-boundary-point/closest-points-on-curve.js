"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_poly_1 = require("flo-poly");
const flo_bezier3_1 = require("flo-bezier3");
/**
 * @hidden
 * @param curve The curve
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointsOnCurve(curve, p, tRange = [0, 1], touchedCurve, t) {
    let poly = flo_bezier3_1.getTangentPolyFromPoint(curve.ps, p);
    if (curve === touchedCurve) {
        poly = flo_poly_1.deflate(poly, t);
    }
    let roots = flo_poly_1.allRoots(poly, tRange[0], tRange[1]);
    // Also test the endpoints
    let push0 = true;
    let push1 = true;
    if ((t === 1 && curve === touchedCurve.next) ||
        (curve === touchedCurve && t === 0)) {
        push0 = false;
    }
    if ((t === 0 && curve === touchedCurve.prev) ||
        (curve === touchedCurve && t === 1)) {
        push1 = false;
    }
    if (tRange[0] === 0) {
        if (push0) {
            roots.push(tRange[0]);
        }
    }
    else if (tRange[0] === 1) {
        if (push1) {
            roots.push(tRange[0]);
        }
    }
    else {
        roots.push(tRange[0]);
    }
    if (tRange[1] === 0) {
        if (push0) {
            roots.push(tRange[1]);
        }
    }
    else if (tRange[1] === 1) {
        if (push1) {
            roots.push(tRange[1]);
        }
    }
    else {
        roots.push(tRange[1]);
    }
    // This is to take care of a numerical issue.
    // TODO - remove delta of 1e-10 below and use adaptive infinite precision
    // floating point arithmetic.
    let roots_ = [];
    for (let i = 0; i < roots.length; i++) {
        let root = roots[i];
        if (root !== 0 && root < 1e-10) {
            root = 0;
        }
        else if (root !== 1 && 1 - root < 1e-10) {
            root = 1;
        }
        roots_.push(root);
    }
    let ev = flo_bezier3_1.evaluate(curve.ps);
    let ps = roots.map(root => ({ p: ev(root), t: root }));
    return ps;
}
exports.closestPointsOnCurve = closestPointsOnCurve;
//# sourceMappingURL=closest-points-on-curve.js.map