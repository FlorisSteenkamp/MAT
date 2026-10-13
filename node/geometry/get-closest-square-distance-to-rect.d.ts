/**
 * Returns the closest squared distance from the point `p` to the given
 * axis-aligned box `[[minX, minY], [maxX, maxY]]`, i.e. `0` if `p` is inside.
 *
 * @internal
 */
declare function getClosestSquareDistanceToRect(box: number[][], p: number[]): number;
export { getClosestSquareDistanceToRect };
