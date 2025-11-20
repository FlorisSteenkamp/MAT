import { getBranch } from './get-branch.js';
import { getMatCurveToNext } from './get-mat-curve-to-next.js';
/**
 * Returns the branch associated with the give cpNode
 *
 * @param cpNode `CpNode` representing the start vertex.
 */
function getBranchBeziers(cpNode) {
    return getBranch(cpNode).map(b => getMatCurveToNext(b));
}
export { getBranchBeziers };
//# sourceMappingURL=get-branch-beziers.js.map