"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const flo_bezier3_1 = require("flo-bezier3");
const flo_poly_1 = require("flo-poly");
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
const calc_bezier_curvature_extrema_1 = require("./calc-bezier-curvature-extrema");
/**
 * Finds the osculating circles for the given bezier.
 */
function getBezierOsculatingCircles(bezierNode) {
    let pointsOnShape = [];
    let root;
    let ps = bezierNode.item.bezier3;
    let brackets = calc_bezier_curvature_extrema_1.default(ps);
    let κPs = flo_bezier3_1.default.κ(ps);
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
        let pos = new point_on_shape_1.default(bezierNode, root, mat_constants_1.default.pointType.standard, 0, 0);
        pointsOnShape.push(pos);
    }
    pointsOnShape.sort(point_on_shape_1.default.compare);
    return pointsOnShape;
}
function lookForRoot(ps, [minsd, maxsd]) {
    // At this point there can be exactly 0 or 1 roots within 
    // [minsd, maxsd]
    let c0 = flo_bezier3_1.default.dκMod(ps)(minsd);
    let c1 = flo_bezier3_1.default.dκMod(ps)(maxsd);
    if (c0 * c1 >= 0) {
        return;
    }
    // There is exactly one root in the interval.
    let root = flo_poly_1.default.brent(flo_bezier3_1.default.dκMod(ps), minsd, maxsd);
    return root;
}
exports.default = getBezierOsculatingCircles;
