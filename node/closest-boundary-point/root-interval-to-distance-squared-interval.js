import { eps } from '../error-analysis/gamma.js';
const { max } = Math;
/**
 * Relative widening of the interval bounds - see the error analysis in
 * `rootIntervalToDistanceSquaredInterval`: the exact first order requirement
 * is `4u = 2eps` (`u = eps/2` the unit roundoff); `4eps = 2**-50` (exactly
 * representable) leaves room for the `O(u²)` terms.
 */
const WIDEN = 4 * eps;
/**
 * Returns an interval `[min, max]` guaranteed to contain the squared distance
 * from the point `p` to *any* point of a curve piece, given an axis-aligned
 * box that is guaranteed to engulf that piece (see `getIntervalBox`).
 *
 * * the minimum squared distance to the box is attained on its boundary (or
 *   is `0` if `p` is inside): per axis the distance is the gap between `p` and
 *   the box's range on that axis (`0` if `p` is within the range)
 * * the maximum squared distance to the box is attained at a corner: per axis
 *   it is the larger of the distances to the two range ends
 *
 * Error analysis (`u = eps/2` the unit roundoff, `fl(a∘b) = (a∘b)(1+δ)`,
 * `|δ| <= u`): all inputs are doubles and each bound is computed with 3
 * roundings per term path (subtraction, square, sum - `max` is exact) and
 * widened with 1 more, so the computed bound is within a factor `(1±u)⁴` of
 * the exact one before widening and `WIDEN >= 4u + O(u²)` makes the interval
 * rigorous. (A gap of `0` is exact: `fl(a-b)` has the sign of `a-b`.)
 *
 * @param box the engulfing box given as `[[minX, minY], [maxX, maxY]]`
 * @param p the point
 *
 * @internal
 */
function rootIntervalToDistanceSquaredInterval(box, p) {
    const [[minX, minY], [maxX, maxY]] = box;
    const [x, y] = p;
    // per axis gap between `p` and the box (`0` if `p` is within range)
    const dxMin = max(minX - x, 0, x - maxX);
    const dyMin = max(minY - y, 0, y - maxY);
    // per axis distance from `p` to the furthest end of the box's range
    const dxMax = max(x - minX, maxX - x);
    const dyMax = max(y - minY, maxY - y);
    const minDSquared = dxMin * dxMin + dyMin * dyMin;
    const maxDSquared = dxMax * dxMax + dyMax * dyMax;
    return [minDSquared * (1 - WIDEN), maxDSquared * (1 + WIDEN)];
}
export { rootIntervalToDistanceSquaredInterval };
//# sourceMappingURL=root-interval-to-distance-squared-interval.js.map