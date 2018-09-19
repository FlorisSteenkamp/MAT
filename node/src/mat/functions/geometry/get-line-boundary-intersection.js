"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_boundary_beziers_1 = require("../get-boundary-beziers");
const get_line_bezier_intersection_1 = require("./get-line-bezier-intersection");
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
    let bezierPieces = get_boundary_beziers_1.getBoundaryPieceBeziers(δ);
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        //let ps = bezierPiece.bezierNode.item.bezier3;
        let ps = bezierPiece.bezierNode.ps;
        let iPoints = get_line_bezier_intersection_1.getLineBezierIntersection(line, ps, bezierPiece.tRange);
        for (let j = 0; j < iPoints.length; j++) {
            points.push(iPoints[j].p);
        }
    }
    return points;
}
exports.getLineBoundaryIntersectionPoints = getLineBoundaryIntersectionPoints;
