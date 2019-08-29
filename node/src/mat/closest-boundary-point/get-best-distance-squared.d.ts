import { BezierPiece } from "../bezier-piece";
/**
 * @hidden
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 */
declare function getBestDistanceSquared(bezierPieces: BezierPiece[], p: number[]): number;
export { getBestDistanceSquared };
