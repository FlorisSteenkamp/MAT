import type { FootAndEndpointInfo } from '../../closest-boundary-point/foot-and-endpoint-info.js';
import { CurvePiece } from "../../mat/curve-piece.js";
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
/**
 * @internal
 *
 * @param pow
 * @param curvePiece The curve piece
 * @param x The point from which to check
 * @param yPos The point on the shape
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`;
 */
declare function getClosestPoint(pow: number, curvePiece: CurvePiece, x: number[], yPos: PointOnShape, for1Prong?: boolean, angle?: number): FootAndEndpointInfo[];
export { getClosestPoint };
