import { CpNode } from '../../../cp-node.js';
import { BezierPiece } from '../../bezier-piece.js';
import { IPointOnShape } from '../../../point-on-shape.js';
/**
 * @hidden
 * Finds a 3-prong using only the 3 given δs.
 * @param δs The boundary pieces
 * @param idx δ identifier
 * @param bezierPiecess
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function find3ProngForDelta3s(δs: CpNode[][], idx: number, k: number, bezierPiecess: BezierPiece[][], extreme: number): {
    ps: IPointOnShape[];
    circle: {
        center: number[];
        radius: number;
    };
    error: number;
    δ3s: CpNode[][];
};
export { find3ProngForDelta3s };
