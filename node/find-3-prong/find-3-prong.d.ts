import type { CpNode } from '../cp-node/cp-node.js';
import type { ThreeProngInfo } from './three-prong-info.js';
/**
 * Find and return a 3-prong from the given boundary piece.
 *
 * @param δs A boundary piece
 * @param maxCoordPowerOf2 The maximum coordinate power of 2 value used to
 * calculate floating point tolerances.
 *
 * @internal
 */
declare function find3Prong(δs: CpNode[][], maxCoordPowerOf2: number): ThreeProngInfo;
export { find3Prong };
