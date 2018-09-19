"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("../../classes/shape/shape");
const get_line_bezier_intersection_points_1 = require("./get-line-bezier-intersection-points");
/**
 * Get line shape intersection points.
 *
 * @param line A line described by two points
 * @param δ A boundary piece described by start and end contact points
 *
 * Currently not used
 */
function getLineBoundaryIntersectionPoints(line, δ) {
    let points = [];
    let bezierPieces = shape_1.Shape.getBoundaryPieceBeziers(δ);
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        //let ps = bezierPiece.bezierNode.item.bezier3;
        let ps = bezierPiece.bezierNode.item;
        let iPoints = get_line_bezier_intersection_points_1.getLineBezierIntersectionPoints(line, ps);
        for (let j = 0; j < iPoints.length; j++) {
            points.push(iPoints[j].p);
        }
    }
    return points;
}
exports.getLineBoundaryIntersectionPoints = getLineBoundaryIntersectionPoints;
