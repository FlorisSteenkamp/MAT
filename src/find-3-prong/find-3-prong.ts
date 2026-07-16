import type { CpNode } from '../cp-node/cp-node.js';
import type { ThreeProngInfo } from './three-prong-info.js';
import { find3ProngForDelta3s } from './find-3-prong-for-delta3s.js';
import { getBoundaryPieceBeziers } from '../mat/get-boundary-piece-beziers.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';


/**
 * Find and return a 3-prong from the given boundary piece.
 * 
 * @param δs A boundary piece
 * @param maxCoordPowerOf2 The maximum coordinate power of 2 value used to
 * calculate floating point tolerances.
 * 
 * @internal
 */ 
function find3Prong(
        δs: CpNode[][],
        maxCoordPowerOf2: number): ThreeProngInfo {

    // FUTURE if `δs.length > (some threshold (say 4 or 5))` then add two-prongs
    // to reduced the number of permutations required
    // if (δs.length > 3) { console.log(δs.length); }

    const curvePiecess = δs.map(getBoundaryPieceBeziers);

    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng: ThreeProngInfo;

    let smallestError = Infinity;
    for (let i=1; i<δs.length - 1; i++) {
        for (let k=0; k<3; k++) {
            const r = find3ProngForDelta3s(
                δs, i, k, curvePiecess, maxCoordPowerOf2
            );

            if (r === undefined) { continue; }

            const { error, threeProngInfo } = r;

            if (error < smallestError) {
                smallestError = error;
                threeProng = threeProngInfo;
            }
        }
    }

    return threeProng!;
}


export { find3Prong }
