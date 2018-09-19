import { CpNode } from '../../../../linked-list/cp-node';
import { BezierPiece } from '../../../classes/bezier-piece';
/**
 * Finds an initial 3-prong circle center point from which to iterate.
 * The point must be within the shape.
 * @param delta3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 */
declare function calcInitial3ProngCenter(delta3s: CpNode[][], bezierPiece3s: BezierPiece[][]): number[];
export { calcInitial3ProngCenter };
