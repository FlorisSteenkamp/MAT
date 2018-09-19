import { CpNode } from '../../../../linked-list/cp-node';
import { Circle } from '../../../classes/circle';
import { BezierPiece } from '../../../classes/bezier-piece';
import { PointOnShape } from '../../../classes/point-on-shape';
/**
 * Finds a 3-prong using only the 3 given delta's.
 * @param idx - Delta identifier
 */
declare function find3ProngForDelta3s(deltas: CpNode[][], idx: number, bezierPiecess: BezierPiece[][]): {
    ps: PointOnShape[];
    circle: Circle;
    error: number;
};
export { find3ProngForDelta3s };
