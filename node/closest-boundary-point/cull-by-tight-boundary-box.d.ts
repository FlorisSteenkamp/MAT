import { BezierPiece } from "../mat/bezier-piece.js";
/**
 * @internal
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces
 * @param p
 * @param bestSquaredDistance
 */
declare function cullByTightBoundingBox(bezierPieces: BezierPiece[], p: number[], bestSquaredDistance: number): BezierPiece[];
export { cullByTightBoundingBox };
