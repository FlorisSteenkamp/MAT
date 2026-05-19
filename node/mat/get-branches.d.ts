import { CpNode } from '../cp-node/cp-node.js';
/**
 * Returns all branches associated with the give cpNode.
 *
 * * the final `CpNode` of each branch is not returned to improve symmetry
 *
 * @param cpNode `CpNode` representing the start vertex.
 */
declare function getBranches(cpNode: CpNode): CpNode[][];
export { getBranches };
