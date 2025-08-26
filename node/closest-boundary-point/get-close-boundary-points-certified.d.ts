import { CurvePiece } from '../mat/bezier-piece.js';
import { Curve } from '../curve/curve.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param bezierPieces
 * @param x
 * @param touchedCurve
 * @param t
 * @param extreme
 */
declare function getCloseBoundaryPointsCertified(pow: number, bezierPieces: CurvePiece[], x: number[], touchedCurve?: Curve | undefined, t?: number | undefined, for1Prong?: boolean, angle?: number): PointOnShape[];
export { getCloseBoundaryPointsCertified };
