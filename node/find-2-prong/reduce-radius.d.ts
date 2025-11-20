import { CurvePiece } from '../mat/curve-piece.js';
/**
 * @internal
 *
 * Reduces the circle radius initially as an optimization step.
 */
declare function reduceRadius(extreme: number, bezierPieces: CurvePiece[], p: number[], x: number[]): number;
export { reduceRadius };
