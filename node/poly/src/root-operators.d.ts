/**
 * <p>
 * Floating-point-stably calculates and returns the ordered quadratic
 * roots of the given quadratic polynomial.
 * </p>
 * <p>
 * This function is included only because it might be slightly faster
 * than calling allRoots due to allRoots first checking if the
 * polynomial is quadratic and checking if the roots are within the
 * given range.
 * </p>
 * @param p - The 2nd order polynomial
 * @example
 * FloPoly.quadraticRoots([1, -3, 2]); //=> [1,2]
 */
declare function quadraticRoots(p: number[]): number[];
/**
 * Calculates the roots of the given cubic polynomial.
 *
 * This code is mostly from the Pomax guide found at
 * https://pomax.github.io/bezierinfo/#extremities
 *
 * @param p - A cubic polynomial.
 */
/**
 * Returns the number of real roots in the interval (a,b) of the given
 * polynomial.
 * @param p - The polynomial
 * @param a - The lower bound
 * @param b - The upper bound
 * @example
 * let p = [1, 1, -64, 236, -240];
 * FloPoly.numRootsWithin(p,-20,-11); //=> 0
 * FloPoly.numRootsWithin(p,-11,-9);  //=> 1
 * FloPoly.numRootsWithin(p,-11,3.5); //=> 3
 * FloPoly.numRootsWithin(p,-11,5);   //=> 4
 */
declare function numRootsWithin(p: number[], a: number, b: number): number;
/**
 * <p>
 * Searches an interval (a,b) for a root (i.e. zero) of the
 * given function with respect to its first argument using the Bisection
 * Method root-finding algorithm. Any function can be supplied (it does
 * not even have to be continuous) as long as the root is bracketed.
 * </p>
 * <p>
 * Note: This function has no advantages above the Brent method except
 * for its simpler implementation and can be much slower. Use brent
 * instead.
 * </p>
 * @param f - The function for which the root is sought.
 * @param a - The lower limit of the search interval.
 * @param b - The upper limit of the search interval.
 * @example
 * let p = FloPoly.fromRoots([-10,2,3,4]);  //=> [1, 1, -64, 236, -240]
 * let f = FloPoly.evaluate(p);
 * FloPoly.bisection(f,2.2,3.8); //=> 3
 * FloPoly.bisection(f,2.2,3.1); //=> 3.0000000000000044
 */
declare function bisection(f: (n: number) => number, a: number, b: number): number;
/**
 * <p>
 * Searches an interval (a,b) for a root (i.e. zero) of the
 * given function with respect to its first argument using the Brent's
 * Method root-finding algorithm. Any function can be supplied (it does
 * not even have to be continuous) as long as the root is bracketed.
 * </p>
 * <p>
 * Brent's Method is an excellent root-finding choice since it is
 * (1) guaranteed to converge (unlike the Newton and other so-called
 * single-point methods), (2) converges in a reasonable number of
 * iterations even for highly contrived functions (unlike Dekker's
 * Method) and (3) nearly always converges extremely fast, i.e. super-
 * linearly (unlike the Secant and Regula-Falsi methods).
 * </p>
 * <p>
 * The max error, δ, is set equal to 2*Number.EPSILON*Math.abs(b)
 * after each iteration where b is the max of the current 2 best
 * guesses.
 * </p>
 * <p>
 * See <a href="https://en.wikipedia.org/wiki/Brent%27s_method">Wikipedia</a>
 * </p>
 * <p>
 * See <a href="https://maths-people.anu.edu.au/~brent/pd/rpb011i.pdf">Brent (page 47)</a>
 * </p>
 * @param f - The function for which the root is sought.
 * @param a - The lower limit of the search interval.
 * @param b - The upper limit of the search interval.
 * about 1e-15 multiplied by the root magnitued).
 * @example
 * let p = FloPoly.fromRoots([-10,2,3,4]);  //=> [1, 1, -64, 236, -240]
 * let f = FloPoly.evaluate(p);
 * FloPoly.brent(f,2.2,3.8); //=> 3.000000000000003
 * FloPoly.brent(f,2.2,3.1); //=> 3.000000000000001
 */
declare function brent(f: (n: number) => number, a: number, b: number): number;
declare let rootOperators: {
    quadraticRoots: typeof quadraticRoots;
    numRootsWithin: typeof numRootsWithin;
    brent: typeof brent;
    bisection: typeof bisection;
};
export default rootOperators;
