"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bezier_piece_1 = require("../classes/bezier-piece");
/**
* Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
* from the given boundary piece.
* @param δ - An ordered pair that represents the start and ending points of
* the boundary piece
* @param keepStraight - If true then don't go around any mat circles
* @param ifSamePointReturnEmpty = If the two δ points representing a
* boundary piece compare as equal, then if this parameter is set to true
* a single point will be returned else the entire boundary will be
* returned.
*/
function getBoundaryPieceBeziers(δ, keepStraight = false, ifSamePointReturnPointOnly = false) {
    let cp0 = δ[0];
    let cp1 = δ[1];
    let bezierPieces = [];
    if (ifSamePointReturnPointOnly) {
        let posThis = cp0.cp.pointOnShape;
        let posNext = cp0.next.cp.pointOnShape;
        if (posNext.bezierNode === posThis.bezierNode &&
            posNext.t === posThis.t &&
            cp0.cp.order === cp0.next.cp.order &&
            cp0.cp.order2 === cp0.next.cp.order2) {
            let pos = cp0.cp.pointOnShape;
            let bezierPiece = new bezier_piece_1.BezierPiece(pos.bezierNode, [pos.t, pos.t]);
            return [bezierPiece];
        }
    }
    // As opposed to going around the circle and taking the last exit
    let goStraight = true;
    do {
        if (!goStraight && !keepStraight) {
            goStraight = true;
            // Actually, next, next, ..., i.e. take last exit
            cp0 = cp0.prevOnCircle;
            continue;
        }
        goStraight = false;
        let posThis = cp0.cp.pointOnShape;
        let posNext = cp0.next.cp.pointOnShape;
        if (posNext.bezierNode === posThis.bezierNode &&
            posThis.type === 1 && posNext.type === 1) {
        }
        else if (posNext.bezierNode === posThis.bezierNode &&
            (posNext.t > posThis.t || (posNext.t === posThis.t && cp0.next.cp.order > cp0.cp.order) ||
                (posNext.t === posThis.t && cp0.next.cp.order === cp0.cp.order && cp0.next.cp.order2 > cp0.cp.order2))) {
            let pos = cp0.cp.pointOnShape;
            let bezierPiece = new bezier_piece_1.BezierPiece(pos.bezierNode, [pos.t, posNext.t]);
            bezierPieces.push(bezierPiece);
        }
        else {
            let pos = cp0.cp.pointOnShape;
            let bezierPiece = new bezier_piece_1.BezierPiece(pos.bezierNode, [pos.t, 1]);
            bezierPieces.push(bezierPiece);
            addSkippedBeziers(bezierPieces, posThis.bezierNode, posNext.bezierNode, posNext.t);
        }
        cp0 = cp0.next;
    } while (cp0 !== cp1);
    return bezierPieces;
    /**
     * Adds pieces of skipped beziers
     */
    function addSkippedBeziers(bezierPieces, bezierNode0, bezierNode1, t1) {
        let bNode = bezierNode0;
        do {
            bNode = bNode.next;
            if (bNode === bezierNode1) {
                let bezierPiece = new bezier_piece_1.BezierPiece(bNode, [0, t1]);
                bezierPieces.push(bezierPiece);
            }
            else {
                let bezierPiece = new bezier_piece_1.BezierPiece(bNode, [0, 1]);
                bezierPieces.push(bezierPiece);
            }
        } while (bNode !== bezierNode1);
    }
}
exports.getBoundaryPieceBeziers = getBoundaryPieceBeziers;
