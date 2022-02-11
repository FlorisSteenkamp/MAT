import { Loop } from './loop.js';
import { Corner } from './mat/corner.js';
/**
 * Represents a bezier curve on the shape boundary / loop.
 */
interface Curve {
    /**
     * Primarily for internal use.
     * @param loop The closed loop of bezier curves representing the shape
     * boundary this curve belongs to.
     * @param ps The bezier control points.
     * @param prev The previous curve (when going in a negative direction around
     * the shape boundary, i.e. clockwise for the outer shape and anti-clockwise
     * for the holes (if any)).
     * @param next The next curve (when going in a positive direction around
     * the shape boundary, i.e. anti-clockwise for the outer shape and clockwise
     * for the holes (if any)).
     * @param idx The curve's ordered index in the loop. This imposes a cycling
     * ordering of the curves in the loop.
     */
    loop: Loop;
    ps: number[][];
    prev: Curve;
    next: Curve;
    idx: number;
}
/**
 * @hidden
 * Returns a new corner with properties.
 *
 * PRECONDITION: The beziers has control points with max bit-length of 26 and
 * aligned to a 'grid' to have the same exponent. This is so the vectors between
 * control points can be calculated exactly without resorting to adaptive
 * infinite precision floating point operations.
 *
 * @param psI The incoming bezier that ends in the corner
 * @param psO The outgoing bezier that starts at the corner
 */
declare function getCorner(psI: number[][], psO: number[][]): Corner;
/**
 * @hidden
 * Returns information about the corner created at the end of this curve
 * (at t === 1) and the start of the next curve (at t === 0).
 */
declare let getCornerAtEnd: (a: Curve) => Corner;
export { Curve, getCorner, getCornerAtEnd };
