/**
 * Returns the distance interval squared given the root interval (currently
 * ignoring multiplicity).
 *
 * * the result is returned as `[minPossibleSquared, maxPossibleSquared]` distance.
 *
 * @param box
 * @param p
 *
 * @internal
 */
declare function rootIntervalToDistanceSquaredInterval(pow: number, box: number[][], p: number[]): number[];
export { rootIntervalToDistanceSquaredInterval };
