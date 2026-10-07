import { CpNode } from '../cp-node.js';
/**
 * Returns the (flattened) array of bezier curves (lines or quadratics)
 * representing the branch associated with the given cpNode
 *
 * @param cpNode `CpNode` representing the start vertex.
 */
declare function getBranchBeziers(cpNode: CpNode): number[][][];
export { getBranchBeziers };
