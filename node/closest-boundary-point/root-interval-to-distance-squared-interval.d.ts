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
declare function rootIntervalToDistanceSquaredInterval(box: number[][], p: number[]): number[];
export { rootIntervalToDistanceSquaredInterval };
