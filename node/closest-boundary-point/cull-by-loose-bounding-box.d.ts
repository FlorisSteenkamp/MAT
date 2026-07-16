import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 *
 * @param curvePieces
 * @param xO
 * @param xy2
 *
 * @internal
 */
declare function cullByLooseBoundingBox(curvePieces: CurvePiece[], xO: number[], xy2: number): CurvePiece[];
export { cullByLooseBoundingBox };
