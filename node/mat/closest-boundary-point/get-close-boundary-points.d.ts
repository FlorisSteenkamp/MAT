import { PointOnShape } from '../../point-on-shape/point-on-shape.js';
import { BezierPiece } from '../bezier-piece.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
declare function getCloseBoundaryPoints(bezierPieces: BezierPiece[], point: number[], y: PointOnShape, distance: number): {
    pos: PointOnShape;
    d: number;
}[];
export { getCloseBoundaryPoints };
