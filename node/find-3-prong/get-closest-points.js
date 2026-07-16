import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
/**
 * @param maxCoordPowerOf2
 * @param x
 * @param curvePiece3s
 *
 * @internal
 */
function getClosestPoints(maxCoordPowerOf2, x, curvePiece3s) {
    return curvePiece3s.map(curvePieces => {
        return getCloseBoundaryPointsCertified(maxCoordPowerOf2, curvePieces, x)[0];
    });
}
export { getClosestPoints };
//# sourceMappingURL=get-closest-points.js.map