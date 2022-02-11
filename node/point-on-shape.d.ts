import { Curve } from './curve.js';
import { Circle } from './circle.js';
interface IPointOnShape {
    /** The [[ICurve]] on the shape boundary this points belong to. */
    curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    t: number;
    p: number[];
}
/**
 * Represents a point on the shape boundary for which MAT vertex information
 * has not *necessarily* been calculated.
 */
declare class PointOnShape implements IPointOnShape {
    readonly curve: Curve;
    readonly t: number;
    /**
     * @param curve	The [[ICurve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */
    constructor(curve: Curve, t: number);
    private p_;
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    get p(): number[];
}
/**
 * @hidden
 */
declare let isPosSharpCorner: (a: IPointOnShape) => boolean;
/**
 * @hidden
 */
declare let isPosDullCorner: (a: IPointOnShape) => boolean;
/**
 * @hidden
 */
declare let isPosQuiteSharpCorner: (a: IPointOnShape) => boolean;
/**
 * @hidden
 */
declare let isPosQuiteDullCorner: (a: IPointOnShape) => boolean;
/**
 * Returns a human-readable string of the given [[PointOnShape]].
 * For debugging only.
 * @hidden
 */
declare function posToHumanString(pos: IPointOnShape): string;
/**
 * @hidden
 * Calculates the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param pos
 */
declare function calcPosOrder(circle: Circle, pos: IPointOnShape): number;
/**
 * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
 * by their relative positions on the shape boundary.
 * @param a The first [[PointOnShape]].
 * @param b The second [[PointOnShape]].
 * @hidden
 */
declare function comparePoss(a: IPointOnShape, b: IPointOnShape): number;
/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
declare function getOsculatingCircle(maxOsculatingCircleRadius: number, pos: IPointOnShape): Circle;
export { IPointOnShape, PointOnShape, getOsculatingCircle, comparePoss, calcPosOrder, posToHumanString, isPosSharpCorner, isPosDullCorner, isPosQuiteSharpCorner, isPosQuiteDullCorner };
