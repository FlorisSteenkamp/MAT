"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_contact_circles_at_interface_1 = require("../get-contact-circles-at-interface");
const get_bezier_curvature_extrema_1 = require("../get-bezier-curvature-extrema");
const point_on_shape_1 = require("../../point-on-shape");
/**
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
function createGetInterestingPointsOnLoop(additionalPointCount = 3) {
    return function (loop) {
        let allPoints = [];
        for (let i = 0; i < loop.curves.length; i++) {
            let curve = loop.curves[i];
            let { maxCurvaturePoss, maxNegativeCurvaturePoss } = get_bezier_curvature_extrema_1.getBezierCurvatureExtrema(curve);
            allPoints.push(...get_contact_circles_at_interface_1.getContactCirclesAtInterface(curve), ...maxCurvaturePoss, ...maxNegativeCurvaturePoss);
            let n = additionalPointCount + 1;
            for (let i = 1; i < n; i++) {
                allPoints.push(new point_on_shape_1.PointOnShape(curve, i / n));
            }
        }
        allPoints.sort(point_on_shape_1.PointOnShape.compare);
        return allPoints;
    };
}
exports.createGetInterestingPointsOnLoop = createGetInterestingPointsOnLoop;
