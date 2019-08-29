"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
/**
 * @hidden
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 */
function getBestDistanceSquared(bezierPieces, p) {
    let bestSquaredDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        let evPs = flo_bezier3_1.evaluate(ps);
        let p1 = evPs(bezierPiece.ts[0]);
        let p2 = evPs(bezierPiece.ts[1]);
        let d = Math.min(flo_vector2d_1.squaredDistanceBetween(p, p1), flo_vector2d_1.squaredDistanceBetween(p, p2));
        if (d < bestSquaredDistance) {
            bestSquaredDistance = d;
        }
    }
    // The extra multiplier is to account for floating point precision.
    // TODO - remove delta (or base it on theory)
    return bestSquaredDistance * 1.01;
}
exports.getBestDistanceSquared = getBestDistanceSquared;
//# sourceMappingURL=get-best-distance-squared.js.map