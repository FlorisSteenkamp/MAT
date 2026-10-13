import type { CpNode } from '../cp-node/cp-node.js';
import type { CurvePiece } from '../mat/curve-piece.js';
import type { ThreeProngInfo } from './three-prong-info.js';
/**
 * Finds a 3-prong using only the 3 given δs.
 *
 * @param δs the boundary pieces
 * @param idx δ identifier
 * @param k δs identifier
 * @param curvePiecess the curve pieces of each boundary piece
 * @param allCurvePieces all of the above flattened into one array
 * @param maxCoordPowerOf2
 *
 * @internal
 */
declare function find3ProngForDelta3s(δs: [CpNode, CpNode][], idx: number, k: number, curvePiecess: CurvePiece[][], allCurvePieces: CurvePiece[], maxCoordPowerOf2: number): {
    error: number;
    threeProngInfo: ThreeProngInfo;
} | undefined;
export { find3ProngForDelta3s };
