/**
 * Returns true if two polynomials are exactly equal by comparing
 * coefficients.
 * @param p1 - A polynomial
 * @param p2 - Another polynomial
 * @example
 * FloPoly.equal([1,2,3,4], [1,2,3,4]);   //=> true
 * FloPoly.equal([1,2,3,4], [1,2,3,4,5]); //=> false
 */
declare function equal(p1: number[], p2: number[]): boolean;
/**
 * Adds two polynomials.
 * @param p1 - The first polynomial
 * @param p2 - The second polynomial
 * @example
 * FloPoly.add([1,2,3],[3,4]); //=> [1,5,7]
 */
declare function add(p1: number[], p2: number[]): number[];
/**
 * Subtracts the second polynomial from first (p1 - p2).
 * @param p1 - The polynomial from which will be subtracted
 * @param p2 - The polynomial that will be subtracted
 * @example
 * FloPoly.subtract([2,3],[4,4]); //=> [-2, -1]
 */
declare function subtract(p1: number[], p2: number[]): number[];
/**
 * Negate the given polynomial (p -> -p).
 * @param p - The polynomial
 * @example
 * FloPoly.negate([0.1, -0.2]); //=> [-0.1, 0.2]
 */
declare function negate(p: number[]): number[];
/**
 * Differentiates the given polynomial.
 * @param p - The polynomial
 * @example
 * FloPoly.differentiate([5, 4, 3, 2, 1]); //=> [20, 12, 6, 2]
 */
declare function differentiate(p: number[]): number[];
/**
 * <p>
 * Multiplies the two given polynomials and returns the result.
 * </p>
 * <p>
 * See <a href="https://en.wikipedia.org/wiki/Polynomial_arithmetic">polynomial arithmetic</a>
 * </p>
 * <p>
 * See <a href="https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Polynomial_multiplication">polynomial multiplication</a>
 * </p>
 * <p>
 * See <a herf="http://web.cs.iastate.edu/~cs577/handouts/polymultiply.pdf">polynomial multiplication (pdf)</a>
 * </p>
 * @param p1 - The one polynomial.
 * @param p2 - The other polynomial.
 * @example
 * FloPoly.multiply([1,2,3], [2,5,3,5]); //=> [2, 9, 19, 26, 19, 15]
 */
declare function multiply(p1: number[], p2: number[]): number[];
/**
 * Multiplies 2 polynomials by a constant.
 * @param c - The constant
 * @param p - The polynomial
 * @example
 * FloPoly.multiplyByConst(0.25, [3,2,1]); //=> [0.75, 0.5, 0.25]
 */
declare function multiplyByConst(c: number, p: number[]): number[];
/**
 * Returns the degree of the polynomial.
 * @param p - The polynomial
 * @example
 * FloPoly.degree([9,8,7,6,5,4,3,2,1]); //=> 9
 */
declare function degree(p: number[]): number;
/**
 * Evaluates a univariate polynomial using Horner's method. This
 * function is curried (see examples below).
 * See https://en.wikipedia.org/wiki/Horner%27s_method
 * @param p - The polynomial
 * @param a - The value at which to evaluate the polynomial.
 * @example
 * let ev = FloPoly.evaluate([3,2,1]);
 * ev(1); // => 6
 * ev(2); // => 17
 *
 * FloPoly.evaluate([3,2,1], 1); // => 6
 * FloPoly.evaluate([3,2,1], 2); // => 17
 *
 * FloPoly.evaluate([3,2,1])(1); // => 6
 * FloPoly.evaluate([3,2,1])(2); // => 17
 */
declare function evaluate(p: number[], a: number): number;
declare function evaluate(p: number[]): (a: number) => number;
/**
 * Evaluates the given polynomial at 0 - it is much faster than at an
 * arbitrary point.
 * @param p - The polynomial
 * @example
 * FloPoly.evaluateAt0([3,2,99]); //=> 99
 */
declare function evaluateAt0(p: number[]): number;
/**
 * <p>
 * Returns the number of sign changes in the polynomial coefficents
 * when ordered in descending order; zeros are ignored.
 * </p>
 * <p>
 * Descartes' rule of signs states (quoted from Wikipedia):
 * "if the terms of a polynomial are ordered by descending variable
 * exponent, then the number of positive roots of the polynomial is
 * either equal to the number of sign differences between consecutive
 * nonzero coefficients, or is less than it by an even number. Multiple
 * roots of the same value are counted separately."
 * </p>
 * See https://en.wikipedia.org/wiki/Descartes%27_rule_of_signs
 * @param p - The polynomial
 * @example
 * FloPoly.signChanges([1,2,-3,0,0,3,-1]); //=> 3
 */
