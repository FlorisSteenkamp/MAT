import type { Curve } from 'flo-boolean';
import type { Circle } from '../geometry/circle.js';
/**
 * Represents a point on the shape boundary, including the `curve` it belongs
 * to, the bezier parameter `t` value on that curve, tha actual point `p` and
 * whether it is a "source" point.
 */
interface PrePointOnShape {
    /**
     * The `Curve` on the shape boundary this points belong to.
     */
    readonly curve: Curve;
    /**
     * The bezier parameter value on the curve identifying the point coordinates.
     * (Considered cached if `isSource` is `false`, i.e. calculated from other
     * (single source of truth) values)
     */
    readonly t: number;
    /**
     * `true` if this is the source 2-prong point from which the antipode point
     * is found, else `false`. (Also false for n-prongs with n > 2)
     */
    readonly isSource: boolean;
    /** The (cached) point on the shape boundary. */
    readonly p: number[];
}
/**
 * Represents a point on the shape boundary, including the `curve` it belongs
 * to, the bezier parameter `t` value on that curve, tha actual point `p` and
 * whether it is a "source" point.
 */
interface PointOnShape extends PrePointOnShape {
    /**
     * The (cached) maximal disk circle touching this point.
     * Calculated from `curve` and `t` (if 2-prong source point, else
     * from `curve` and `t` of the antipodal 2-prong point).
     */
    readonly circle: Circle;
    /** Internally used to order two points lying at the same planar point. */
    readonly order: number;
    /** Internally used to order two points lying at the same planar point. */
    readonly order2: number;
}
export type { PointOnShape, PrePointOnShape };
