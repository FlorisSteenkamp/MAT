import { hausdorffDistance } from 'flo-bezier3';
import { getCpNodesOnCircle, isTerminating, removeCpNode } from '../cp-node/cp-node.js';
import { getBranches } from './get-branches.js';
import { getCurveToNext } from '../cp-node/get-curve-to-next.js';
import { getCurveBetween } from '../get-curve/get-curve-between.js';
/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing
 * the MAT with fewer ones to within a given tolerance.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
  * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to `2**-3`
 * @param maxIterations The max iterations, defaults to `50`
 */
function simplifyMat(mat, anlgeTolerance = 15, hausdorffTolerance = 2 ** -3, maxIterations = 50) {
    let cpNode = mat.cpNode;
    // Start from a leaf
    while (!isTerminating(cpNode)) {
        cpNode = cpNode.next;
    }
    const branches = getBranches(cpNode, anlgeTolerance);
    const canDeletes = [];
    for (let k = 0; k < branches.length; k++) {
        const branch = branches[k];
        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            const i = j;
            while (true) {
                j++;
                if (j === branch.length) {
                    break;
                }
                const hd = getTotalHausdorffDistance(i, j, branch, maxIterations);
                if (hd > hausdorffTolerance) {
                    break;
                }
                else {
                    canDeletes.push(branch[j]);
                }
            }
            if (i + 1 === j) {
                // no simplification occured
                break;
            }
        }
    }
    for (const cpNode of canDeletes) {
        const isTerminating_ = isTerminating(cpNode);
        const onCircleCount = getCpNodesOnCircle(cpNode).length;
        if (isTerminating_ || onCircleCount !== 2) {
            continue;
        }
        removeCpNode(cpNode);
    }
    //return { cpNode, cpTrees: createNewCpTree(cpNode) }; 
    return { cpNode, cpTrees: undefined };
}
function getTotalHausdorffDistance(i, j, branch, hausdorffSpacing) {
    const hds = [];
    const longCurve = getCurveBetween(branch[i], branch[j].next);
    for (; i < j + 1; i++) {
        hds.push(hausdorffDistance(getCurveToNext(branch[i]), longCurve, hausdorffSpacing));
    }
    return Math.max(...hds);
}
export { simplifyMat };
//# sourceMappingURL=simplify-mat.js.map