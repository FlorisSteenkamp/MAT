import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
/**
 * @param maxCoordPowerOf2
 * @param x
 * @param curvePiece3s
 *
 * @internal
 */
function getClosestPoints(x, curvePiece3s) {
    return curvePiece3s.map(curvePieces => {
        return getCloseBoundaryPointsCertified(curvePieces, x)[0];
    });
}
export { getClosestPoints };
//# sourceMappingURL=get-closest-points.js.map