"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cullBezierPieces = void 0;
const get_best_distance_squared_1 = require("./get-best-distance-squared");
const cull_by_loose_bounding_box_1 = require("./cull-by-loose-bounding-box");
const cull_by_tight_boundary_box_1 = require("./cull-by-tight-boundary-box");
/**
 * @hidden
 * @param bezierPieces
 * @param p
 * @param extreme
 */
function cullBezierPieces(bezierPieces, p) {
    const CULL_THRESHOLD = 0;
    if (bezierPieces.length > CULL_THRESHOLD) {
        let bestSquaredDistance = get_best_distance_squared_1.getBestDistanceSquared(bezierPieces, p);
        bezierPieces = cull_by_loose_bounding_box_1.cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance);
        bezierPieces = cull_by_tight_boundary_box_1.cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance);
    }
    return bezierPieces;
}
exports.cullBezierPieces = cullBezierPieces;
//# sourceMappingURL=cull-bezier-pieces.js.map