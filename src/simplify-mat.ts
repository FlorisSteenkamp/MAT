
import { CpNode } from "./cp-node";
import { getBranches } from "./get-branches";
import { hausdorffDistance, toCubic } from "flo-bezier3";
import { getCurveToNext } from "./get-curve-to-next";
import { getCurveBetween } from "./get-curve/get-curve-between";
import { Mat } from "./mat";
import { createNewCpTree } from "./mat/create-new-cp-tree";
import { closestPointOnBezier } from "flo-bezier3/node/simultaneous-properties/closest-point-on-bezier/closest-point-on-bezier";


/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing 
 * the MAT with fewer ones to within a given tolerance.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit 
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
 * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to 0.1
 * @param hausdorffSpacing The spacing on the curves used to calculate the Hausdorff
 * Distance - defaults to 1
 */
function simplifyMat(
        mat: Mat,
        anlgeTolerance = 15,
        hausdorffTolerance = 1e-1,
        hausdorffSpacing = 1e0): Mat {

    let cpNode = mat.cpNode;
    
    // Start from a leaf
    while (!cpNode.isTerminating()) { cpNode = cpNode.next; }

    let branches = getBranches(cpNode, anlgeTolerance);

    let canDeletes: CpNode[] = [];
    for (let k=0; k<branches.length; k++) {
        let branch = branches[k];

        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            let i = j;
            while (true) {
                j++;

                if (j === branch.length) { break; }

                let hd = getTotalHausdorffDistance(i, j, branch, hausdorffSpacing);

                if (hd > hausdorffTolerance) {
                    break;
                } else {
                    canDeletes.push(branch[j]);
                }
            }

            if (i+1 === j) { 
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


function getTotalHausdorffDistance(
        i: number, 
        j: number, 
        branch: CpNode[],
        hausdorffSpacing: number) {

    let hds: number[] = [];
    let longCurve = getCurveBetween(branch[i], branch[j].next);
    for (; i<j+1; i++) {
        hds.push(hausdorffDistance(
            getCurveToNext(branch[i]),
            longCurve,
            hausdorffSpacing
        ));
    }

    return Math.max(...hds);
}


export { simplifyMat }
