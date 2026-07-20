import type { BezierPiece } from "flo-bezier3";
import { isBezierPieceZeroLength } from "flo-bezier3";


/**
 * Filters out zero-length bezier pieces.
 * 
 * * **note** will return at least one bezier piece, even if all pieces are zero-length.
 * 
 * @param bezierPieces 
 */
function filterZeroLength(
        bezierPieces: BezierPiece[]): BezierPiece[] {

    const bezierPieces_ = bezierPieces.filter(
        bezierPiece => !isBezierPieceZeroLength(bezierPiece)
    );

    return bezierPieces_.length > 0 ? bezierPieces_ : [bezierPieces[0]];
}


export { filterZeroLength }
