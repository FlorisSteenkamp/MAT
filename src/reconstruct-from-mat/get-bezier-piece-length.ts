import type { BezierPiece } from "flo-bezier3";
import { length } from 'flo-bezier3';


function getBezierPieceLength(
        bezierPiece: BezierPiece): number {

    return length(bezierPiece.ts, bezierPiece.ps);
}


export { getBezierPieceLength }