declare function signChanges(p: number[]): number;
/**
 * Deflates the given polynomial by removing a factor (x - r), where
 * r is a root of the polynomial.
 * @param p - The polynomial
 * @param root - A pre-calculated root of the polynomial.
 * @example
 * // The polynomial x^3 - 5x^2 + 8x - 4 has a root at 1 and a double root at 2
 * FloPoly.deflate([1, -5, 8, -4], 2); //=> [1, -3, 2]
 * FloPoly.deflate([1, -3, 2], 2);     //=> [1,-1]
 * FloPoly.deflate([1, -1], 1);        //=> [1]
 */
declare function deflate(p: number[], root: number): number[];
/**
 * Inverts the given polynomial by reversing the order of the
 * coefficients, i.e. p(x) -> x^deg(p) * p(1/x)
 * @param p - The polynomial
 * @example
 * FloPoly.invert([1,2,3,4]); // => [4,3,2,1]
 * FloPoly.invert([3,2,-5]);  // => [-5,2,3]
 */
declare function invert(p: number[]): number[];
/**
 * <p>
 * Performs a change of variables of the form: p(x) <- p(ax + b).
 * </p>
 * <p>
 * See <a href="http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system">this stackoverflow question</a>
 * </p>
 * @param p - The polynomial
 * @param a
 * @param b
 * @example
 * FloPoly.changeVariables([1,2,7], 3, 4); //=> [9, 30, 31]
 */
declare function changeVariables(p: number[], a: number, b: number): number[];
/**
 * Reflects the given polynomial about the Y-axis, i.e. perform the
 * change of variables: p(x) <- p(-x).
 * @param p - The polynomial to reflect
 * @example
 * FloPoly.reflectAboutYAxis([5,4,3,2,1]); //=> [5, -4, 3, -2, 1]
 */
declare function reflectAboutYAxis(p: number[]): number[];
/**
 * Generates a sturm chain for the given polynomial.
 * See https://en.wikipedia.org/wiki/Sturm%27s_theorem
 * @param p - The polynomial
 * @example
 * FloPoly.sturmChain([-3,4,2,-2]); //=> [[-3, 4, 2, -2], [-9, 8, 2], [-2.5185185185185186, 1.7037037037037037], [-3.2932525951557086]]
 */
declare function sturmChain(p: number[]): number[][];
/**
 * If the highest power coefficient is small in the sense that the
 * highest power term has a negligible contribution (compared to the
 * other terms) at x = 1 then clip() can be called to remove all such
 * highest terms. A contribution of less than Number.EPSILON of the
 * highest coefficient will be considered negligible by default.
 * @param p - The polynomial to be clipped.
 * @param δ - The optional contribution tolerence else
 *        Number.EPSILON will be used by default.
 * @example
 * FloPoly.clip([1e-18, 1e-10, 1e-5]); //=> [1e-18, 1e-10, 1e-5]
 * FloPoly.clip([1e-18, 1e-10, 1e-1]); //=> [1e-10, 1e-1]
 */
declare function clip(p: number[], δ: number): number[];
/**
 * If the highest power coefficient is 0 then clip() can be called to
 * remove all such highest terms so that the array is a valid
 * presentation of a polynomial.
 * @param p - The polynomial to be clipped.
 * @example
 * FloPoly.clip0([1e-18, 1e-10, 1e-1]); //=> [1e-18, 1e-10, 1e-1]
 * FloPoly.clip0([0, 1e-10, 1e-1]); //=> [1e-10, 1e-1]
 */
declare function clip0(p: number[]): number[];
/**
 * Returns the absolute value of the highest coefficient of the polynomial.
 * @param p - The polynomial.
 * @example
 * FloPoly.maxCoefficient([-2, 0.1, 0.2]); //=> 2
 */
declare function maxCoefficient(p: number[]): number;
/**
 * Returns a string representing the given polynomial that is readable
 * by a human or a CAS (Computer Algebra System).
 * @param p - The polynomial
 * @example
 * FloPoly.toCasStr([5,4,3,2,1]); //=> "x^4*5 + x^3*4 + x^2*3 + x*2 + 1"
 */
declare function toCasStr(p: number[]): string;
declare let coreOperators: {
    equal: typeof equal;
    add: typeof add;
    subtract: typeof subtract;
    multiplyByConst: typeof multiplyByConst;
    negate: typeof negate;
    differentiate: typeof differentiate;
    multiply: typeof multiply;
    degree: typeof degree;
    evaluate: typeof evaluate;
    evaluateAt0: typeof evaluateAt0;
    signChanges: typeof signChanges;
    invert: typeof invert;
    changeVariables: typeof changeVariables;
    reflectAboutYAxis: typeof reflectAboutYAxis;
    sturmChain: typeof sturmChain;
    clip: typeof clip;
    clip0: typeof clip0;
    deflate: typeof deflate;
    maxCoefficient: typeof maxCoefficient;
    toCasStr: typeof toCasStr;
};
export default coreOperators;
