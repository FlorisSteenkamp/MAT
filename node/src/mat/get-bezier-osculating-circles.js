"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_poly_1 = require("flo-poly");
const flo_bezier3_1 = require("flo-bezier3");
const point_on_shape_1 = require("../point-on-shape");
const calc_bezier_curvature_extrema_1 = require("./calc-bezier-curvature-extrema");
/**
 * Finds the osculating circles for the given bezier.
 * @param curve
 */
function getBezierOsculatingCircles(curve) {
    let pointsOnShape = [];
    let ps = curve.ps;
    let brackets = calc_bezier_curvature_extrema_1.calcBezierCurvatureExtremaBrackets(ps);
    let κPs = flo_bezier3_1.κ(ps);
    let lenb = brackets.length;
    for (let k = 0; k < lenb; k++) {
        let bracket = brackets[k];
        if (!bracket) {
            continue;
        }
        let root = lookForRoot(ps, bracket);
        if (!root) {
            continue;
        }
        let κ_ = -κPs(root);
        // Check if local extrema is a maximum or minimum.
        let κAtMinsd = -κPs(bracket[0]);
        let κAtMaxsd = -κPs(bracket[1]);
        if (κ_ > κAtMinsd && κ_ > κAtMaxsd) {
            // maximum
        }
        else if (κ_ <= κAtMinsd && κ_ <= κAtMaxsd) {
            // minimum
            continue;
        }
        pointsOnShape.push(new point_on_shape_1.PointOnShape(curve, root));
    }
    return pointsOnShape;
}
exports.getBezierOsculatingCircles = getBezierOsculatingCircles;
function lookForRoot(ps, [minsd, maxsd]) {
    // At this point there can be exactly 0 or 1 roots within 
    // [minsd, maxsd]
    let dκMod_ = flo_bezier3_1.dκMod(ps);
    let c0 = dκMod_(minsd);
    let c1 = dκMod_(maxsd);
    if (c0 * c1 >= 0) {
        return;
    }
    // There is exactly one root in the interval.
    let root = flo_poly_1.default.brent(dκMod_, minsd, maxsd);
    return root;
}
