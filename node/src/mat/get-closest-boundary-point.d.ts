import { BezierPoint } from 'flo-bezier3';
import { Curve } from '../curve';
import { PointOnShape } from '../point-on-shape';
import { BezierPiece } from '../bezier-piece';
/**
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
declare function getClosestBoundaryPoint(bezierPieces: BezierPiece[], point: number[], touchedCurve: Curve, t: number): PointOnShape;
/**
 *
 * @param curve The bezier
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
declare function closestPointOnBezier(curve: Curve, p: number[], tRange?: number[], touchedCurve?: Curve, t?: number): BezierPoint;
export { getClosestBoundaryPoint, closestPointOnBezier };
