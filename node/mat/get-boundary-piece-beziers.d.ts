import { CpNode } from '../cp-node/cp-node.js';
import { CurvePiece } from './bezier-piece.js';
/**
 * @internal
 * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
 * from the given boundary piece.
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 */
declare function getBoundaryPieceBeziers(cpNodes: CpNode[]): CurvePiece[];
export { getBoundaryPieceBeziers };
