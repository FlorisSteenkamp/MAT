import type { CpNode } from '../cp-node/cp-node.js';
import type { CurvePiece } from './curve-piece.js';
/**
 * Returns the ordered bezier pieces between from the given boundary piece.
 *
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 *
 * @internal
 */
declare function getBoundaryPieceBeziers(cpNodes: CpNode[]): CurvePiece[];
export { getBoundaryPieceBeziers };
