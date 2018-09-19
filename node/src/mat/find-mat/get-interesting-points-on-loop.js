"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_contact_circles_at_interface_1 = require("../get-contact-circles-at-interface");
const get_bezier_curvature_extrema_1 = require("../get-bezier-curvature-extrema");
const point_on_shape_1 = require("../../point-on-shape");
// Keep EXTRA_POINTS of the form (2^n)-1. This will allow e.g. bezier 
// polynomials of the form at^3 + bt^2 + ... to be evaluated with much more
// accuracy since the ts in the polynomial will be of the form c*2^(-n) where c
// is an integer and in the closed interval [1..2^n] and thus use only a few
// bits of mantissa in its floating point representation.
//const EXTRA_POINTS = 0;
//const EXTRA_POINTS = 1;
//const EXTRA_POINTS = 3;
const EXTRA_POINTS = 7;
//const EXTRA_POINTS = 15;
//const EXTRA_POINTS = 31;
/**
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 */
function getInterestingPointsOnLoop(loop) {
    let allPoints = [];
    for (let i = 0; i < loop.curves.length; i++) {
        let curve = loop.curves[i];
        let { maxCurvaturePoss, maxNegativeCurvaturePoss } = get_bezier_curvature_extrema_1.getBezierCurvatureExtrema(curve);
        allPoints.push(...get_contact_circles_at_interface_1.getContactCirclesAtInterface(curve), ...maxCurvaturePoss, ...maxNegativeCurvaturePoss);
        for (let i = 1; i < EXTRA_POINTS + 1; i++) {
            allPoints.push(new point_on_shape_1.PointOnShape(curve, i / (EXTRA_POINTS + 1)));
        }
    }
    allPoints.sort(point_on_shape_1.PointOnShape.compare);
    return allPoints;
}
exports.getInterestingPointsOnLoop = getInterestingPointsOnLoop;
