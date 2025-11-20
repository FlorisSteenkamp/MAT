import { Curve } from '../curve/curve.js';
/**
 * @internal
 * Represents a part of a bezier within the shape boundary.
 */
interface CurvePiece {
    /** A bezier curve within the shape boundary. */
    curve: Curve;
    /** The start and end t parameter values of the bezier curve. */
    ts: number[];
}
export { CurvePiece };
