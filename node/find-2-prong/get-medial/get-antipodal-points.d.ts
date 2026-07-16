import type { CurvePiece } from '../../mat/curve-piece.js';
import type { PrePointOnShape } from '../../point-on-shape/point-on-shape.js';
import type { AntipodalPoint } from './antipodal-point.js';
/**
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param maxCoordPowerOf2
 * @param nnorm
 * @param yPos
 * @param for1Prong defaults to `false`;
 * @param angle angle from normal
 * @param curvePieces
 *
 * @internal
 */
declare function getAntipodalPoints(maxCoordPowerOf2: number, nnorm: number[], yPos: PrePointOnShape, for1Prong: boolean, angle: number, curvePieces: CurvePiece[]): AntipodalPoint[];
export { getAntipodalPoints };
