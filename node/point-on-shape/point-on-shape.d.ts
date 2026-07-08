import type { Curve } from 'flo-boolean';
interface PointOnShape {
    /** The `Curve` on the shape boundary this points belong to. */
    readonly curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    readonly t: number;
    readonly p: number[];
    /** just for debugging */
    readonly isSource?: boolean;
}
export type { PointOnShape };
