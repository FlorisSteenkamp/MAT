import { closestPointOnBezier, hausdorffDistanceOneSidedBounds } from 'flo-bezier3';
/**
 * Returns the closest point on the piecewise bezier curve given by `curves`
 * to the point `p` (as a `Foot`), i.e. the piece-wise minimum of the
 * (certified) `closestPointOnBezier` of `flo-bezier3`.
 *
 * @param p the point
 * @param curves the pieces of the piecewise bezier curve
 *
 * @internal
 */
function closestPointOnCurves(p, curves) {
    let best = { d: Infinity, q: p, k: 0, t: 0 };
    for (let k = 0; k < curves.length; k++) {
        const c = closestPointOnBezier(curves[k], p);
        if (c.d < best.d) {
            best = { d: c.d, q: c.p, k, t: c.t };
        }
    }
    return best;
}
/**
 * Returns the distance from the point `p` to the piecewise bezier curve given
 * by `curves` (i.e. the minimum over the pieces of the distance to the piece).
 *
 * @param p the point
 * @param curves the pieces of the piecewise bezier curve
 *
 * @internal
 */
function distanceToCurves(p, curves) {
    return closestPointOnCurves(p, curves).d;
}
/**
 * Returns `true` if the one-sided Hausdorff distance from the bezier curve `A`
 * to the piecewise bezier curve `B` (possibly) exceeds `tolerance` and `false`
 * if it is certainly within `tolerance`.
 *
 * * a decision procedure by `hausdorffDistanceOneSidedBounds` of `flo-bezier3`
 * with the stopping thresholds `tolerance - margin` (lower) and `tolerance`
 * (upper) - it stops as soon as either certified bound settles the question
 * * it is conservative: `false` is certain (up to floating point roundoff)
 * while `true` may also be returned if the distance lies within `margin`
 * *below* `tolerance`
 * * since `margin > 0` it is guaranteed to stop (the bounds converge so one
 * of the thresholds is reached once they are within `margin` of each other)
 * so no iteration limit is needed
 * * `B` need not be smooth, nor need its pieces be connected
 *
 * @param A the 'from' bezier curve given by its control points
 * @param B the 'to' piecewise bezier curve given as an array of bezier curves
 * @param tolerance the distance to compare against
 * @param margin the width (`> 0`) of the band below `tolerance` within which
 * the answer may conservatively be `true`; smaller values trade time for
 * accepting curves that are only just within tolerance
 *
 * @internal
 */
function hausdorffDistanceOneSidedExceeds(A, B, tolerance, margin) {
    return hausdorffDistanceOneSidedBounds(A, B, {
        lowerStop: tolerance - margin,
        upperStop: tolerance,
        maxIterations: Infinity
    }).upper > tolerance;
}
export { hausdorffDistanceOneSidedExceeds, distanceToCurves, closestPointOnCurves };
//# sourceMappingURL=hausdorff-distance-one-sided-exceeds.js.map