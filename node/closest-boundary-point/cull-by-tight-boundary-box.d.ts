import { CurvePiece } from "../mat/curve-piece.js";
/**
 * @internal
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param curvePieces
 * @param p
 * @param bestSquaredDistance
 */
declare function cullByTightBoundingBox(curvePieces: CurvePiece[], p: number[], bestSquaredDistance: number): CurvePiece[];
export { cullByTightBoundingBox };
