import { fromTo } from 'flo-bezier3';
import { createEmptyThreeProngForDebugging } from '../debug/three-prong-for-debugging.js';
import { find3ProngForDelta3s } from './find-3-prong-for-delta3s.js';
import { getBoundaryPieceBeziers } from '../mat/get-boundary-piece-beziers.js';
/**
 * @internal
 * Find and return a 3-prong from the given boundary piece.
 * @param δs A boundary piece
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function find3Prong(δs, extreme) {
    const bezierPiecess = δs.map(getBoundaryPieceBeziers);
    addDebugInfo1(bezierPiecess);
    const candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng;
    let bestIndx = undefined;
    let smallestError = Number.POSITIVE_INFINITY;
    for (let i = 1; i < δs.length - 1; i++) {
        for (let k = 0; k < 3; k++) {
            addDebugInfo2();
            const threeProngInfo = find3ProngForDelta3s(δs, i, k, bezierPiecess, extreme);
            if (!threeProngInfo) {
                continue;
            }
            const { circle, ps: poss, error, δ3s } = threeProngInfo;
            addDebugInfo3(candidateThreeProngs, circle, poss);
            if (error < smallestError) {
                smallestError = error;
                bestIndx = i - 1;
                threeProng = { circle, ps: poss, δ3s };
            }
        }
    }
    addDebugInfo4(threeProng, δs, bestIndx, candidateThreeProngs);
    return threeProng;
}
function addDebugInfo2() {
    if (typeof _debug_ !== 'undefined') {
        const threeProngs = _debug_.generated.elems.threeProng;
        const d = threeProngs[threeProngs.length - 1];
        const trace = [];
        d.traces.push(trace);
    }
}
function addDebugInfo3(candidateThreeProngs, circle, ps) {
    if (typeof _debug_ !== 'undefined') {
        candidateThreeProngs.push({ circle, ps });
    }
}
function addDebugInfo4(threeProng, δs, bestIndx, candidateThreeProngs) {
    if (typeof _debug_ !== 'undefined') {
        const threeProngs = _debug_.generated.elems.threeProng;
        const d = threeProngs[threeProngs.length - 1];
        d.generated = _debug_.generated;
        if (threeProng !== undefined) {
            d.circle = threeProng.circle;
            d.poss = threeProng.ps;
            d.cp3ss = threeProng.δ3s;
        }
        d.cpss = δs;
        d.bestIndx = bestIndx;
        d.candidateThreeProngs = candidateThreeProngs;
    }
}
function addDebugInfo1(bezierPiecess) {
    if (typeof _debug_ !== 'undefined') {
        const threeProngs = _debug_.generated.elems.threeProng;
        threeProngs.push(createEmptyThreeProngForDebugging());
        const d = threeProngs[threeProngs.length - 1];
        d.boundaries = [];
        for (const bezierPieces of bezierPiecess) {
            const boundary = [];
            d.boundaries.push(boundary);
            for (const bezierPiece of bezierPieces) {
                /* qqq
                let bezier = fromTo(bezierPiece.curve.ps)(
                    bezierPiece.ts[0], bezierPiece.ts[1]
                );
                */
                const bezier = fromTo(bezierPiece.curve.ps, bezierPiece.ts[0], bezierPiece.ts[1]);
                boundary.push(bezier);
            }
        }
        d.traces = [];
    }
}
export { find3Prong };
//# sourceMappingURL=find-3-prong.js.map