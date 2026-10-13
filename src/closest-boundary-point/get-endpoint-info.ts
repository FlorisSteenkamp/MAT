import type { Curve } from "flo-boolean";
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
import { evalDeCasteljauWithErrDd } from 'flo-bezier3';
import { ddDiffDouble } from 'double-double';
import { eps } from '../error-analysis/gamma.js';

const { abs, max } = Math;

/**
 * Relative widening of the interval bounds - see the error analysis in
 * `getEndpointInfoCertified`: the exact first order requirement is `6u = 3eps`
 * (`u = eps/2` the unit roundoff); `4eps = 2**-50` (exactly representable)
 * leaves room for the `O(u²)` terms.
 */
const WIDEN = 4*eps;
/**
 * Absolute slack (relative to `ax² + ay²`) for the lower bound - see the error
 * analysis: the exact first order requirement is `2u² = eps²/2`.
 */
const SLACK = eps*eps;


/**
 * Returns the `FootAndEndpointInfo` of the endpoint at parameter `t` of the
 * given curve, i.e. the certified interval `dSquaredI` guaranteed to contain
 * the squared distance from `x` to the point on the curve at `t` (`t` taken as
 * exact).
 *
 * * the point is kept in double-double precision (including its evaluation
 *   error bound) until the differences with `x` have been taken, so the only
 *   rounding left is that of forming the interval in double precision, which
 *   is accounted for exactly below
 *
 * Error analysis (`u = eps/2` the unit roundoff, `fl(a∘b) = (a∘b)(1+δ)`,
 * `|δ| <= u`): let `a` be the exact magnitude of the double-double difference
 * `dx` and `Δx` the true (exact) difference. Then
 * * `|Δx| ∈ [a(1-ρ) - ex, a(1+ρ) + ex]` with `ρ = 2u²` (the relative error
 *   bound of the double-double minus double subtraction) and `ex` the
 *   evaluation error bound on the coordinate
 * * `ax = |hi(dx)|` satisfies `|ax - a| <= u·ax` (the low part of a
 *   normalized double-double is at most half an ulp of the high part)
 * * the upper bound `(ax+ex)² + (ay+ey)²` is then computed with 3 roundings
 *   (addition, square, sum) and widened with 1 more; it must dominate
 *   `(a(1+ρ)+ex)² + ...` which requires `(1-u)⁴(1+WIDEN) >= (1+u+ρ)²`, i.e.
 *   `WIDEN >= 6u + O(u²)`
 * * the lower bound `(ax-ex)₊² + (ay-ey)₊²` likewise requires
 *   `(1+u)⁴(1-WIDEN) <= (1-u-ρ)²`, i.e. `WIDEN >= 6u + O(u²)`, *except* that
 *   when the true term is `0` (`a <= ex`) rounding may still leave
 *   `ax - ex <= ax·u` positive, giving a spurious `(ax-ex)² <= 2u²·ax²`; this
 *   is covered by subtracting `SLACK·(ax² + ay²)` with `SLACK >= 2u²`
 *
 * @param curve the curve
 * @param x the point from which to check
 * @param t the parameter value of the endpoint
 *
 * @internal
 */
function getEndpointInfoCertified(
        curve: Curve,
        x: number[],
        t: number): FootAndEndpointInfo {

    const { ps } = curve;

    // the point in double-double precision with coordinate-wise absolute
    // error bounds `pE`
    const { p: pDd, pE } = evalDeCasteljauWithErrDd(ps, [0,t]);

    // the coordinate differences in double-double precision
    const dx = ddDiffDouble(pDd[0], x[0]);
    const dy = ddDiffDouble(pDd[1], x[1]);

    const ax = abs(dx[1]);
    const ay = abs(dy[1]);
    const [ex, ey] = pE;

    const lo = max(ax - ex, 0)**2 + max(ay - ey, 0)**2;
    const hi = (ax + ex)**2 + (ay + ey)**2;

    const dSquaredI = [
        max(lo*(1 - WIDEN) - SLACK*(ax*ax + ay*ay), 0),
        hi*(1 + WIDEN)
    ];

    const t_ = t === 0 ? 1 : t;
    const curve_ = t === 0 ? curve.prev : curve;

    return {
        curve: curve_,
        t: t_,
        dSquaredI
    }
}


export { getEndpointInfoCertified }
