import { BezierPiece } from '../bezier-piece.js';
import { getBestDistanceSquared } from './get-best-distance-squared.js';
import { cullByLooseBoundingBox } from './cull-by-loose-bounding-box.js';
import { cullByTightBoundingBox } from './cull-by-tight-boundary-box.js';


/**
 * @hidden
 * @param bezierPieces 
 * @param p 
 * @param extreme
 */
function cullBezierPieces(
        bezierPieces: BezierPiece[],
        p: number[]) {

    const CULL_THRESHOLD = 0;

    if (bezierPieces.length > CULL_THRESHOLD) {
        const bestSquaredDistance = getBestDistanceSquared(
            bezierPieces, p
        );
        bezierPieces = cullByLooseBoundingBox(
            bezierPieces, p,
            bestSquaredDistance
        );
        
        bezierPieces = cullByTightBoundingBox(
            bezierPieces, p,
            bestSquaredDistance
        );
    }

    return bezierPieces;
}


export { cullBezierPieces }
