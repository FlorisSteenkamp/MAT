/**
 * Generates a random polynomial with roots picked from a bounded flat
 * distribution (i.e. a rectangular distribution) with specified odds of
 * duplication of consecutive values. Note that the resulting polynomial
 * won't have any complex roots.
 * @memberof Random
 * @param d - The degree of the polynomials
 * @param a - The lower bound of the distribution - defaults
 * to 0
 * @param b - The upper bound of the distribution - defaults
 * to 1
 * @param seed - A seed value for generating random values (so
 * that the results are reproducable)
 * @param odds - The odds that a root will be doubled (applied
 * recursively so that some roots will be tripled, etc. - defaults to 0
 * @example
 * FloPoly.Random.flatRoots(3,0,10); //=> { p: [1, -17.27247918024659, 97.33487287168995, -179.34094494147305], seed: 939629312 }
 */
declare function flatRoots(d: number, a?: number, b?: number, seed?: number, odds?: number): {
    p: number[];
    seed: number;
};
/**
 * Generates a random polynomial with coefficients picked from a bounded
 * flat distribution (i.e. a rectangular distribution).
 * @memberof Random
 * @param d - The degree of the polynomials
 * @param a - The lower bound of the distribution - defaults to -1
 * @param b - The upper bound of the distribution - defaults to 1
 * @param seed - A seed value for generating random values (so that the results
 * are reproducable)
 * @example
 * FloPoly.Random.flatCoefficients(3,-5,5); //=> { p: [0.437291506677866, -0.5087333917617798, 2.3439210653305054], seed: 939629312 }
 */
declare function flatCoefficients(d: number, a?: number, b?: number, seed?: number): {
    p: number[];
    seed: number;
};
declare let random: {
    flatRoots: typeof flatRoots;
    flatRootsArr: (n: number, d: number, a: number, b: number, seed: number, odds: number) => number[][];
    flatCoefficients: typeof flatCoefficients;
    flatCoefficientsArr: (n: number, d: number, a: number, b: number, seed: number, odds: number) => number[][];
};
export default random;
