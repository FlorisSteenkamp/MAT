import { Curve } from './curve';
import { Circle } from './circle';
/**
 * Represents a point on the shape boundary for which MAT vertex information
 * has not *necessarily* been calculated.
 */
declare class PointOnShape {
    curve: Curve;
    t: number;
    /**
     * @param curve	The [[Curve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */
    constructor(curve: Curve, t: number);
    private p_;
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    readonly p: number[];
    /**
     * Returns the osculating circle at this point of the curve.
     * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
     * circle radius will be limited to this value.
     * @param pos The [[PointOnShape]] identifying the point.
     */
    static getOsculatingCircle(maxOsculatingCircleRadius: number, pos: PointOnShape): Circle;
    /**
     * Calculates and returns the osculating circle radius of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param ps
     * @param t
     * @hidden
     */
    static calcOsculatingCircleRadius: (a: PointOnShape) => number;
    /**
     * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
     * by their relative positions on the shape boundary.
     * @param a The first [[PointOnShape]].
     * @param b The second [[PointOnShape]].
     * @hidden
     */
    static compare: (a: PointOnShape, b: PointOnShape) => number;
    /**
     * Ignores order2 (used in hole-closing two-prongs only)
     * @hidden
     */
    static compareInclOrder: (a: PointOnShape, b: PointOnShape, aOrder: number, bOrder: number) => number;
    /**
     * @hidden
     */
    static isCorner: (pos: PointOnShape) => boolean;
    /**
     * @hidden
     */
    static getCorner: (pos: PointOnShape) => import("./mat/corner").Corner;
    /**
     * @hidden
     */
    static isSharpCorner: (a: PointOnShape) => boolean;
    /**
     * @hidden
     */
    static isDullCorner: (a: PointOnShape) => boolean;
    /**
     * @hidden
     */
    static isQuiteSharpCorner: (a: PointOnShape) => boolean;
    /**
     * @hidden
     */
    static isQuiteDullCorner: (a: PointOnShape) => boolean;
    /**
     * @hidden
     * Calculates the order (to distinguish between points lying on top of each
     * other) of the contact point if it is a dull corner.
     * @param pos
     */
    static calcOrder(circle: Circle, pos: PointOnShape): number;
    /**
     * Returns a human-readable string of the given [[PointOnShape]].
     * For debugging only.
     * @hidden
     */
    static toHumanString: (pos: PointOnShape) => string;
}
export { PointOnShape };
