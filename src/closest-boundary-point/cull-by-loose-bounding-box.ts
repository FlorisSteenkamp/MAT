import type { CurvePiece } from '../mat/curve-piece.js';
import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';


/**
 * When checking distances, ignore all those with closest possible distance 
 * further than 'bestSquaredDistance', i.e. cull them.
 * 
 * @param curvePieces 
 * @param xO 
 * @param xy2 
 * 
 * @internal
 */
function cullByLooseBoundingBox(
        curvePieces: CurvePiece[],
        xO: number[],
        xy2: number) {

    const curvePieces_ = [];

    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const { ps } = curvePiece.curve;
        
        const boundingBox = getBoundingBox$(ps);
        
        const d = getClosestSquareDistanceToRect(
            boundingBox,
            xO
        );
        if (d <= xy2) {
            curvePieces_.push(curvePiece);
        }
    }

    return curvePieces_;
}


export { cullByLooseBoundingBox }
