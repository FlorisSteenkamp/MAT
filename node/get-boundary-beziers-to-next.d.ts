import { CpNode } from './cp-node.js';
/**
 * Returns the ordered bezier curves from this CpNode to the next CpNode
 * on the boundary.
 * @param cpNode
 */
declare function getBoundaryBeziersToNext(cpNode: CpNode): number[][][];
export { getBoundaryBeziersToNext };
