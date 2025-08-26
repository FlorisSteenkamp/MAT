import { CpNode } from '../cp-node.js';
/**
 * Returns the branch associated with the give cpNode.
 *
 * * the final `CpNode` is not returned to improve symmetry
 *
 * @param cpNode `CpNode` representing the start vertex.
 */
declare function getBranch(cpNode: CpNode): CpNode[];
export { getBranch };
