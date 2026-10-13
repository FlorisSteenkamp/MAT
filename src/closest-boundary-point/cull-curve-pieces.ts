import type { CurvePiece } from '../mat/curve-piece.js';
import { getBoundingBox$, getBoundingBoxTight$ } from '../geometry/get-bounding-box-.js';
import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getClosestSquaredDistanceToRotatedRect } from '../geometry/get-closest-squared-distance-to-rotated-rect.js';


/**
 * Returns the given curve pieces with those culled whose closest possible
 * point to `p` is further than `sqrt(maxSquaredDistance)` away.
 *
 * * a piece is kept only if both its (cheap, axis-aligned) loose bounding box
 *   and then its (rotated) tight bounding box come within the distance
 * * the bounding boxes are those of the entire curves (not just the pieces)
 *   and are memoized per curve
 * * the given array is not modified (callers may reuse it for other points)
 * * any tolerance for floating point error is the responsibility of the
 *   caller (i.e. `maxSquaredDistance` should already include it)
 *
 * @param curvePieces the curve pieces to cull
 * @param p the point
 * @param maxSquaredDistance the squared distance beyond which to cull
 *
 * @internal
 */
function cullCurvePieces(
        curvePieces: CurvePiece[],
        p: number[],
        maxSquaredDistance: number): CurvePiece[] {

    const culled: CurvePiece[] = [];

    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const { ps } = curvePiece.curve;

        const d = getClosestSquareDistanceToRect(getBoundingBox$(ps), p);
        if (d > maxSquaredDistance) { continue; }

        const d2 = getClosestSquaredDistanceToRotatedRect(getBoundingBoxTight$(ps), p);
        if (d2 > maxSquaredDistance) { continue; }

        culled.push(curvePiece);
    }

    return culled;
}


export { cullCurvePieces }
