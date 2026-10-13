import type { CpNode } from '../cp-node/cp-node.js';
/**
 * Returns the `CpNode` on a 3-prong (or higher) MAT vertex with the largest
 * maximal disk radius, or `undefined` if there is none.
 *
 * @param cpNode any `CpNode` on the MAT
 */
declare function getLargest3Prong(cpNode: CpNode): CpNode | undefined;
export { getLargest3Prong };
