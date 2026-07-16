import type { CurvePiece } from "../../mat/curve-piece.js";
import type { PrePointOnShape } from "../../point-on-shape/point-on-shape.js";
import type { AntipodalPoint } from './antipodal-point.js';
/**
 * @param maxCoordPowerOf2
 * @param nnorm
 * @param yPos The point on the shape
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`;
 * @param curvePiece The curve piece
 *
 * @internal
 */
declare function getClosestPoint(maxCoordPowerOf2: number, nnorm: number[], yPos: PrePointOnShape, for1Prong: boolean, angle: number, curvePiece: CurvePiece): AntipodalPoint[];
export { getClosestPoint };
