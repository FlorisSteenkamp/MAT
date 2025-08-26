import { CurvePiece } from '../mat/bezier-piece.js';
/**
 * @internal
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
declare function cullBezierPieces2(bezierPieces: CurvePiece[], p: number[], rSquared: number): CurvePiece[];
export { cullBezierPieces2 };
