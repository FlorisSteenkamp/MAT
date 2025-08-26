import { CpNode } from '../cp-node/cp-node.js';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Find and return a 3-prong from the given boundary piece.
 * @param δs A boundary piece
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function find3Prong(δs: CpNode[][], extreme: number): {
    circle: Circle;
    poss: PointOnShape[];
    δ3s: CpNode[][];
};
export { find3Prong };
