
import { getBoundingBoxTight } from 'flo-bezier3';
import { BezierPiece } from "../bezier-piece";
import { getClosestSquaredDistanceToRotatedRect } from 
    '../geometry/get-closest-squared-distance-to-rotated-rect';


/**
 * @hidden
 * When checking distances, ignore all those with closest possible distance 
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces 
 * @param p 
 * @param bestSquaredDistance 
 */
function cullByTightBoundingBox(
        bezierPieces: BezierPiece[], 
        p: number[],
        bestSquaredDistance: number) {

    let candidateBezierPieces = []; 

    for (let i=0; i<bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        
        let tightBoundingBox = getBoundingBoxTight(ps);
        let d = getClosestSquaredDistanceToRotatedRect(
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
