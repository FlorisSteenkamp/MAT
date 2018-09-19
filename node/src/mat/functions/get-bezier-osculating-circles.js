"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const Bezier3 = require("flo-bezier3");
const flo_poly_1 = require("flo-poly");
const point_on_shape_1 = require("../classes/point-on-shape");
const calc_bezier_curvature_extrema_1 = require("../functions/calc-bezier-curvature-extrema");
/**
 * Finds the osculating circles for the given bezier.
 */
function getBezierOsculatingCircles(bezierNode) {
    let pointsOnShape = [];
    let ps = bezierNode.ps;
    let brackets = calc_bezier_curvature_extrema_1.calcBezierCurvatureExtremaBrackets(ps);
    let κPs = Bezier3.κ(ps);
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
        let κ = -κPs(root);
        // Check if local extrema is a maximum or minimum.
        let κAtMinsd = -κPs(bracket[0]);
        let κAtMaxsd = -κPs(bracket[1]);
        if (κ > κAtMinsd && κ > κAtMaxsd) {
            // maximum
        }
        else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
            // minimum
            continue;
        }
        let pos = new point_on_shape_1.PointOnShape(bezierNode, root, mat_constants_1.MAT_CONSTANTS.pointType.standard);
        pointsOnShape.push(pos);
    }
    return pointsOnShape;
}
exports.getBezierOsculatingCircles = getBezierOsculatingCircles;
function lookForRoot(ps, [minsd, maxsd]) {
    // At this point there can be exactly 0 or 1 roots within 
    // [minsd, maxsd]
    let dκMod = Bezier3.dκMod(ps);
    let c0 = dκMod(minsd);
    let c1 = dκMod(maxsd);
    if (c0 * c1 >= 0) {
        return;
    }
    // There is exactly one root in the interval.
    let root = flo_poly_1.default.brent(dκMod, minsd, maxsd);
    return root;
}
