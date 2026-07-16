import { evalDeCasteljau } from 'flo-bezier3';
import { squaredDistanceBetween } from 'flo-vector2d';
const { min } = Math;
const TOLERANCE = 1 + 2 ** -20;
/**
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 *
 * @internal
 */
function getBestDistanceSquared(curvePieces, xO) {
    let bestSquaredDistance = Infinity;
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const { curve: { ps }, ts } = curvePiece;
        const p1 = evalDeCasteljau(ps, ts[0]);
        const p2 = evalDeCasteljau(ps, ts[1]);
        bestSquaredDistance = min(bestSquaredDistance, squaredDistanceBetween(xO, p1), squaredDistanceBetween(xO, p2));
    }
    // The extra multiplier is to account for floating point precision.
    return TOLERANCE * bestSquaredDistance;
}
export { getBestDistanceSquared };
//# sourceMappingURL=get-best-distance-squared.js.map