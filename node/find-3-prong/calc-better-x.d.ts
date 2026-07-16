import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { CurvePiece } from '../mat/curve-piece.js';
/**
 * Find new `x` and `ps` that are better estimates of the 3-prong circle.
 *
 * The potential function, V, is defined as the distance to the actual 3 prong
 * circle center.
 *
 * @param maxCoordPowerOf2
 * @param curvePiece3s The three boundary pieces, each of which should contain
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 * @param vectorToZeroV
 *
 * @internal
 */
declare function calcBetterX(maxCoordPowerOf2: number, curvePiece3s: CurvePiece[][], x: number[], vectorToZeroV: number[]): {
    newX: number[];
    newV: number;
    newPoss: PrePointOnShape[];
};
export { calcBetterX };
