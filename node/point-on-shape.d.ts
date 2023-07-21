import { Curve } from './curve.js';
import { Circle } from './circle.js';
interface PointOnShape {
    /** The [[ICurve]] on the shape boundary this points belong to. */
    curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    t: number;
    p: number[];
}
declare function createPos(curve: Curve, t: number): PointOnShape;
/**
 * @hidden
 */
declare const isPosSharpCorner: (a: PointOnShape) => boolean;
/**
 * @hidden
 */
declare const isPosDullCorner: (a: PointOnShape) => boolean;
/**
 * @hidden
 */
declare const isPosQuiteSharpCorner: (a: PointOnShape) => boolean;
/**
 * @hidden
 */
declare const isPosQuiteDullCorner: (a: PointOnShape) => boolean;
/**
 * Returns a human-readable string of the given [[PointOnShape]].
 * For debugging only.
 * @hidden
 */
declare function posToHumanString(pos: PointOnShape): string;
/**
 * @hidden
 * Calculates the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param pos
 */
declare function calcPosOrder(circle: Circle, pos: PointOnShape): number;
/**
 * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
 * by their relative positions on the shape boundary.
 * @param a The first [[PointOnShape]].
 * @param b The second [[PointOnShape]].
 * @hidden
 */
declare function comparePoss(a: PointOnShape, b: PointOnShape): number;
/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
declare function getOsculatingCircle(maxOsculatingCircleRadius: number, pos: PointOnShape): Circle;
export { PointOnShape, getOsculatingCircle, comparePoss, calcPosOrder, posToHumanString, isPosSharpCorner, isPosDullCorner, isPosQuiteSharpCorner, isPosQuiteDullCorner, createPos };
