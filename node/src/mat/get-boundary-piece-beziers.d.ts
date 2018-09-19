import { CpNode } from '../cp-node';
import { BezierPiece } from '../bezier-piece';
/**
* Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
* from the given boundary piece.
* @param cpNode - An ordered pair that represents the start and end points of
* the boundary piece
*/
declare function getBoundaryPieceBeziers(cpNode: CpNode[]): BezierPiece[];
export { getBoundaryPieceBeziers };
