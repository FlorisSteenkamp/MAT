import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * Cull all `curvePieces` not within the given radius of a given point.
 *
 * @param extreme
 * @param curvePieces
 * @param xO
 * @param xy2
 *
 * @internal
 */
declare function cullCurvePieces(curvePieces: CurvePiece[], xO: number[], xy2: number): CurvePiece[];
export { cullCurvePieces };
