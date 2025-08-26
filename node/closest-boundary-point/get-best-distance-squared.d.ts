import { CurvePiece } from "../mat/bezier-piece.js";
/**
 * @internal
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 */
declare function getBestDistanceSquared(bezierPieces: CurvePiece[], p: number[]): number;
export { getBestDistanceSquared };
