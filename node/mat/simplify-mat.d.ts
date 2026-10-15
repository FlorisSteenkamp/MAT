import type { Mat } from './mat.js';
/**
 * Returns a new simplified MAT of the given one by replacing the piecewise
 * quad beziers composing the MAT with fewer ones to within a given tolerance.
 *
 * * the vertices of the simplified MAT are a subset of those of the given one
 * (so the endpoints of each new curve are endpoints of existing ones) and all
 * 'special' vertices (leaves, 3-prongs and higher, hole-closers) are kept
 * * each branch is simplified Douglas-Peucker style: the single curve from the
 * start to the end of a span of edges is tried and, if some edge deviates from
 * it by more than the tolerance, the span is split at the vertex of worst
 * deviation and both halves are tried in turn; this is `O(n log n)` (in the
 * number of edges `n` of a branch) Hausdorff distance checks as opposed to the
 * `O(n²)` of greedily extending spans one vertex at a time
 * * the deviation of an edge from the single curve is checked first by cheap
 * sampled *lower* bounds (which already find most splits) and only then by
 * the certified `hausdorffDistanceOneSidedExceeds`
 * * the tolerance is a certified upper bound on the one-sided Hausdorff
 * distance from the original MAT curves to the simplified ones (up to
 * floating point roundoff)
 *
 * @param mat the MAT to simplify (it is not modified)
 * @param hausdorffTolerance the maximum one-sided Hausdorff distance (in
 * coordinate units) from the original to the simplified MAT - defaults to
 * `2**-3`
 * @param hausdorffMargin the width (`> 0`, in coordinate units) of the band
 * just below `hausdorffTolerance` within which a Hausdorff distance check may
 * conservatively fail (so that the span is split rather than accepted) - see
 * `hausdorffDistanceOneSidedExceeds`; defaults to `hausdorffTolerance/1024`;
 * larger values trade simplification quality for less time spent on curves
 * that are only just within tolerance
 */
declare function simplifyMat(mat: Mat, hausdorffTolerance?: number, hausdorffMargin?: number): Mat;
export { simplifyMat };
