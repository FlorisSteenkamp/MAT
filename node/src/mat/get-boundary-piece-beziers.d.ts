import { CpNode } from '../../cp-node';
import { BezierPiece } from './bezier-piece';
/**
 * @hidden
 * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
 * from the given boundary piece.
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 */
declare function getBoundaryPieceBeziers(cpNodes: CpNode[]): BezierPiece[];
export { getBoundaryPieceBeziers };
