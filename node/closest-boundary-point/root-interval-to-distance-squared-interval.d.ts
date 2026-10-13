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
declare function rootIntervalToDistanceSquaredInterval(box: number[][], p: number[]): number[];
export { rootIntervalToDistanceSquaredInterval };
