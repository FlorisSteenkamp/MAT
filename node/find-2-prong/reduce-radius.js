import { evalDeCasteljau } from "flo-bezier3";
import { dot, lineLineIntersection, squaredDistanceBetween } from "flo-vector2d";
/**
 * @internal
 *
 * Reduces the circle radius initially as an optimization step.
 */
function reduceRadius(extreme, bezierPieces, p, x) {
    const TOLERANCE = 1 + 2 ** -10;
    let prevP = undefined;
    let minRadius = Number.POSITIVE_INFINITY;
    for (let i = 0; i < bezierPieces.length; i++) {
        const bezierPiece = bezierPieces[i];
        const ps = bezierPiece.curve.ps;
        let r1 = Number.POSITIVE_INFINITY;
        const p1 = evalDeCasteljau(ps, bezierPiece.ts[0]);
        // Prevent evaluating the same points twice
        if (!prevP || prevP[0] !== p1[0] || prevP[1] !== p1[1]) {
            const cc1 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1);
            if (cc1) {
                r1 = squaredDistanceBetween(p, cc1);
            }
        }
        let r2 = Number.POSITIVE_INFINITY;
        const p2 = evalDeCasteljau(ps, bezierPiece.ts[1]);
        const cc2 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p2);
        if (cc2) {
            r2 = squaredDistanceBetween(p, cc2);
        }
        prevP = p2;
        const d = Math.min(r1, r2);
        if (d < minRadius) {
            minRadius = d;
        }
    }
    // The extra bit is to account for floating point precision.
    return TOLERANCE * minRadius;
}
/**
 * @internal
 * @param p A point on the circle with normal pointing to x towards the center
 * of the circle.
 * @param x
 * @param p1 Another point on the circle.
 */
function getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1) {
    const TOLERANCE = (2 ** -14 * extreme) ** 2;
    // Ignore if p and p1 are too close together
    if (squaredDistanceBetween(p, p1) < TOLERANCE) {
        return undefined;
    }
    /** The perpindicular bisector between the two given points on the circle */
    const pb = [
        (p[0] + p1[0]) / 2,
        (p[1] + p1[1]) / 2,
    ];
    const tan = [p1[0] - p[0], p1[1] - p[1]];
    const norm = [-tan[1], tan[0]]; // Rotate by 90 degrees
    const pb2 = [pb[0] + norm[0], pb[1] + norm[1]];
    const res = lineLineIntersection([p, x], [pb, pb2]);
    if (!res) {
        return undefined;
    }
    const resO = [res[0] - p[0], res[1] - p[1]];
    const xO = [x[0] - p[0], x[1] - p[1]];
    if (dot(resO, xO) < 0) {
        return undefined;
    }
    return res;
}
export { reduceRadius };
//# sourceMappingURL=reduce-radius.js.map