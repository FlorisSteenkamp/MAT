import { BezierPiece } from '../mat/bezier-piece.js';
/**
 * @internal
 *
 * Reduces the circle radius initially as an optimization step.
 */
declare function reduceRadius(extreme: number, bezierPieces: BezierPiece[], p: number[], x: number[]): number;
export { reduceRadius };
