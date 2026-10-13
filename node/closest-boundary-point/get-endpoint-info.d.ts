import type { Curve } from "flo-boolean";
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
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
declare function getEndpointInfoCertified(curve: Curve, x: number[], t: number): FootAndEndpointInfo;
export { getEndpointInfoCertified };
