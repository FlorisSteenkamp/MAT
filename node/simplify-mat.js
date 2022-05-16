import { hausdorffDistance } from 'flo-bezier3';
import { CpNode } from './cp-node.js';
import { getBranches } from './get-branches.js';
import { getCurveToNext } from './get-curve-to-next.js';
import { getCurveBetween } from './get-curve/get-curve-between.js';
/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing
 * the MAT with fewer ones to within a given tolerance.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
 * TODO - the next two params are wrong??
 * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to 0.1
 * @param maxIterations The spacing on the curves used to calculate the Hausdorff
 * Distance - defaults to 1
 */
function simplifyMat(mat, anlgeTolerance = 15, hausdorffTolerance = 2 ** -3, maxIterations = 50) {
    let cpNode = mat.cpNode;
    // Start from a leaf
    while (!cpNode.isTerminating()) {
        cpNode = cpNode.next;
    }
    let branches = getBranches(cpNode, anlgeTolerance);
    let canDeletes = [];
    for (let k = 0; k < branches.length; k++) {
        let branch = branches[k];
        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            let i = j;
            while (true) {
                j++;
                if (j === branch.length) {
                    break;
                }
                let hd = getTotalHausdorffDistance(i, j, branch, maxIterations);
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
    for (let cpNode of canDeletes) {
        let isTerminating = cpNode.isTerminating();
        let onCircleCount = cpNode.getCpNodesOnCircle().length;
        if (isTerminating || onCircleCount !== 2) {
            continue;
        }
        CpNode.remove(cpNode);
    }
    //return { cpNode, cpTrees: createNewCpTree(cpNode) }; 
    return { cpNode, cpTrees: undefined };
}
function getTotalHausdorffDistance(i, j, branch, hausdorffSpacing) {
    let hds = [];
    let longCurve = getCurveBetween(branch[i], branch[j].next);
    for (; i < j + 1; i++) {
        hds.push(hausdorffDistance(getCurveToNext(branch[i]), longCurve, hausdorffSpacing));
    }
    return Math.max(...hds);
}
export { simplifyMat };
//# sourceMappingURL=simplify-mat.js.map