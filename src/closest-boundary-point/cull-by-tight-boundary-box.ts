import { getBoundingBoxTight } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { CurvePiece } from "../mat/curve-piece.js";
import { getClosestSquaredDistanceToRotatedRect } from '../geometry/get-closest-squared-distance-to-rotated-rect.js';


const getBoundingBoxTight_ = memoize(getBoundingBoxTight);


/**
 * @internal
 * When checking distances, ignore all those with closest possible distance 
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces 
 * @param p 
 * @param bestSquaredDistance 
 */
function cullByTightBoundingBox(
        bezierPieces: CurvePiece[], 
        p: number[],
        bestSquaredDistance: number) {

    const candidateBezierPieces = [];

    for (let i=0; i<bezierPieces.length; i++) {
        const bezierPiece = bezierPieces[i];
        const ps = bezierPiece.curve.ps;
        
        const tightBoundingBox = getBoundingBoxTight_(ps);
        const d = getClosestSquaredDistanceToRotatedRect(
                tightBoundingBox,
                p
        );
        if (d <= bestSquaredDistance) {
            candidateBezierPieces.push(bezierPiece);
        } 
    } 

    return candidateBezierPieces;
}


export { cullByTightBoundingBox }
