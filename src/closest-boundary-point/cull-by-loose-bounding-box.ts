import type { CurvePiece } from '../mat/curve-piece.js';
import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';


/**
 * @internal
 * When checking distances, ignore all those with closest possible distance 
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param curvePieces 
 * @param p 
 * @param dSquared 
 */
function cullByLooseBoundingBox(
        curvePieces: CurvePiece[],
        p: number[],
        dSquared: number) {

    const candidateCurvePieces = [];

    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const ps = curvePiece.curve.ps;
        
        const boundingBox = getBoundingBox$(ps);
        
        const d = getClosestSquareDistanceToRect(
            boundingBox,
            p
        );
        if (d <= dSquared) {
            candidateCurvePieces.push(curvePiece);
        } 
    }

    return candidateCurvePieces;
}


export { cullByLooseBoundingBox }
