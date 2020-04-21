import { IPointOnShape } from './point-on-shape';
import { Circle } from './circle';
/**
 * Represents a point on the shape boundary for which MAT data has been
 * calculated.
 */
interface ContactPoint {
    /** Identifies the point on the shape boundary. */
    pointOnShape: IPointOnShape;
    /** The maximal disk circle touching this point. */
    circle: Circle;
    /** Internally used to order two points lying at the same planar point. */
    order: number;
    /** Internally used to order two points lying at the same planar point. */
    order2: number;
}
/**
 * Primarily for internal use.
 *
 * Compares the two contact points according to their order along the shape
 * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
 * @param a The first contact point.
 * @param b The second contact point.
 */
declare function compareCps(a: ContactPoint, b: ContactPoint): number;
export { ContactPoint, compareCps };
