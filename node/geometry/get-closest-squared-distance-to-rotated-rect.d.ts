/**
 * Returns the closest squared distance from the point `p` to the given
 * (rotated) rectangle given by its 4 corners in order, i.e. `0` if `p` is
 * inside the rectangle.
 *
 * @internal
 */
declare function getClosestSquaredDistanceToRotatedRect(ps: number[][], p: number[]): number;
export { getClosestSquaredDistanceToRotatedRect };
