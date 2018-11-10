/**
 * <p>Finds a near optimal approximation to the real roots (or those
 * within a range) of the input polynomial.
 * </p>
 * <p>
 * Only multiple roots of even order that is very close together may be
 * missed. (This is rarely a problem in practice - in a geometrical
 * application, for instance, this may mean two objects are barely
 * touching and returning either, all, or none of the repeated even
 * roots should not break the algorithm).
 * </p>
 * @param p - The polynomial
 * @param a - Lower limit of root values that should be returned -
 * defaults to -∞
 * @param b - Upper limit of root values that should be returned -
 * defaults to +∞
 * @example
 * FloPoly.allRoots([1, -10, 35, -50, 24]); //=> [1, 2.0000000000000036, 3.0000000000000067, 4]
 */
declare function allRoots(p: number[], a?: number, b?: number): number[];
export default allRoots;
