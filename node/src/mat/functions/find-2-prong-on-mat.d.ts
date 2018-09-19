import { Shape } from '../classes/shape';
/**
 * Adds an additional 2-prong to the MAT after a reasonably accurate MAT already
 * exists.
 *
 * A 2-prong is a MAT circle that touches the shape at exactly 2 points.
 *
 * @param shape
 * @param y - The first point of the 2-prong.
 */
declare function find2ProngOnMat(shape: Shape, p: number[][], holeClosing: boolean): void;
export { find2ProngOnMat };
