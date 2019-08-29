import { PointOnShape } from './point-on-shape';
import { Circle } from './circle';
/**
 * Represents a point on the shape boundary for which MAT data has been
 * calculated.
 */
declare class ContactPoint {
    readonly pointOnShape: PointOnShape;
    readonly circle: Circle;
    readonly order: number;
    readonly order2: number;
    /**
     * @param pointOnShape Identifies the point on the shape boundary.
     * @param circle The maximal disk circle touching this point.
     * @param order Internally used to order two points lying at the same planar
     * point.
     * @param order2
     * Internally used to order two points lying at the same planar point.
     */
    constructor(pointOnShape: PointOnShape, circle: Circle, order: number, order2: number);
    /**
     * Primarily for internal use.
     *
     * Compares the two contact points according to their order along the shape
     * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
     * @param a The first contact point.
     * @param b The second contact point.
     */
    static compare(a: ContactPoint, b: ContactPoint): number;
}
export { ContactPoint };
