"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_poly_1 = require("flo-poly");
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
/**
 *
 * @param curve The bezier
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointOnBezier(ps, p, tRange = [0, 1]) {
    // TODO The site at http://jazzros.blogspot.ca/2011/03/projecting-point-on-bezier-curve.html
    // may hint at requiring much fewer assignments?
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    let [xp, yp] = p;
    let xx0 = x0 - xp;
    let xx1 = x1 - xp;
    let xx2 = x2 - xp;
    let xx3 = x3 - xp;
    let yy0 = y0 - yp;
    let yy1 = y1 - yp;
    let yy2 = y2 - yp;
    let yy3 = y3 - yp;
    let x00 = xx0 * xx0;
    let x01 = 6 * xx0 * xx1;
    let x02 = 6 * xx0 * xx2;
    let x03 = 2 * xx0 * xx3;
    let x11 = 9 * xx1 * xx1;
    let x12 = 18 * xx1 * xx2;
    let x13 = 6 * xx1 * xx3;
    let x22 = 9 * xx2 * xx2;
    let x23 = 6 * xx2 * xx3;
    let x33 = xx3 * xx3;
    let y00 = yy0 * yy0;
    let y01 = 6 * yy0 * yy1;
    let y02 = 6 * yy0 * yy2;
    let y03 = 2 * yy0 * yy3;
    let y11 = 9 * yy1 * yy1;
    let y12 = 18 * yy1 * yy2;
    let y13 = 6 * yy1 * yy3;
    let y22 = 9 * yy2 * yy2;
    let y23 = 6 * yy2 * yy3;
    let y33 = yy3 * yy3;
    let t5 = 6 * ((x33 - x23 + x13 - x03 + x22 - x12 + x02 + x11 - x01 + x00) +
        (y33 - y23 + y13 - y03 + y22 - y12 + y02 + y11 - y01 + y00));
    let t4 = 5 * ((x23 - 2 * x13 + 3 * x03 - 2 * x22 + 3 * x12 - 4 * x02 - 4 * x11 + 5 * x01 - 6 * x00) +
        (y23 - 2 * y13 + 3 * y03 - 2 * y22 + 3 * y12 - 4 * y02 - 4 * y11 + 5 * y01 - 6 * y00));
    let t3 = 4 * ((x13 - 3 * x03 + x22 - 3 * x12 + 6 * x02 + 6 * x11 - 10 * x01 + 15 * x00) +
        (y13 - 3 * y03 + y22 - 3 * y12 + 6 * y02 + 6 * y11 - 10 * y01 + 15 * y00));
    let t2 = 3 * ((x03 + x12 - 4 * x02 - 4 * x11 + 10 * x01 - 20 * x00) +
        (y03 + y12 - 4 * y02 - 4 * y11 + 10 * y01 - 20 * y00));
    let t1 = 2 * ((x02 + x11 - 5 * x01 + 15 * x00) +
        (y02 + y11 - 5 * y01 + 15 * y00));
    let t0 = ((x01 - 6 * x00) +
        (y01 - 6 * y00));
    let poly = [t5, t4, t3, t2, t1, t0];
    let roots = flo_poly_1.default.allRoots(poly, tRange[0], tRange[1]);
    // Also test the endpoints
    let push0 = true;
    let push1 = true;
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
    let ev = flo_bezier3_1.evaluate(ps);
    let ps_ = roots.map(root => ({ p: ev(root), t: root }));
    return flo_vector2d_1.getObjClosestTo(p, ps_, p => p.p);
}
exports.closestPointOnBezier = closestPointOnBezier;
//# sourceMappingURL=closest-point-on-bezier.js.map