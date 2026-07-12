import { CurvePiece } from '../mat/curve-piece.js';
/**
 * Reduces the circle radius initially as an optimization step.
 *
 * @internal
 */
declare function reduceRadius(extreme: number, curvePieces: CurvePiece[], p: number[], x: number[]): number;
export { reduceRadius };
