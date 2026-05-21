import { CurvePiece } from '../mat/curve-piece.js';
import { getBestDistanceSquared } from './get-best-distance-squared.js';
import { cullByLooseBoundingBox } from './cull-by-loose-bounding-box.js';
import { cullByTightBoundingBox } from './cull-by-tight-boundary-box.js';


/**
 * @param curvePieces 
 * @param p 
 * @param extreme
 * 
 * @internal
 */
function cullCurvePieces1(
        curvePieces: CurvePiece[],
        p: number[]) {

    const bestSquaredDistance = getBestDistanceSquared(
        curvePieces, p
    );
    curvePieces = cullByLooseBoundingBox(
        curvePieces, p,
        bestSquaredDistance
    );
    
    curvePieces = cullByTightBoundingBox(
        curvePieces, p,
        bestSquaredDistance
    );


    return curvePieces;
}


export { cullCurvePieces1 }
