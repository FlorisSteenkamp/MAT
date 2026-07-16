import type { CpNode } from '../cp-node/cp-node.js';
import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * Finds an initial 3-prong circle center point from which to iterate. The point
 * must be within the shape.
 *
 * @param maxCoordPowerOf2
 * @param δ3s the three boundary pieces of which we need to find the three
 * 3-prong points.
 * @param curvePiece3s
 *
 * @internal
 */
declare function calcInitial3ProngCenter(maxCoordPowerOf2: number, δ3s: CpNode[][], curvePiece3s: CurvePiece[][]): number[];
export { calcInitial3ProngCenter };
