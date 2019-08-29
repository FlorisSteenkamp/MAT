import { CpNode } from '../../../cp-node';
import { BezierPiece } from '../../bezier-piece';
/**
 * @hidden
 * Finds an initial 3-prong circle center point from which to iterate. The point
 * must be within the shape.
 * @param δ3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 * @param bezierPiece3s
 * @param extreme
 */
declare function calcInitial3ProngCenter(δ3s: CpNode[][], bezierPiece3s: BezierPiece[][]): number[];
export { calcInitial3ProngCenter };
