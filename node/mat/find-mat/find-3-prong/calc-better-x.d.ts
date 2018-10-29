import { PointOnShape } from '../../../point-on-shape';
import { BezierPiece } from '../../../bezier-piece';
/**
 * Find new x and ps that are a better estimate of the 3-prong circle.
 * The potential function, V, is defined as the distance to the actual 3 prong
 * circle center.
 * @param bezierPiece3s The three boundary pieces, each of which should contain
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 * @param vectorToZeroV
 * @param extreme
 */
declare function calcBetterX(bezierPiece3s: BezierPiece[][], x: number[], vectorToZeroV: number[]): {
    newX: number[];
    newV: number;
    newPs: PointOnShape[];
};
export { calcBetterX };
