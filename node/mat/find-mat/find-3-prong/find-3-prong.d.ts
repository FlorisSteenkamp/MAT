import { CpNode } from '../../../cp-node';
import { Circle } from '../../../circle';
import { IPointOnShape } from '../../../point-on-shape';
/**
 * @hidden
 * Find and return a 3-prong from the given boundary piece.
 * @param δs A boundary piece
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function find3Prong(δs: CpNode[][], extreme: number): {
    circle: Circle;
    ps: IPointOnShape[];
    δ3s: CpNode[][];
};
export { find3Prong };
