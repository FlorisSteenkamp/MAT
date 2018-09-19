import { Curve } from '../../linked-list/curve';
import { Circle } from './circle';
/**
 * @constructor
 *
 * @param bezierNode
 * @param t - The bezier parameter value
 * @param type {MAT_CONSTANTS.pointType}
 *  'standard' : 0, // Not special,
 *  'sharp'    : 1, // Sharp corner,
 *  'dull'     : 2, // dull corner,
 * @param order - For dull corners only; equals the cross of the tangents at the
 * corner interface to impose an order on points with the same point coordinates
 * and t values.
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */
declare class PointOnShape {
    readonly bezierNode: Curve;
    readonly t: number;
    readonly type: number;
    readonly p: number[];
    constructor(bezierNode: Curve, t: number, type: number);
    static getOsculatingCircle: (a: PointOnShape) => Circle;
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param ps
     * @param t
     */
    static calcOsculatingCircle(ps: number[][], t: number): Circle;
    static compare: (a: PointOnShape, b: PointOnShape) => number;
    /**
    * Returns true if its osculation circle is pointing straight upwards.
    */
    static isPointingStraightUp: (pos: PointOnShape) => boolean;
    static dullCornerAt(pos: PointOnShape): {
        tans: number[][];
        crossTangents: number;
        isDull: boolean;
        isQuiteSharp: boolean;
        isQuiteDull: boolean;
    };
    /**
     * Calculates the order (to distinguish between points lying on top of each
     * other) of the contact point if it is a dull corner.
     * @param pos
     */
    static calcOrder(circle: Circle, pos: PointOnShape): number;
    /**
     * Creates a string key that only depends on the PointOnShape's coordinates.
     */
    static makeSimpleKey: (p: number[]) => string;
    /**
     * Returns the PointOnShape type as a human-readable string.
     * @param type
     */
    static typeToStr(type: number): string;
    /**
     * Returns a human-readable string of the PointOnShape.
     *
     * For debugging only.
     */
    static toHumanString: (pos: PointOnShape) => string;
}
export { PointOnShape };
