/**
 * Finds an upper bound on the magnitude (absolute value) of the roots
 * (including complex roots) of the given polynomial using Rouche's
 * Theorem with k = n. This function is fast but the bound is not tight.
 * @param p - The polynomial.
 */
declare function rootMagnitudeUpperBound_rouche(p: number[]): number;
/**
 * Finds an upper bound on the magnitude (absolute value) of the roots
 * of the given polynomial using the near-optimal Fujiwara bound. Note
 * that the bound includes complex roots. The bound is tight but slow
 * due to usage of Math.pow().
 * See https://en.wikipedia.org/wiki/Properties_of_polynomial_roots#cite_note-Fujiwara1916-4
 * @param p - The polynomial.
 * @example
 * FloPoly.rootMagnitudeUpperBound_fujiwara([2,-3,6,5,-130]); //=> 6.753296750770361
 * FloPoly.allRoots([2,-3,6,5,-130]); //=> [-2.397918624065303, 2.8793785310848383]
 */
declare function rootMagnitudeUpperBound_fujiwara(p: number[]): number;
/**
 * <p>
 * Returns an upper bound for the positive real roots of the given
 * polynomial.
 * </p>
 * <p>
 * See algoritm 6 of the paper by Vigklas, Akritas and Strzeboński,
 * specifically the LocalMaxQuadratic algorithm hence LMQ.
 * </p>
 * @param p - The polynomial
 * @example
 * FloPoly.positiveRootUpperBound_LMQ([2,-3,6,5,-130]); //=> 4.015534272870436
 * FloPoly.positiveRootUpperBound_LMQ([2,3]);           //=> 0
 * FloPoly.positiveRootUpperBound_LMQ([-2,-3,-4]);      //=> 0
 */
declare function positiveRootUpperBound_LMQ(p: number[]): number;
/**
 * <p>
 * Calculates a lower bound for the positive roots of the given
 * polynomial.
 * </p>
 * <p>
 * See algoritm 6 of the paper by Vigklas, Akritas and Strzeboński,
 * specifically the LocalMaxQuadratic algorithm hence LMQ.
 * </p>
 * @param p - The polynomial
 * @example
 * FloPoly.positiveRootLowerBound_LMQ([2,-3,6,5,-130]); //=> 1.6883241876925903
 * FloPoly.positiveRootLowerBound_LMQ([2,3]);           //=> 0
 * FloPoly.positiveRootLowerBound_LMQ([-2,-3,-4]);      //=> 0
 */
declare function positiveRootLowerBound_LMQ(p: number[]): number;
/**
 * See positiveRootUpperBound_LMQ
 *
 * @param p - The polynomial
 * @returns {number} An upper bound.
 */
declare function negativeRootUpperBound_LMQ(p: number[]): number;
/**
 * See positiveRootLowerBound_LMQ
 *
 * @param p - The polynomial
 * @returns {number} A lower bound.
 */
declare function negativeRootLowerBound_LMQ(p: number[]): number;
declare let rootBounds: {
    rootMagnitudeUpperBound_fujiwara: typeof rootMagnitudeUpperBound_fujiwara;
    positiveRootUpperBound_LMQ: typeof positiveRootUpperBound_LMQ;
    positiveRootLowerBound_LMQ: typeof positiveRootLowerBound_LMQ;
    negativeRootUpperBound_LMQ: typeof negativeRootUpperBound_LMQ;
    negativeRootLowerBound_LMQ: typeof negativeRootLowerBound_LMQ;
    rootMagnitudeUpperBound_rouche: typeof rootMagnitudeUpperBound_rouche;
};
export default rootBounds;
