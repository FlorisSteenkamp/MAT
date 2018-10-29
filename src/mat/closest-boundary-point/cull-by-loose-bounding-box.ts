
import { getBoundingBox } from "flo-bezier3";

import { BezierPiece } from "../../bezier-piece";

import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect';


/**
 * When checking distances, ignore all those with closest possible distance 
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces 
 * @param p 
 * @param dSquared 
 */
function cullByLooseBoundingBox(
        bezierPieces: BezierPiece[],
        p: number[],
        dSquared: number) {

    let candidateBezierPieces = [];

    for (let i=0; i<bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        
        let boundingBox = getBoundingBox(ps);
        
        let d = getClosestSquareDistanceToRect(
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
