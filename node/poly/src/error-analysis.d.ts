/**
 * <p>
 * Classic rule of thumb approximate error bound when using Horner's
 * method to evaluate polynomials.
 * </p>
 * <p>
 * See for instance <a href="http://www-pequan.lip6.fr/~jmc/polycopies/Compensation-horner.pdf">compensated horner evaluation</a>
 * </p>
 * @param p - The polynomial
 * @param x - Value at which polynomial is evaluated.
  * @example
 * hornerErrorBound([1.1,2.2,-3.3], 1.5); //=> 5.1292303737682235e-15
 */
declare function hornerErrorBound(p: number[], x: number): number;
declare let errorAnalysis: {
    hornerErrorBound: typeof hornerErrorBound;
};
export default errorAnalysis;
