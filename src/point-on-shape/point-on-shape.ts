import { Curve } from '../curve/curve.js';


interface PointOnShape {
    /** The [[ICurve]] on the shape boundary this points belong to. */
    curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    t: number;
    p: number[];
    /** Only for dull corners - and maybe only for source points (not antipodal points) */
    // angle?: number | undefined;
    source: boolean;  // just for debugging
}


export { PointOnShape }
