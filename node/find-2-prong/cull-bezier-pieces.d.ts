import { CurvePiece } from '../mat/curve-piece.js';
/**
 * @internal
 * Cull all curvePieces not within given radius of a given point.
 * @param extreme
 * @param curvePieces
 * @param p
 * @param rSquared
 */
declare function cullCurvePieces2(curvePieces: CurvePiece[], p: number[], rSquared: number): CurvePiece[];
export { cullCurvePieces2 };
