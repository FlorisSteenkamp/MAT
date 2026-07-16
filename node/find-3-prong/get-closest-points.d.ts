import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * @param maxCoordPowerOf2
 * @param x
 * @param curvePiece3s
 *
 * @internal
 */
declare function getClosestPoints(maxCoordPowerOf2: number, x: number[], curvePiece3s: CurvePiece[][]): import("../point-on-shape/point-on-shape.js").PrePointOnShape[];
export { getClosestPoints };
