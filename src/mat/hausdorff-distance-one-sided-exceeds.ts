import { closestPointOnBezier, controlPointLinesLength, evalDeCasteljau, fromTo } from 'flo-bezier3';

const { max, sqrt } = Math;


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
function closestPointOnCurves(
        p: number[],
        curves: number[][][]): Foot {

    let best: Foot = { d: Infinity, q: p, k: 0, t: 0 };
    for (let k=0; k<curves.length; k++) {
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
function distanceToCurves(
        p: number[],
        curves: number[][][]): number {

    return closestPointOnCurves(p, curves).d;
}


/**
 * Evaluates the bezier curve `ps` (of order 1, 2 or 3) and its first two
 * derivatives at `t`, returned as `[B, B', B'']`.
 *
 * @internal
 */
function evalWithDerivatives(
        ps: number[][],
        t: number): [number[], number[], number[]] {

    const [p0, p1] = ps;

    if (ps.length === 2) {
        return [
            [p0[0] + t*(p1[0] - p0[0]), p0[1] + t*(p1[1] - p0[1])],
            [p1[0] - p0[0], p1[1] - p0[1]],
            [0, 0]
        ];
    }

    const s = 1 - t;

    if (ps.length === 3) {
        const p2 = ps[2];
        return [
            [s*s*p0[0] + 2*s*t*p1[0] + t*t*p2[0],
             s*s*p0[1] + 2*s*t*p1[1] + t*t*p2[1]],
            [2*(s*(p1[0] - p0[0]) + t*(p2[0] - p1[0])),
             2*(s*(p1[1] - p0[1]) + t*(p2[1] - p1[1]))],
            [2*(p2[0] - 2*p1[0] + p0[0]),
             2*(p2[1] - 2*p1[1] + p0[1])]
        ];
    }

    const p2 = ps[2];
    const p3 = ps[3];
    return [
        [s*s*s*p0[0] + 3*s*s*t*p1[0] + 3*s*t*t*p2[0] + t*t*t*p3[0],
         s*s*s*p0[1] + 3*s*s*t*p1[1] + 3*s*t*t*p2[1] + t*t*t*p3[1]],
        [3*(s*s*(p1[0] - p0[0]) + 2*s*t*(p2[0] - p1[0]) + t*t*(p3[0] - p2[0])),
         3*(s*s*(p1[1] - p0[1]) + 2*s*t*(p2[1] - p1[1]) + t*t*(p3[1] - p2[1]))],
        [6*(s*(p2[0] - 2*p1[0] + p0[0]) + t*(p3[0] - 2*p2[0] + p1[0])),
         6*(s*(p2[1] - 2*p1[1] + p0[1]) + t*(p3[1] - 2*p2[1] + p1[1]))]
    ];
}


/**
 * Returns a point on piece `k` of `curves` close to `p` found by a few Newton
 * iterations on the squared distance starting from parameter `t0`, as a
 * `Foot`.
 *
 * * the returned distance is thus an *upper bound* on the distance from `p`
 * to the piecewise curve (any point on the curve gives one) - it is not
 * certified to be the minimum
 *
 * @internal
 */
function newtonFoot(
        p: number[],
        curves: number[][][],
        k: number,
        t0: number): Foot {

    const ps = curves[k];
    if (ps.length === 1) {
        const q = ps[0];
        return { d: sqrt((q[0] - p[0])**2 + (q[1] - p[1])**2), q, k, t: 0 };
    }

    let t = t0;
    let [q, dq, ddq] = evalWithDerivatives(ps, t);
    let rx = q[0] - p[0];
    let ry = q[1] - p[1];
    let best: Foot = { d: sqrt(rx*rx + ry*ry), q, k, t };

    for (let i=0; i<4; i++) {
        // minimize g(t) = |B(t) - p|²/2: g' = r·B', g'' = B'·B' + r·B''
        const g1 = rx*dq[0] + ry*dq[1];
        const g2 = dq[0]*dq[0] + dq[1]*dq[1] + rx*ddq[0] + ry*ddq[1];
        if (g2 <= 0) { break; }

        let t_ = t - g1/g2;
        if (t_ < 0) { t_ = 0; } else if (t_ > 1) { t_ = 1; }
        if (t_ === t) { break; }
        t = t_;

        [q, dq, ddq] = evalWithDerivatives(ps, t);
        rx = q[0] - p[0];
        ry = q[1] - p[1];
        const d = sqrt(rx*rx + ry*ry);
        if (d < best.d) { best = { d, q, k, t }; }
    }

    return best;
}


/**
 * Returns the maximum distance from the point `q` to the control points of
 * `ps` - an upper bound on the distance from `q` to any point on the bezier
 * curve `ps` (which lies within the convex hull of its control points).
 *
 * @internal
 */
function maxDistanceToControlPoints(
        ps: number[][],
        q: number[]): number {

    let m = 0;
    for (let i=0; i<ps.length; i++) {
        const c = ps[i];
        const dd = (c[0] - q[0])**2 + (c[1] - q[1])**2;
        if (dd > m) { m = dd; }
    }

    return sqrt(m);
}


/**
 * An interval `[tS,tE]` of the parameter of the 'from' curve together with
 * the feet (on the 'to' curve) of its endpoints.
 *
 * @internal
 */
interface Interval {
    tS: number;
    tE: number;
    fS: Foot;
    fE: Foot;
}


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
function hausdorffDistanceOneSidedExceeds(
        A: number[][],
        B: number[][][],
        tolerance: number,
        maxIterations = 1000): boolean {

    const fS = closestPointOnCurves(A[0], B);
    if (fS.d > tolerance) { return true; }
    const fE = closestPointOnCurves(A[A.length - 1], B);
    if (fE.d > tolerance) { return true; }

    if (A.length <= 2) {
        // A point or a line: if `B` is a single line (a convex set) the
        // distance is convex along `A` and thus maximal at an endpoint.
        if (A.length === 1 || (B.length === 1 && B[0].length <= 2)) {
            return false;
        }
    }

    // Depth first; the stack never holds more than about `2*log2(iterations)`
    // intervals.
    const stack: Interval[] = [{ tS: 0, tE: 1, fS, fE }];
    let iterations = 0;
    while (stack.length > 0) {
        const { tS, tE, fS, fE } = stack.pop()!;

        const ps = tS === 0 && tE === 1 ? A : fromTo(A, tS, tE);

        // the entire interval is certified within tolerance if either upper
        // bound says so
        if ((fS.d + fE.d + controlPointLinesLength(ps))/2 <= tolerance) {
            continue;
        }
        if (maxDistanceToControlPoints(ps, fS.q) <= tolerance ||
            maxDistanceToControlPoints(ps, fE.q) <= tolerance) {
            continue;
        }

        if (iterations++ >= maxIterations) {
            return true;  // undecided - be conservative
        }

        const tM = (tS + tE)/2;
        const pM = evalDeCasteljau(A, tM);

        // a cheap upper bound on the distance from `pM` to `B` - by Newton
        // iteration from the feet of the endpoints
        let fM = newtonFoot(pM, B, fS.k, fS.k === fE.k ? (fS.t + fE.t)/2 : fS.t);
        if (fS.k !== fE.k) {
            const fM_ = newtonFoot(pM, B, fE.k, fE.t);
            if (fM_.d < fM.d) { fM = fM_; }
        }

        if (fM.d > tolerance) {
            // possibly exceeds - now get the certified closest point
            fM = closestPointOnCurves(pM, B);
            if (fM.d > tolerance) { return true; }
        }

        // push the half with the larger lower bound last so it is tried first
        if (max(fS.d, fM.d) >= max(fM.d, fE.d)) {
            stack.push({ tS: tM, tE, fS: fM, fE });
            stack.push({ tS, tE: tM, fS, fE: fM });
        } else {
            stack.push({ tS, tE: tM, fS, fE: fM });
            stack.push({ tS: tM, tE, fS: fM, fE });
        }
    }

    return false;
}


export { hausdorffDistanceOneSidedExceeds, distanceToCurves, closestPointOnCurves }
