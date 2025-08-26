import { allRoots, deflate } from 'flo-poly';
import { CurvePiece } from '../mat/curve-piece.js';
import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';


/**
 * @internal
 * When checking distances, ignore all those with closest possible distance 
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces 
 * @param p 
 * @param dSquared 
 */
function cullByLooseBoundingBox(
        bezierPieces: CurvePiece[],
        p: number[],
        dSquared: number) {

    const candidateBezierPieces = [];

    for (let i=0; i<bezierPieces.length; i++) {
        const bezierPiece = bezierPieces[i];
        const ps = bezierPiece.curve.ps;
        
        const boundingBox = getBoundingBox$(ps);
        
        const d = getClosestSquareDistanceToRect(
            boundingBox,
            p
        );
        if (d <= dSquared) {
            candidateBezierPieces.push(bezierPiece);
        } 
    }

    return candidateBezierPieces;
}


export { cullByLooseBoundingBox }
