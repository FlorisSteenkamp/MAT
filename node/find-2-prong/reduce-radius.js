import { evalDeCasteljau } from "flo-bezier3";
import { dot, lengthSquared } from "flo-vector2d";
// TODO - must improve this
/**
 * Reduces the circle radius initially as an optimization step.
 *
 * @internal
 */
function reduceRadius(extreme, curvePieces, p, x) {
    const TOLERANCE = 1 + 2 ** -10;
    let minRadius = Infinity;
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const { curve, ts } = curvePiece;
        const { ps } = curve;
        const num = 2;
        for (let j = 0; j < (num + 1); j++) {
            const p_ = evalDeCasteljau(ps, ts[j / num]);
            const n = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p_);
            if (n) {
                let r = lengthSquared(n);
                if (r < minRadius) {
                    minRadius = r;
                }
            }
        }
    }
    // The extra bit is to account for floating point precision.
    return TOLERANCE * minRadius;
}
/**
 * @param p1 a point on the circle with normal pointing to `x` towards the center
 * of the circle
 * @param x a point such that the line from `p1` to `x` is normal to the circle at `p1`
 * @param p2 another point on the circle
 *
 * @internal
 */
function getCircleCenterFrom2PointsAndNormal(extreme, p1, x, p2) {
    const TOLERANCE = (2 ** -14 * extreme) ** 2;
    const chord = [p2[0] - p1[0], p2[1] - p1[1]];
    // Ignore if p1 and p2 are too close together
    if (dot(chord, chord) < TOLERANCE) {
        return undefined;
    }
    const normal = [x[0] - p1[0], x[1] - p1[1]];
    const denom = dot(normal, chord);
    // If the ray from p1 to x is parallel to the perpendicular bisector,
    // there is no finite center on that ray.
    if (denom <= 0) {
        return undefined;
    }
    const scale = dot(chord, chord) / (2 * denom);
    const n = [scale * normal[0], scale * normal[1]];
    return n;
}
export { reduceRadius };
//# sourceMappingURL=reduce-radius.js.map