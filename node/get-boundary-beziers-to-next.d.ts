import { CpNode } from './cp-node/cp-node';
/**
 * Returns the ordered cubic bezier curves from this CpNode to the next CpNode
 * on the boundary.
 * @param cpNode
 */
declare function getBoundaryBeziersToNext(cpNode: CpNode): number[][][];
export { getBoundaryBeziersToNext };
