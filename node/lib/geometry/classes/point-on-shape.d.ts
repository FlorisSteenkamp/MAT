import PathCurve from './path-curve';
import ListNode from '../../linked-list/list-node';
import Circle from './circle';
import Shape from './shape';
import Corner from '../../geometry/classes/corner';
/**
 * @constructor
 *
 * @param bezierNode
 * @param t - The bezier parameter value
 * @param type {MAT_CONSTANTS.pointType}
 *  'standard' : 0, // Not special,
 *  'sharp'    : 1, // Sharp corner,
 *  'dull'     : 2, // dull corner,
 * @param order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.
 * @param order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately.
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */
declare class PointOnShape {
    bezierNode: ListNode<PathCurve>;
    t: number;
    type: number;
    order: number;
    order2: number;
    p: number[];
    0: number;
    1: number;
    constructor(bezierNode: ListNode<PathCurve>, t: number, type: number, order: number, order2: number);
    static getOsculatingCircle: (a: PointOnShape) => Circle;
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param pathCurve
     * @param t
     */
    static calcOsculatingCircle(pathCurve: PathCurve, t: number): Circle;
    /**
    * Compares two PointOnShapes according to their position on the bezier loop.
    */
    static compare: (a: PointOnShape, b: PointOnShape) => number;
    /**
    * Returns true if its osculation circle is pointing straight upwards.
    */
    static isPointingStraightUp: (pos: PointOnShape) => boolean;
    static dullCornerAt(shape: Shape, p: number[]): Corner;
    /**
     * Sets the order (to distinguish between points lying on top of each
     * other) of the contact point if it is a dull corner.
     * @param {PointOnShape} pos
     * @note Modifies pos
     */
    static setPointOrder: (shape: Shape, circle: Circle, pos: PointOnShape) => number;
    /**
     * Clones the PointOnShape.
     */
    static copy(pos: PointOnShape): PointOnShape;
    /**
     * Creates a string key that only depends on the PointOnShape's coordinates.
     */
    static makeSimpleKey: (p: number[]) => string;
    /**
     * Returns the PointOnShape type as a human-readable
     * string.
     * @param {number} type
     * @returns {string}
     */
    static typeToStr(type: number): string;
    /**
     * @description Returns a human-readable string of the PointOnShape.
     * @note For debugging only.
     */
    static toHumanString: (pos: PointOnShape) => string;
}
export default PointOnShape;
