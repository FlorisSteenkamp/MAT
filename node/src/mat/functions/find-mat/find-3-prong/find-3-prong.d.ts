import { CpNode } from '../../../../linked-list/cp-node';
import { Circle } from '../../../classes/circle';
import { PointOnShape } from '../../../classes/point-on-shape';
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
declare function find3Prong(δs: CpNode[][]): {
    circle: Circle;
    ps: PointOnShape[];
    δ3s: CpNode[][];
};
export { find3Prong };
