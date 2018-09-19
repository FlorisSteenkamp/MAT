"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BezierPiece {
    /**
     * @param curve
     * @param ts The start and end t parameter of the original bezier curve
     */
    constructor(curve, ts) {
        this.curve = curve;
        this.ts = ts;
    }
}
exports.BezierPiece = BezierPiece;
