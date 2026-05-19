import { Curve } from '../curve/curve.js';
interface PointOnShape {
    /** The `Curve` on the shape boundary this points belong to. */
    curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    t: number;
    p: number[];
    /** just for debugging */
    isSource?: boolean;
}
export { PointOnShape };
