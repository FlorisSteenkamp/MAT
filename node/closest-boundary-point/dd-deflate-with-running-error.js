// TODO - import from `flo-poly` in the future
import { ddMultDouble2 } from "double-double";
import { ddAddDd } from "double-double";
import { γγ } from '../error-analysis/gamma.js';
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const qmd = ddMultDouble2;
const qaq = ddAddDd;
const { abs } = Math;
const γγ3 = γγ(3);
/**
 * Deflates the given polynomial *approximately* by removing a factor (x - t).
 *
 * @param p a polynomial with coefficients given densely as an array of
 * double-double precision floating point numbers from highest to lowest power,
 * e.g. `[[0,5],[0,-3],[0,0]]` represents the polynomial `5x^2 - 3x`
 * @param pE the coefficient-wise absolute error of the input polynomial that
 * still need to be multiplied by γγ3, i.e. it is `γγ3` times too big.
 * @param t an evaluation point of the polynomial.
 *
 * @example
 * ```typescript
 * // The polynomial x^3 - 5x^2 + 8x - 4 has a root at 1 and a double root at 2
 * ddDeflate([[0,1], [0,-5], [0,8], [0,-4]], [0,2]); //=> [[0,1], [0,-3], [0,2]]
 * ddDeflate([[0,1], [0,-3], [0,2], [0,2]);          //=> [[0,1], [0,-1]]
 * ddDeflate([[0,1], [0,-1]], [0,1]);                //=> [[0,1]]
 * ```
 *
 * @doc
 */
function ddDeflateWithRunningError(p, pE, t) {
    //--------------------------------------------------------------------------
    // `var` -> a variable
    // `$var` -> the double precision approximation to `var`
    // `_var` -> the absolute value of $var (a prefix underscore on a variable means absolute value)
    // `var_` -> the error in var (a postfix underscore means error bound but should still be multiplied by 3*γ²)
    // `_var_` -> means both absolute value and absolute error bound
    // recall: `a*b`, where both `a` and `b` have errors |a| and |b| we get for the
    //   * error bound of (a*b) === a_|b| + |a|b_ + |a*b|   (when either of a and b is double)
    //   * error bound of (a*b) === a_|b| + |a|b_ + 2|a*b|  (when both a and b is double-double)
    //   * error bound of (a+b) === a_ + b_ + |a+b|         (when a and/or b is double or double-double)
    // * the returned errors need to be multiplied by 3γ² to get the true error
    // * can use either `$var` or `var[var.length-1]` (the approx value) in error calculations
    //   due to multiplication by 3*γ² and not 3*u²
    //--------------------------------------------------------------------------
    const d = p.length - 1;
    const bs = [p[0]]; // coefficients
    let b_ = pE[0]; // running error
    const bEs = [b_]; // coefficient-wise error bound
    for (let i = 1; i < d; i++) {
        // p[i] + t*bs[i-1];
        const a = bs[i - 1];
        const $m = t * a[1];
        const _t = abs(t);
        const m_ = _t * b_ + abs($m);
        const pi = p[i];
        const p_ = pE[i];
        b_ = p_ + m_ + abs(pi[1] + $m);
        const b = qaq(pi, qmd(t, a));
        bs.push(b);
        bEs.push(b_);
    }
    return {
        coeffs: bs,
        errBound: bEs.map(e => γγ3 * e)
    };
}
export { ddDeflateWithRunningError };
//# sourceMappingURL=dd-deflate-with-running-error.js.map