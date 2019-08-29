"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bezier_piece_1 = require("../bezier-piece");
const point_on_shape_1 = require("../point-on-shape");
const contact_point_1 = require("../contact-point");
/**
 * @hidden
 * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
 * from the given boundary piece.
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 */
function getBoundaryPieceBeziers(cpNodes) {
    let cpThis = cpNodes[0];
    let cpEnd = cpNodes[1];
    let bezierPieces = [];
    // As opposed to going around the circle and taking the last exit
    let goStraight = true;
    do {
        if (!goStraight) {
            goStraight = true;
            cpThis = cpThis.prevOnCircle; // take last exit
            continue;
        }
        goStraight = false;
        let posThis = cpThis.cp.pointOnShape;
        let posNext = cpThis.next.cp.pointOnShape;
        if (posNext.curve === posThis.curve &&
            point_on_shape_1.PointOnShape.isQuiteSharpCorner(posThis) &&
            point_on_shape_1.PointOnShape.isQuiteSharpCorner(posNext)) {
            // Do nothing
        }
        else if (posNext.curve === posThis.curve &&
            contact_point_1.ContactPoint.compare(cpThis.next.cp, cpThis.cp) > 0) {
            bezierPieces.push(new bezier_piece_1.BezierPiece(posThis.curve, [posThis.t, posNext.t]));
        }
        else {
            bezierPieces.push(new bezier_piece_1.BezierPiece(posThis.curve, [posThis.t, 1]));
            if (cpThis.cp.pointOnShape.curve.loop === cpThis.next.cp.pointOnShape.curve.loop) {
                addSkippedBeziers(bezierPieces, posThis.curve, posNext.curve, posNext.t);
            }
        }
        cpThis = cpThis.next;
    } while (cpThis !== cpEnd);
    return bezierPieces;
}
exports.getBoundaryPieceBeziers = getBoundaryPieceBeziers;
/**
 * @hidden
 * Adds pieces of skipped beziers
 */
function addSkippedBeziers(bezierPieces, curveStart, curveEnd, t1) {
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        let tEnd = curveThis === curveEnd ? t1 : 1;
        bezierPieces.push(new bezier_piece_1.BezierPiece(curveThis, [0, tEnd]));
    } while (curveThis !== curveEnd);
}
//# sourceMappingURL=get-boundary-piece-beziers.js.map