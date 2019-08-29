"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const point_on_shape_1 = require("../../point-on-shape");
const cull_bezier_pieces_1 = require("./cull-bezier-pieces");
const closest_point_on_curve_1 = require("./closest-point-on-curve");
/**
 * @hidden
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
function getClosestBoundaryPoint(bezierPieces, point, touchedCurve, t) {
    bezierPieces = cull_bezier_pieces_1.cullBezierPieces(bezierPieces, point);
    let bestDistance = Number.POSITIVE_INFINITY;
    let posInfo;
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let p = closest_point_on_curve_1.closestPointOnCurve(bezierPiece.curve, point, bezierPiece.ts, touchedCurve, t);
        if (p === undefined) {
            continue;
        }
        let d = flo_vector2d_1.distanceBetween(p.p, point);
        let curve = bezierPiece.curve;
        let t_ = p.t;
        if (d < bestDistance) {
            if (t_ === 0) {
                t_ = 1;
                curve = bezierPiece.curve.prev;
            }
            posInfo = { pos: new point_on_shape_1.PointOnShape(curve, t_), d };
            bestDistance = d;
        }
    }
    return posInfo;
}
exports.getClosestBoundaryPoint = getClosestBoundaryPoint;
//# sourceMappingURL=get-closest-boundary-point.js.map