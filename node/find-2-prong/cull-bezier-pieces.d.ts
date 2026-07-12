import { CurvePiece } from '../mat/curve-piece.js';
/**
 * Cull all `curvePieces` not within the given radius of a given point.
 *
 * @param extreme
 * @param curvePieces
 * @param p
 * @param rSquared
 *
 * @internal
 */
declare function cullCurvePieces2(curvePieces: CurvePiece[], p: number[], rSquared: number): CurvePiece[];
export { cullCurvePieces2 };
