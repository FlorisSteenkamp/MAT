/**
 * Returns the grid-aligned loop derived from the given input loop.
 *
 * Also ensures that:
 * * All points are coerced onto a grid.
 * * All bezier points of a single curve are seperated.
 * @param expMax The exponent, e, such that 2^e > all bezier coordinate points.
 * @param maxBitLength
 */
declare function fixBeziers(expMax: number, maxBitLength: number): (loop: number[][][]) => number[][][];
export { fixBeziers };
