import { CpNode } from '../cp-node/cp-node.js';
import { CurvePiece } from '../mat/bezier-piece.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Finds a 3-prong using only the 3 given δs.
 * @param δs The boundary pieces
 * @param idx δ identifier
 * @param bezierPiecess
 * @param maxCoordinate The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function find3ProngForDelta3s(δs: CpNode[][], idx: number, k: number, bezierPiecess: CurvePiece[][], maxCoordinate: number): {
    poss: PointOnShape[];
    circle: {
        center: number[];
        radius: number;
    };
    error: number;
    δ3s: CpNode[][];
} | undefined;
export { find3ProngForDelta3s };
