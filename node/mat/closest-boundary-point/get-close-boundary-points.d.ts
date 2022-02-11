import { IPointOnShape } from '../../point-on-shape.js';
import { BezierPiece } from '../bezier-piece.js';
/**
 * @hidden
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
declare function getCloseBoundaryPoints(bezierPieces: BezierPiece[], point: number[], y: IPointOnShape, distance: number): {
    pos: IPointOnShape;
    d: number;
}[];
export { getCloseBoundaryPoints };
