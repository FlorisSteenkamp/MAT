import { circumCenter } from 'flo-vector2d';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
/**
 * Finds an initial 3-prong circle center point from which to iterate. The point
 * must be within the shape.
 *
 * @param maxCoordPowerOf2
 * @param δ3s the three boundary pieces of which we need to find the three
 * 3-prong points.
 * @param curvePiece3s
 *
 * @internal
 */
function calcInitial3ProngCenter(maxCoordPowerOf2, δ3s, curvePiece3s) {
    const circle = δ3s[0][0].pointOnShape.circle;
    const twoProngCircleCenter = circle.center;
    const pos = getCloseBoundaryPointsCertified(maxCoordPowerOf2, curvePiece3s[1], twoProngCircleCenter)[0];
    const meanPoints = [
        δ3s[0][0].pointOnShape.p,
        pos.p,
        δ3s[2][1].pointOnShape.p,
    ];
    return circumCenter(meanPoints);
}
export { calcInitial3ProngCenter };
//# sourceMappingURL=calc-initial-3-prong-center.js.map