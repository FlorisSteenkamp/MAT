/** @internal */
import { circumCenter } from 'flo-vector2d';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
/**
 * @internal
 * Finds an initial 3-prong circle center point from which to iterate. The point
 * must be within the shape.
 * @param δ3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 * @param bezierPiece3s
 * @param extreme
 */
function calcInitial3ProngCenter(δ3s, bezierPiece3s) {
    const twoProngCircleCenter = δ3s[0][0].cp.circle.center;
    const pos = getCloseBoundaryPointsCertified(bezierPiece3s[1], twoProngCircleCenter)[0];
    const meanPoints = [
        δ3s[0][0].cp.pointOnShape.p,
        pos.p,
        δ3s[2][1].cp.pointOnShape.p,
    ];
    return circumCenter(meanPoints);
}
export { calcInitial3ProngCenter };
//# sourceMappingURL=calc-initial-3-prong-center.js.map