import { Curve } from '../curve/curve.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { BezierPiece } from '../mat/bezier-piece.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param x
 * @param touchedCurve
 * @param t
 * @param extreme
 */
declare function getClosestBoundaryPointCertified(angle: number, bezierPieces: BezierPiece[], x: number[], touchedCurve: Curve, t: number, for1Prong: boolean): PointOnShape;
export { getClosestBoundaryPointCertified };
