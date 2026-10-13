import type { CpNode } from '../cp-node/cp-node.js';
/**
 * Returns the `CpNode` (of the given ones) with the largest maximal disk
 * radius (the first one in case of a tie).
 *
 * @param cpNodes a non-empty array of `CpNode`s
 *
 * @internal
 */
declare function getLargestOf(cpNodes: CpNode[]): CpNode;
/**
 * Returns the `CpNode` on the MAT with the largest maximal disk radius.
 *
 * @param cpNode any `CpNode` on the MAT
 */
declare function getLargestVertex(cpNode: CpNode): CpNode;
export { getLargestVertex, getLargestOf };
