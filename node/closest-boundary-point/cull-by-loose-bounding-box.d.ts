import { BezierPiece } from '../mat/bezier-piece.js';
/**
 * @internal
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces
 * @param p
 * @param dSquared
 */
declare function cullByLooseBoundingBox(bezierPieces: BezierPiece[], p: number[], dSquared: number): BezierPiece[];
export { cullByLooseBoundingBox };
