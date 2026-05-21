import { CurvePiece } from '../mat/curve-piece.js';
/**
 * @internal
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param curvePieces
 * @param p
 * @param dSquared
 */
declare function cullByLooseBoundingBox(curvePieces: CurvePiece[], p: number[], dSquared: number): CurvePiece[];
export { cullByLooseBoundingBox };
