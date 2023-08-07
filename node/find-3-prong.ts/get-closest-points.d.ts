import { BezierPiece } from '../mat/bezier-piece.js';
/**
 * @internal
 * @param x
 * @param bezierPiece3s
 * @param extreme
 */
declare function getClosestPoints(x: number[], bezierPiece3s: BezierPiece[][]): import("../point-on-shape/point-on-shape.js").PointOnShape[];
export { getClosestPoints };
