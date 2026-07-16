import { getMedialPointCoeffsBez0 } from "flo-bezier3";
import { lengthSquared, squaredDistanceBetween } from "flo-vector2d";
const { abs } = Math;
const TOLERANCE = 1 + 2 ** -20;
/**
 * Reduces the circle radius initially as an optimization step.
 *
 * @internal
 */
function reduceRadius(maxCoordPowerOf2, curvePieces, y, nnorm) {
    let minRadius = Infinity;
    let x = [y[0] + nnorm[0], y[1] + nnorm[1]];
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const { ps } = curvePiece.curve;
        const pS = ps[0];
        const pE = ps[ps.length - 1];
        for (const P of [pS, pE]) {
            if (squaredDistanceBetween(x, P) > minRadius) {
                continue; // short-circuit
            }
            const { a0, b0 } = getMedialPointCoeffsBez0(y, nnorm, P);
            if (abs(a0) <= 2 ** -40 || abs(b0) <= 2 ** -40) {
                continue;
            }
            const w = -b0 / a0;
            // too close to point of origin *or* negative;
            if (w < 2 ** -40) {
                continue;
            }
            const N = [w * nnorm[0], w * nnorm[1]];
            const r = lengthSquared(N);
            if (r < minRadius) {
                minRadius = r;
                x = [y[0] + N[0], y[1] + N[1]];
            }
        }
    }
    // The extra bit is to account for floating point precision.
    return TOLERANCE * minRadius;
}
export { reduceRadius };
//# sourceMappingURL=reduce-radius.js.map