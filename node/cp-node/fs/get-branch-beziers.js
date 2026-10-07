import { getBranch } from './get-branch.js';
import { getMatCurveToNext } from './get-mat-curve-to-next.js';
/**
 * Returns the (flattened) array of bezier curves (lines or quadratics)
 * representing the branch associated with the given cpNode
 *
 * @param cpNode `CpNode` representing the start vertex.
 */
function getBranchBeziers(cpNode) {
    return getBranch(cpNode).flatMap(getMatCurveToNext);
}
export { getBranchBeziers };
//# sourceMappingURL=get-branch-beziers.js.map