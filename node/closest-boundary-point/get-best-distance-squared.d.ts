import type { CurvePiece } from "../mat/curve-piece.js";
/**
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 *
 * @internal
 */
declare function getBestDistanceSquared(curvePieces: CurvePiece[], xO: number[]): number;
export { getBestDistanceSquared };
