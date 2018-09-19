import { CpNode } from '../../linked-list/cp-node';
import { BezierPiece } from '../classes/bezier-piece';
/**
* Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
* from the given boundary piece.
* @param δ - An ordered pair that represents the start and ending points of
* the boundary piece
* @param keepStraight - If true then don't go around any mat circles
* @param ifSamePointReturnEmpty = If the two δ points representing a
* boundary piece compare as equal, then if this parameter is set to true
* a single point will be returned else the entire boundary will be
* returned.
*/
declare function getBoundaryPieceBeziers(δ: CpNode[], keepStraight?: boolean, ifSamePointReturnPointOnly?: boolean): BezierPiece[];
export { getBoundaryPieceBeziers };
