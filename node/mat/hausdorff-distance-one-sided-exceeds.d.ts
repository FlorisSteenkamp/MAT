/**
 * A point `q` on a piecewise bezier curve at parameter `t` of piece `k`
 * together with its distance `d` to some other point.
 *
 * @internal
 */
interface Foot {
    d: number;
    q: number[];
    k: number;
    t: number;
}
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
declare function closestPointOnCurves(p: number[], curves: number[][][]): Foot;
/**
 * Returns the distance from the point `p` to the piecewise bezier curve given
 * by `curves` (i.e. the minimum over the pieces of the distance to the piece).
 *
 * @param p the point
 * @param curves the pieces of the piecewise bezier curve
 *
 * @internal
 */
declare function distanceToCurves(p: number[], curves: number[][][]): number;
/**
 * Returns `true` if the one-sided Hausdorff distance from the bezier curve `A`
 * to the piecewise bezier curve `B` exceeds `tolerance` and `false` otherwise.
 *
 * * this is a *decision procedure* and is thus much cheaper than computing the
 * distance (e.g. via `hausdorffDistanceOneSided` from `flo-bezier3`) and then
 * comparing it: it stops as soon as either a point on `A` further than
 * `tolerance` from `B` is found (a certified *lower* bound exceeding the
 * tolerance) or every piece of `A` is certified to be within `tolerance`
 * (a certified *upper* bound)
 * * `A` is bisected into parameter intervals; the upper bound on an interval
 * `[tS,tE]` is the smaller of
 *     * `(hS + hE + L)/2` where `hS`, `hE` are (upper bounds on) the
 *       distances from its endpoints to `B` and `L` is the control polygon
 *       length of `A` restricted to the interval (an upper bound on its arc
 *       length): any point on the interval is within `L` of both endpoints so
 *       its distance to `B` is at most `min(hS + l, hE + (L - l))` with `l`
 *       the arc length from the start, maximized at `(hS + hE + L)/2`
 *     * the maximum distance from the foot (on `B`) of either endpoint to the
 *       control points of `A` restricted to the interval (the sub-curve lies
 *       within the convex hull of its control points, within which the
 *       distance to a fixed point is maximized at a vertex)
 * * the distances from sample points on `A` to `B` are found cheaply by
 * Newton iteration from the feet of the neighboring samples - these are upper
 * bounds (any point on `B` gives one) which suffice for certifying the
 * acceptance of an interval; only when such a bound exceeds the tolerance is
 * the certified (and expensive) closest point computed to decide whether the
 * tolerance is really exceeded
 * * `B` need not be smooth, nor need its pieces be connected
 * * the result is approximate only to the extent that the floating point
 * evaluations are, i.e. a decision is only taken once it is certain up to
 * roundoff
 *
 * @param A the 'from' bezier curve given by its control points
 * @param B the 'to' piecewise bezier curve given as an array of bezier curves
 * @param tolerance the distance to compare against
 * @param maxIterations the maximum number of interval bisections (each
 * costing one cheap closest point calculation) before giving up, in which
 * case `true` is returned (the conservative answer for simplification
 * purposes); defaults to `1000` (curves only just within tolerance may
 * need many bisections, especially where they run nearly parallel to `B`)
 *
 * @internal
 */
declare function hausdorffDistanceOneSidedExceeds(A: number[][], B: number[][][], tolerance: number, maxIterations?: number): boolean;
export { hausdorffDistanceOneSidedExceeds, distanceToCurves, closestPointOnCurves };
