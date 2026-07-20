import type { CurvePiece } from '../mat/curve-piece.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param maxCoordPowerOf2
 * @param curvePieces
 * @param x
 *
 * @internal
 */
declare function getCloseBoundaryPointsCertified(curvePieces: CurvePiece[], x: number[]): PrePointOnShape[];
export { getCloseBoundaryPointsCertified };
