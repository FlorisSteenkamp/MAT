import type { CurvePiece } from "../../mat/curve-piece.js";
import type { PrePointOnShape } from "../../point-on-shape/point-on-shape.js";
import type { AntipodalPoint } from './antipodal-point.js';
/**
 * @param maxCoordPowerOf2
 * @param yPos The point on the shape
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`;
 * @param curvePiece The curve piece
 *
 * Returns `undefined` if a touching point is found on the source's own curve
 * whose circle is too small to resolve, i.e. if the maximal disk at `yPos`
 * is (numerically) of zero radius.
 *
 * @internal
 */
declare function getClosestPoint(maxCoordPowerOf2: number, nnormDd: number[][], yPos: PrePointOnShape, for1Prong: boolean, angle: number, curvePiece: CurvePiece): AntipodalPoint[] | undefined;
export { getClosestPoint };
