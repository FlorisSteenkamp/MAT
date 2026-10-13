import type { CpNode } from '../cp-node/cp-node.js';
import type { CurvePiece } from './curve-piece.js';
/**
 * Returns the ordered bezier pieces between the two given `CpNode`s.
 *
 * * NOTE: an earlier version 'stitched' pieces together at hole closers and
 * loop endpoints to avoid duplicate antipodal points later; this was removed
 * (duplicates are now checked for in `find2Prong`) - see the git history
 * before 2026-10 for that code.
 *
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 *
 * @internal
 */
declare function getBoundaryPieceBeziers(cpNodes: [CpNode, CpNode]): CurvePiece[];
export { getBoundaryPieceBeziers };
