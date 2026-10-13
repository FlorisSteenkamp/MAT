import { squaredDistanceBetweenPointAndLineSegment, squaredDistanceBetween } from 'flo-vector2d';
const { min } = Math;
/**
 * Returns the closest squared distance from the point `p` to the given
 * (rotated) rectangle given by its 4 corners in order, i.e. `0` if `p` is
 * inside the rectangle.
 *
 * @internal
 */
function getClosestSquaredDistanceToRotatedRect(ps, p) {
    const d0 = squaredDistanceBetweenPointAndLineSegment(p, [ps[0], ps[1]]);
    const d1 = squaredDistanceBetweenPointAndLineSegment(p, [ps[1], ps[2]]);
    const d2 = squaredDistanceBetweenPointAndLineSegment(p, [ps[2], ps[3]]);
    const d3 = squaredDistanceBetweenPointAndLineSegment(p, [ps[3], ps[0]]);
    const width = squaredDistanceBetween(ps[0], ps[1]);
    const height = squaredDistanceBetween(ps[0], ps[3]);
    if (d0 <= height && d2 <= height &&
        d1 <= width && d3 <= width) {
        return 0; // Inside rotated rect
    }
    return min(d0, d1, d2, d3);
}
export { getClosestSquaredDistanceToRotatedRect };
//# sourceMappingURL=get-closest-squared-distance-to-rotated-rect.js.map