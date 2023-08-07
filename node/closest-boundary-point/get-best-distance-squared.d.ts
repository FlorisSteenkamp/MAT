import { BezierPiece } from "../mat/bezier-piece.js";
/**
 * @internal
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 */
declare function getBestDistanceSquared(bezierPieces: BezierPiece[], p: number[]): number;
export { getBestDistanceSquared };
