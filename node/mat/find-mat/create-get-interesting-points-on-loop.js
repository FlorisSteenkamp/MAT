"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestingPointsOnLoop = void 0;
const get_contact_circles_at_interface_1 = require("../get-contact-circles-at-interface");
const flo_bezier3_1 = require("flo-bezier3");
const point_on_shape_1 = require("../../point-on-shape");
/**
 * @hidden
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
function getInterestingPointsOnLoop(minBezLength, maxFlatness, maxLength) {
    return function (loop) {
        let allPoints = [];
        for (let i = 0; i < loop.curves.length; i++) {
            let curve = loop.curves[i];
            if (flo_bezier3_1.lengthSquaredUpperBound(curve.ps) < minBezLength) {
                continue;
            }
            let { maxCurvatureTs, maxNegativeCurvatureTs } = flo_bezier3_1.getCurvatureExtrema(curve.ps);
            let maxCurvatures = maxCurvatureTs.map(t => new point_on_shape_1.PointOnShape(curve, t));
            let maxNegativeCurvatures = maxNegativeCurvatureTs.map(t => new point_on_shape_1.PointOnShape(curve, t));
            allPoints.push(...get_contact_circles_at_interface_1.getContactCirclesAtInterface(curve), ...maxCurvatures, ...maxNegativeCurvatures);
            let ts = flo_bezier3_1.splitByCurvatureAndLength(curve.ps, maxFlatness, maxLength);
            if (ts.length === 2) {
                ts = [0, 0.5, 1];
            }
            for (let i = 1; i < ts.length - 1; i++) {
                allPoints.push(new point_on_shape_1.PointOnShape(curve, ts[i]));
            }
        }
        allPoints.sort(point_on_shape_1.comparePoss);
        return allPoints;
    };
}
exports.getInterestingPointsOnLoop = getInterestingPointsOnLoop;
//# sourceMappingURL=create-get-interesting-points-on-loop.js.map