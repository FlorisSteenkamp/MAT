"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_contact_circles_at_interface_1 = require("../get-contact-circles-at-interface");
const flo_bezier3_1 = require("flo-bezier3");
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
            let { maxCurvatureTs, maxNegativeCurvatureTs } = flo_bezier3_1.getCurvatureExtrema(curve.ps);
            let maxCurvatures = maxCurvatureTs.map(t => new point_on_shape_1.PointOnShape(curve, t));
            let maxNegativeCurvatures = maxNegativeCurvatureTs.map(t => new point_on_shape_1.PointOnShape(curve, t));
            allPoints.push(...get_contact_circles_at_interface_1.getContactCirclesAtInterface(curve), ...maxCurvatures, ...maxNegativeCurvatures);
            //let ts = splitByMaxCurveLength(curve.ps, 50);
            //let ts = splitByMaxCurvature(curve.ps, 1.01);
            let ts = flo_bezier3_1.splitByCurvatureAndLength(curve.ps, 1.001, 10);
            if (ts.length === 2) {
                ts = [0, 0.5, 1];
            }
            for (let i = 1; i < ts.length - 1; i++) {
                allPoints.push(new point_on_shape_1.PointOnShape(curve, ts[i]));
            }
        }
        allPoints.sort(point_on_shape_1.PointOnShape.compare);
        return allPoints;
    };
}
exports.createGetInterestingPointsOnLoop = createGetInterestingPointsOnLoop;
//# sourceMappingURL=create-get-interesting-points-on-loop.js.map