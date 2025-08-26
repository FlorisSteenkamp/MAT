import { CpNode } from '../cp-node.js';
import { getBranch } from './get-branch.js';
import { getMatCurveToNext } from './get-mat-curve-to-next.js';


/**
 * Returns the branch associated with the give cpNode
 * 
 * @param cpNode `CpNode` representing the start vertex.
 */
function getBranchBeziers(
		cpNode: CpNode): number[][][] {

    return getBranch(cpNode).map(b => getMatCurveToNext(b));
}


export { getBranchBeziers }
