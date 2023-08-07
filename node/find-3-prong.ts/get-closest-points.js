import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
/**
 * @internal
 * @param x
 * @param bezierPiece3s
 * @param extreme
 */
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(bezierPieces => {
        return getCloseBoundaryPointsCertified(bezierPieces, x)[0];
    });
}
export { getClosestPoints };
//# sourceMappingURL=get-closest-points.js.map