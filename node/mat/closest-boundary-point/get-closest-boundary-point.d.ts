import { Curve } from '../../curve';
import { IPointOnShape } from '../../point-on-shape';
import { BezierPiece } from '../bezier-piece';
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
declare function getClosestBoundaryPoint(bezierPieces: BezierPiece[], point: number[], touchedCurve: Curve, t: number): {
    pos: IPointOnShape;
    d: number;
};
export { getClosestBoundaryPoint };
