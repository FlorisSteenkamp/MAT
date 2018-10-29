/**
 * Return the given two beziers but translated such that the shorter (by
 * some length measure) is closer to the origin.
 * @private
 * @param P
 * @param Q
 */
declare function center(P: number[][], Q: number[][]): number[][][];
export { center };
