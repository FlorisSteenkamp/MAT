import type { Mat } from './mat.js';
import type { MatMeta } from './mat-meta.js';
import type { CpNode } from '../cp-node/cp-node.js';
import { evalDeCasteljau } from 'flo-bezier3';
import { removeVertex } from '../vertex/remove-vertex.js';
import { getBranches } from './get-branches.js';
import { getMatCurveToNext } from '../cp-node/fs/get-mat-curve-to-next.js';
import { getMatCurveBetween } from '../cp-node/fs/get-mat-curve-between.js';
import { createNewCpTrees } from './create-new-cp-trees.js';
import { clone } from '../cp-node/fs/clone.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
import { isSpecial } from '../cp-node/fs/is-special.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
import { distanceToCurves, hausdorffDistanceOneSidedExceeds } from './hausdorff-distance-one-sided-exceeds.js';

const { abs } = Math;


/**
 * Spans of at least this many edges whose worst vertex lies within
 * `END_FRACTION` of either end are additionally split at their middle - this
 * guards against the degenerate case where each split peels off only a few
 * edges at an end (making the recursion depth, and the total work, quadratic
 * in the branch length) at the cost of at most one extra curve per occurrence.
 *
 * @internal
 */
const MIN_EDGES_FOR_BALANCED_SPLIT = 32;
/** @internal */
const END_FRACTION = 1/8;


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
function simplifyMat(
        mat: Mat,
        hausdorffTolerance = 2**-3,
        hausdorffMargin = hausdorffTolerance/1024): Mat {

    let cpNode = clone(mat.cpNode);
    // The clone gets its own `cpTrees` (removing vertices below must not
    // touch the trees of the given `mat`) - they are kept up to date by
    // `removeVertex`.
    const meta: MatMeta = { ...mat.meta, cpTrees: createNewCpTrees(cpNode) };

    // Start from a leaf (which is never removed so it can be returned)
    while (!isTerminating(cpNode)) { cpNode = cpNode.next; }

    const branches = getBranches(cpNode);

    const toRemove: CpNode[] = [];
    for (let k=0; k<branches.length; k++) {
        simplifyBranch(branches[k], hausdorffTolerance, hausdorffMargin, toRemove);
    }

    for (const cpNode of toRemove) {
        removeVertex(cpNode, meta);
    }

    return { cpNode, meta };
}


/**
 * Simplifies the given branch by adding the `CpNode`s of the vertices that
 * can be removed to `toRemove`.
 *
 * * edge `k` of the branch runs from `branch[k]` to `branch[k].next`; vertex
 * `k` (for `0 < k < branch.length`) is the interior vertex `branch[k]` between
 * edges `k-1` and `k`
 * * a span of edges `i..j` is simplified to the single curve from the start
 * of edge `i` to the end of edge `j`, removing the interior vertices `i+1..j`
 *
 * @internal
 */
