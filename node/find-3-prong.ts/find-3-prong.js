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
    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng;
    let smallestError = Number.POSITIVE_INFINITY;
    for (let i = 1; i < δs.length - 1; i++) {
        for (let k = 0; k < 3; k++) {
            const threeProngInfo = find3ProngForDelta3s(δs, i, k, bezierPiecess, extreme);
            if (!threeProngInfo) {
                continue;
            }
            const { circle, poss: poss, error, δ3s } = threeProngInfo;
            if (error < smallestError) {
                smallestError = error;
                threeProng = { circle, poss: poss, δ3s };
            }
        }
    }
    return threeProng;
}
export { find3Prong };
//# sourceMappingURL=find-3-prong.js.map