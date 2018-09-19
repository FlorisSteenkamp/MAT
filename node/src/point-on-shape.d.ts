import { Curve } from './curve';
import { Circle } from './circle';
declare class PointOnShape {
    curve: Curve;
    t: number;
    private p_;
    readonly p: number[];
    /**
     * @param curve
     * @param t - The bezier parameter value
     */
    constructor(curve: Curve, t: number);
    static getOsculatingCircle(maxOsculatingCircleRadius: number, pos: PointOnShape): Circle;
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param ps
     * @param t
     */
    static calcOsculatingCircleRadius: (a: PointOnShape) => number;
    static compare: (a: PointOnShape, b: PointOnShape) => number;
    /**
     * Ignores order2 (used in hole-closing two-prongs only)
     */
    static compareInclOrder: (a: PointOnShape, b: PointOnShape, aOrder: number, bOrder: number) => number;
    static getCorner: (a: PointOnShape) => {
        tans: number[][];
        crossTangents: number;
        isSharp: boolean;
        isDull: boolean;
        isQuiteSharp: boolean;
        isQuiteDull: boolean;
    };
    static isSharpCorner: (a: PointOnShape) => boolean;
    static isDullCorner: (a: PointOnShape) => boolean;
    static isQuiteSharpCorner: (a: PointOnShape) => boolean;
    static isQuiteDullCorner: (a: PointOnShape) => boolean;
    /**
     * Calculates the order (to distinguish between points lying on top of each
     * other) of the contact point if it is a dull corner.
     * @param pos
     */
    static calcOrder(circle: Circle, pos: PointOnShape): number;
    /**
     * Returns a human-readable string of the given PointOnShape.
     * For debugging only.
     */
    static toHumanString: (pos: PointOnShape) => string;
}
export { PointOnShape };
