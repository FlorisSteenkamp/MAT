
import { evaluate } from 'flo-bezier3';

import { squaredDistanceBetween } from 'flo-vector2d';

import { BezierPiece } from "../../bezier-piece";


/**
 * @hidden
 * Finds an initial distance such that the closest point can not be further than 
 * this distance away.
 */ 
function getBestDistanceSquared(
        bezierPieces: BezierPiece[], 
        p: number[]) {

    let bestSquaredDistance = Number.POSITIVE_INFINITY;
    for (let i=0; i<bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];

        let ps = bezierPiece.curve.ps;
        
        let evPs = evaluate(ps)
        let p1 = evPs(bezierPiece.ts[0]);
        let p2 = evPs(bezierPiece.ts[1]);
        
        let d = Math.min(
            squaredDistanceBetween(p, p1),
            squaredDistanceBetween(p, p2)
        ); 
        
        if (d < bestSquaredDistance) {
            bestSquaredDistance = d;  
        }
    }

    // The extra multiplier is to account for floating point precision.
    // TODO - remove delta (or base it on theory)
    return bestSquaredDistance * 1.01;
}


export { getBestDistanceSquared }
