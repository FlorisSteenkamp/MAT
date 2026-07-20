import type { BezierPiece } from "flo-bezier3";
/**
 * Filters out zero-length bezier pieces.
 *
 * * **note** will return at least one bezier piece, even if all pieces are zero-length.
 *
 * @param bezierPieces
 */
declare function filterZeroLength(bezierPieces: BezierPiece[]): BezierPiece[];
export { filterZeroLength };
