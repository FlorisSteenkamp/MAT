"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_boundary_piece_beziers_1 = require("../get-boundary-piece-beziers");
const get_line_bezier_intersection_1 = require("./get-line-bezier-intersection");
/**
 * Get intersection between line and boundary piece.
 * @param line A line described by two points
 * @param cpNodes A boundary piece described by start and end contact points
  */
function getLineBoundaryIntersectionPoints(line, cpNodes) {
    let points = [];
    let bezierPieces = get_boundary_piece_beziers_1.getBoundaryPieceBeziers(cpNodes);
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        let iPoints = get_line_bezier_intersection_1.getLineBezierIntersection(line, ps, bezierPiece.ts);
        for (let j = 0; j < iPoints.length; j++) {
            points.push(iPoints[j].p);
        }
    }
    return points;
}
exports.getLineBoundaryIntersectionPoints = getLineBoundaryIntersectionPoints;
//# sourceMappingURL=get-line-boundary-intersection.js.map