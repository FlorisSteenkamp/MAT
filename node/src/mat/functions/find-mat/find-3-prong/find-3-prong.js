"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_prong_for_debugging_1 = require("../../../../debug/classes/three-prong-for-debugging");
const find_3_prong_for_delta3s_1 = require("./find-3-prong-for-delta3s");
const get_boundary_beziers_1 = require("../../get-boundary-beziers");
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
function find3Prong(δs) {
    let bezierPiecess = δs.map(function (δ) {
        return get_boundary_beziers_1.getBoundaryPieceBeziers(δ);
    });
    let candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng;
    let bestIndx = undefined;
    let smallestError = Number.POSITIVE_INFINITY;
    for (let i = 1; i < δs.length - 1; i++) {
        let { circle, ps, error } = find_3_prong_for_delta3s_1.find3ProngForDelta3s(δs, i, bezierPiecess);
        if (typeof _debug_ !== 'undefined') {
            candidateThreeProngs.push({ circle, ps });
        }
        if (error < smallestError) {
            smallestError = error;
            bestIndx = i - 1;
            threeProng = { circle, ps, δ3s: undefined };
        }
    }
    //-------------------------------------
    //---- Add some additional properties
    //-------------------------------------
    let δ3s = [δs[0], δs[bestIndx + 1], δs[δs.length - 1]];
    threeProng.δ3s = δ3s;
    //-------------------------------------
    if (typeof _debug_ !== 'undefined') {
        let threeProngForDebugging = new three_prong_for_debugging_1.ThreeProngForDebugging(threeProng.circle, threeProng.ps, threeProng.δ3s, δs, bestIndx, candidateThreeProngs, undefined // To be set later
        );
        _debug_.generated.elems.threeProngs.push({
            data: threeProngForDebugging,
            $svg: _debug_.fs.drawElem.draw3Prong(threeProngForDebugging, _debug_.config.toDraw.threeProngs &&
                _debug_.config.toDraw.threeProngs.all)
        });
    }
    return threeProng;
}
exports.find3Prong = find3Prong;
