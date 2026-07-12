import type { CurvePiece } from '../../mat/curve-piece.js';
import type { PointOnShape } from '../../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param pow
 * @param curvePieces
 * @param _x
 * @param yPos
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`
 */
declare function getMedial(pow: number, curvePieces: CurvePiece[], _x: number[], yPos: PointOnShape, for1Prong?: boolean, angle?: number): {
    xs: number[][];
    _zs: PointOnShape[];
};
export { getMedial };
