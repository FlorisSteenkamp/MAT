import type { Curve } from 'flo-boolean';
/**
 * @internal
 * Represents a part of a bezier within the shape boundary.
 */
interface CurvePiece {
    /** A bezier curve within the shape boundary. */
    readonly curve: Curve;
    /** The start and end t parameter values of the bezier curve. */
    readonly ts: number[];
}
export type { CurvePiece };
