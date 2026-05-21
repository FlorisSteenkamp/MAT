import { evalDeCasteljau } from 'flo-bezier3';
import { squaredDistanceBetween } from 'flo-vector2d';
import { CurvePiece } from "../mat/curve-piece.js";


/**
 * @internal
 * Finds an initial distance such that the closest point can not be further than 
 * this distance away.
 */ 
function getBestDistanceSquared(
        curvePieces: CurvePiece[], 
        p: number[]) {

    let bestSquaredDistance = Number.POSITIVE_INFINITY;
    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];

        const ps = curvePiece.curve.ps;
        
        const p1 = evalDeCasteljau(ps, curvePiece.ts[0]);
        const p2 = evalDeCasteljau(ps, curvePiece.ts[1]);
        
        const d = Math.min(
            squaredDistanceBetween(p, p1),
            squaredDistanceBetween(p, p2)
        ); 
        
        if (d < bestSquaredDistance) {
            bestSquaredDistance = d;  
        }
    }

    // The extra multiplier is to account for floating point precision.
    return (1 + 2**-10)*bestSquaredDistance;
}


export { getBestDistanceSquared }
