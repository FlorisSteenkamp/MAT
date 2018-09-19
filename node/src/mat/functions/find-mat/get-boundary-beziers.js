"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bezier_piece_1 = require("../../classes/bezier-piece");
;
/**
 *
 */
function getBoundaryBeziers(bezierLoop) {
    let bezierPieces = [];
    bezierLoop.forEach(bezier => {
        bezierPieces.push(new bezier_piece_1.BezierPiece(bezier, [0, 1]));
    });
    return bezierPieces;
}
exports.getBoundaryBeziers = getBoundaryBeziers;
