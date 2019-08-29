import { BezierPiece } from "../../../bezier-piece";
/**
 * @hidden
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
declare function cullBezierPieces(bezierPieces: BezierPiece[], p: number[], rSquared: number): BezierPiece[];
export { cullBezierPieces };
