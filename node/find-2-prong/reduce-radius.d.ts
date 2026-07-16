import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * Reduces the circle radius initially as an optimization step.
 *
 * @internal
 */
declare function reduceRadius(maxCoordPowerOf2: number, curvePieces: CurvePiece[], y: number[], nnorm: number[]): number;
export { reduceRadius };
