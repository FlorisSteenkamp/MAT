import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
/**
 * @internal
 * @param x
 * @param curvePiece3s
 * @param extreme
 */
function getClosestPoints(x, curvePiece3s) {
    return curvePiece3s.map(curvePieces => {
        return getCloseBoundaryPointsCertified(5, // TODO - see find-2-prong
        curvePieces, x)[0];
    });
}
export { getClosestPoints };
//# sourceMappingURL=get-closest-points.js.map