function simplifyBranch(
        branch: CpNode[],
        tolerance: number,
        margin: number,
        toRemove: CpNode[]): void {

    const n = branch.length;  // the number of edges
    if (n < 2) { return; }

    // the MAT curves of the edges of the branch - computed once per branch
    const curves = branch.map(getMatCurveToNext);
    const vertexPoints = branch.map(cpNode => cpNode.pointOnShape.circle.center);

    // The spans still to be processed; interior vertices that cannot be
    // removed must be kept so the branch is pre-split there: the 'special'
    // ones (e.g. hole-closers) and those whose circle carries more than 2
    // `CpNode`s (e.g. a 2-prong having a terminating sharp corner contact,
    // which `getBranch` passes through but `removeVertex` cannot remove).
    const spans: [number,number][] = [];
    let a = 0;
    for (let k=1; k<n; k++) {
        if (isSpecial(branch[k]) || getProngCount(branch[k]) !== 2) {
            spans.push([a, k-1]);
            a = k;
        }
    }
    spans.push([a, n-1]);

    while (spans.length > 0) {
        const [i, j] = spans.pop()!;
        if (j <= i) { continue; }  // a single edge - nothing to remove

        const longCurves = getMatCurveBetween(branch[i], branch[j].next);

        //------------------------------------------------------------------
        // 1. Cheap pass: sampled lower bounds on the deviation of each edge -
        //    the interior vertices and the piece midpoints.
        //------------------------------------------------------------------
        let worstD = 0;
        let worstV = -1;
        for (let k=i; k<=j; k++) {
            if (k > i) {
                const d = distanceToCurves(vertexPoints[k], longCurves);
                if (d > worstD) { worstD = d; worstV = k; }
            }
            const pieces = curves[k];
            for (let m=0; m<pieces.length; m++) {
                const d = distanceToCurves(evalDeCasteljau(pieces[m], 0.5), longCurves);
                if (d > worstD) {
                    worstD = d;
                    worstV = getSplitVertexForEdge(i, j, k, m, pieces.length);
                }
            }
        }

        if (worstD > tolerance) {
            split(spans, i, j, worstV);
            continue;
        }

        //------------------------------------------------------------------
        // 2. Certified pass - split at the first edge found to exceed the
        //    tolerance.
        //------------------------------------------------------------------
        let splitV = -1;
        outer: for (let k=i; k<=j; k++) {
            const pieces = curves[k];
            for (let m=0; m<pieces.length; m++) {
                if (hausdorffDistanceOneSidedExceeds(pieces[m], longCurves, tolerance, margin)) {
                    splitV = getSplitVertexForEdge(i, j, k, m, pieces.length);
                    break outer;
                }
            }
        }

        if (splitV !== -1) {
            split(spans, i, j, splitV);
            continue;
        }

        //------------------------------------------------------------------
        // 3. Accept the span.
        //------------------------------------------------------------------
        for (let k=i+1; k<=j; k++) {
            toRemove.push(branch[k]);
        }
    }
}


/**
 * Returns the vertex (in `(i,j]`) at which to split the span of edges `i..j`
 * given that piece `m` (of `numPieces`) of edge `k` deviates too much: one of
 * the edge's two endpoint vertices - the one on the side of the piece if the
 * edge has 2 pieces, else the one nearer the middle of the span (for a more
 * balanced recursion).
 *
 * @internal
 */
function getSplitVertexForEdge(
        i: number,
        j: number,
        k: number,
        m: number,
        numPieces: number): number {

    const canUseStart = k > i;
    const canUseEnd = k + 1 <= j;

    if (!canUseStart) { return k + 1; }
    if (!canUseEnd) { return k; }

    if (numPieces === 2) {
        return m === 0 ? k : k + 1;
    }

    const mid = (i + 1 + j)/2;  // middle of the interior vertices `i+1..j`

    return abs(k - mid) <= abs(k + 1 - mid) ? k : k + 1;
}


/**
 * Splits the span of edges `i..j` at the vertex `v` (in `(i,j]`) and pushes
 * the resulting spans (for very long spans with `v` near an end also split at
 * the middle - see `MIN_EDGES_FOR_BALANCED_SPLIT`).
 *
 * @internal
 */
function split(
        spans: [number,number][],
        i: number,
        j: number,
        v: number): void {

    const numEdges = j - i + 1;
    if (numEdges >= MIN_EDGES_FOR_BALANCED_SPLIT) {
        const margin = numEdges*END_FRACTION;
        if (v - i < margin || j + 1 - v < margin) {
            const vMid = (i + j + 1) >>> 1;  // an interior vertex near the middle
            const [v1, v2] = v < vMid ? [v, vMid] : [vMid, v];
            spans.push([v2, j], [v1, v2-1], [i, v1-1]);
            return;
        }
    }

    spans.push([v, j], [i, v-1]);
}


export { simplifyMat }
