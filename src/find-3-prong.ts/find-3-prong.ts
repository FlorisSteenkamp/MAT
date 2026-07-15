import { CpNode } from '../cp-node/cp-node.js';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { find3ProngForDelta3s } from './find-3-prong-for-delta3s.js';
import { getBoundaryPieceBeziers } from '../mat/get-boundary-piece-beziers.js';


/**
 * Find and return a 3-prong from the given boundary piece.
 * @param δs A boundary piece
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * 
 * @internal
 */ 
function find3Prong(
        δs: CpNode[][],
        maxCoordPowerOf2: number) {

    const curvePiecess = δs.map(δ => getBoundaryPieceBeziers(δ, false).filter(v => v !== undefined));

    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng: { 
        circle: Circle, 
        poss: PointOnShape[], 
        δ3s: CpNode[][] 
    };
    let smallestError = Infinity;
    for (let i=1; i<δs.length-1; i++) {
        for (let k=0; k<3; k++) {
            const threeProngInfo = 
                find3ProngForDelta3s(δs, i, k, curvePiecess, maxCoordPowerOf2);

            if (!threeProngInfo) { continue; }

            const { circle, poss: poss, error, δ3s } = threeProngInfo;
            
            if (error < smallestError) {
                smallestError = error;
                
                threeProng = { circle, poss: poss as PointOnShape[], δ3s };
            }
        }
    }
    

    return threeProng!;
}


export { find3Prong }
