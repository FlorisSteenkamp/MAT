import PointOnShape from '../classes/Point-on-shape';
import BezierPiece from '../classes/bezier-piece';
import ListNode from '../../linked-list/list-node';
import PathCurve from '../classes/path-curve';
/**
 * Gets the closest boundary point to the given point, limited to the
 * given bezier pieces.
 *
 * @param bezierPieces
 * @param point
 * @param touchedBezierNode
 * @returns {PointOnShape} The closest point.
 */
declare function getClosestBoundaryPointToPoint(bezierPieces_: BezierPiece[], point: number[], touchedBezierNode: ListNode<PathCurve>, t: number): PointOnShape;
export default getClosestBoundaryPointToPoint;
