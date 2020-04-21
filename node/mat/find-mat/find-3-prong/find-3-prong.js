"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const three_prong_for_debugging_1 = require("../../../debug/three-prong-for-debugging");
const find_3_prong_for_delta3s_1 = require("./find-3-prong-for-delta3s");
const get_boundary_piece_beziers_1 = require("../../get-boundary-piece-beziers");
/**
 * @hidden
 * Find and return a 3-prong from the given boundary piece.
 * @param δs A boundary piece
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function find3Prong(δs, extreme) {
    let bezierPiecess = δs.map(get_boundary_piece_beziers_1.getBoundaryPieceBeziers);
    if (typeof _debug_ !== 'undefined') {
        let threeProngs = _debug_.generated.elems.threeProng;
        threeProngs.push(three_prong_for_debugging_1.createEmptyThreeProngForDebugging());
        let d = threeProngs[threeProngs.length - 1];
        d.boundaries = [];
        for (let bezierPieces of bezierPiecess) {
            let boundary = [];
            d.boundaries.push(boundary);
            for (let bezierPiece of bezierPieces) {
                let bezier = flo_bezier3_1.fromTo(bezierPiece.curve.ps)(bezierPiece.ts[0], bezierPiece.ts[1]);
                boundary.push(bezier);
            }
        }
        d.traces = [];
    }
    let candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng;
    let bestIndx = undefined;
    let smallestError = Number.POSITIVE_INFINITY;
    for (let i = 1; i < δs.length - 1; i++) {
        for (let k = 0; k < 3; k++) {
            if (typeof _debug_ !== 'undefined') {
                let threeProngs = _debug_.generated.elems.threeProng;
                let d = threeProngs[threeProngs.length - 1];
                let trace = [];
                d.traces.push(trace);
            }
            let threeProngInfo = find_3_prong_for_delta3s_1.find3ProngForDelta3s(δs, i, k, bezierPiecess, extreme);
            if (!threeProngInfo) {
                continue;
            }
            let { circle, ps, error, δ3s } = threeProngInfo;
            if (typeof _debug_ !== 'undefined') {
                candidateThreeProngs.push({ circle, ps });
            }
            if (error < smallestError) {
                smallestError = error;
                bestIndx = i - 1;
                threeProng = { circle, ps, δ3s };
            }
        }
    }
    //threeProng.δ3s = [δs[0], δs[bestIndx+1], δs[δs.length-1]];
    if (typeof _debug_ !== 'undefined') {
        let threeProngs = _debug_.generated.elems.threeProng;
        let d = threeProngs[threeProngs.length - 1];
        d.generated = _debug_.generated;
        d.circle = threeProng.circle;
        d.poss = threeProng.ps;
        d.cp3ss = threeProng.δ3s;
        d.cpss = δs;
        d.bestIndx = bestIndx;
        d.candidateThreeProngs = candidateThreeProngs;
    }
    return threeProng;
}
exports.find3Prong = find3Prong;
//# sourceMappingURL=find-3-prong.js.map