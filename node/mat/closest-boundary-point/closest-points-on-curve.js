"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closestPointsOnCurve = void 0;
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
function closestPointsOnCurve(curve, p, [tS, tE] = [0, 1], touchedCurve, t) {
    let poly = flo_bezier3_1.getTangentPolyFromPointExact(curve.ps, p);
    if (curve === touchedCurve) {
        poly = flo_poly_1.deflateQuad(poly, t);
    }
    let roots = flo_poly_1.allRootsMultiWithErrBounds(poly, poly.map(c => 0), // because all coefficients are exact
    undefined, // ...
    tS, tE);
    // Also test the endpoints
    let push0 = true;
    let push1 = true;
    if ((t === 1 && curve === touchedCurve.next) ||
        (t === 0 && curve === touchedCurve)) {
        push0 = false;
    }
    if ((t === 0 && curve === touchedCurve.prev) ||
        (t === 1 && curve === touchedCurve)) {
        push1 = false;
    }
    if (tS === 0) {
        if (push0) {
            roots.push({ tS: 0, tE: 0 });
        }
    }
    else if (tS === 1) {
        if (push1) {
            roots.push({ tS: 1, tE: 1 });
        }
    }
    else {
        roots.push({ tS: tS, tE: tS });
    }
    if (tE === 0) {
        if (push0) {
            roots.push({ tS: 0, tE: 0 });
        }
    }
    else if (tE === 1) {
        if (push1) {
            roots.push({ tS: 1, tE: 1 });
        }
    }
    else {
        roots.push({ tS: tE, tE: tE });
    }
    let ps = roots.map(root => {
        let tS = root.tS;
        let tE = root.tE;
        // TODO - tS, tE should always stay within [0,1] - modify findRootsMulti
        let t = tS < 0
            ? 0
            : tE > 1 ? 1 : (tS + tE) / 2;
        // TODO - why does evalDeCasteljau not work here?
        return { p: flo_bezier3_1.evaluate(curve.ps, t), t };
        //return { p: evalDeCasteljau(curve.ps,t), t }
    });
    return ps;
}
exports.closestPointsOnCurve = closestPointsOnCurve;
//# sourceMappingURL=closest-points-on-curve.js.map