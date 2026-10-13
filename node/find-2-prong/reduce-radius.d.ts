import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * Reduces the circle radius initially as an optimization step.
 *
 * @param rO maximum possible initial radius
 *
 * @internal
 */
declare function reduceRadius(rO: number, curvePieces: CurvePiece[], y: number[], nnorm: number[]): number;
export { reduceRadius };
