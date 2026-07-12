import type { Curve } from 'flo-boolean';


/**
 * Represents a point on the shape boundary, including the `curve` it belongs
 * to, the bezier parameter `t` value on that curve, tha actual point `p` and
 * whether it is a "source" point.
 */
interface PointOnShape {
    /** The `Curve` on the shape boundary this points belong to. */
    readonly curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    readonly t: number;
    /** The point on the shape boundary. */
    readonly p: number[];
    /** just for debugging */
    readonly isSource?: boolean;
}


export type { PointOnShape }
