"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 * Represents a part of a bezier within the shape boundary.
 */
class BezierPiece {
    /**
     * @param curve A bezier curve within the shape boundary.
     * @param ts The start and end t parameter values of the bezier curve.
     */
    constructor(curve, ts) {
        this.curve = curve;
        this.ts = ts;
    }
}
exports.BezierPiece = BezierPiece;
//# sourceMappingURL=bezier-piece.js.map