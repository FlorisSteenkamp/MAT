import { CpNode } from '../../../cp-node/cp-node';
import { Circle } from '../../../circle';
import { BezierPiece } from '../../../bezier-piece';
import { PointOnShape } from '../../../point-on-shape';
/**
 * Finds a 3-prong using only the 3 given δs.
 * @param δs The boundary pieces
 * @param idx δ identifier
 * @param bezierPiecess
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function find3ProngForDelta3s(δs: CpNode[][], idx: number, k: number, bezierPiecess: BezierPiece[][], extreme: number): {
    ps: PointOnShape[];
    circle: Circle;
    error: number;
    δ3s: CpNode[][];
};
export { find3ProngForDelta3s };
