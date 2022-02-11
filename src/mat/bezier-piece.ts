import { Curve } from '../curve.js';


/**
 * @hidden
 * Represents a part of a bezier within the shape boundary.
 */
interface BezierPiece {
    /** A bezier curve within the shape boundary. */
    curve: Curve;
    /** The start and end t parameter values of the bezier curve. */
    ts: number[];
}


export { BezierPiece }
