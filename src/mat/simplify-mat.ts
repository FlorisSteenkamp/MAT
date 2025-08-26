import { hausdorffDistanceOneSided } from 'flo-bezier3';
import { CpNode } from '../cp-node/cp-node.js';
import { removeVertex } from '../vertex/remove-vertex.js';
import { getBranches } from './get-branches.js';
import { getMatCurveToNext } from '../cp-node/fs/get-mat-curve-to-next.js';
import { getMatCurveBetween } from '../cp-node/fs/get-mat-curve-between.js';
import { Mat } from './mat.js';
import { createNewCpTree } from './create-new-cp-tree.js';
import { clone } from '../cp-node/fs/clone.js';
import { findFirst } from '../cp-node/fs/find-first.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
import { isVertex } from '../cp-node/fs/is-vertex.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';



// TODO2 could be made faster by binary "search" on hausdorff curves
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
function simplifyMat(
        mat: Mat,
        hausdorffTolerance = 2**-3,
        maxIterations = 50): Mat {

    let cpNode = clone(mat.cpNode);

    // Start from a leaf
    while (!isTerminating(cpNode)) { cpNode = cpNode.next; }

    const branches = getBranches(cpNode);

    const canDeletes: Set<CpNode> = new Set();
    for (let k=0; k<branches.length; k++) {
        const branch = branches[k];

        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            const i = j;
            while (true) {
                j++;

                if (j === branch.length) { break; }

                const hd = getTotalHausdorffDistance(i, j, branch, maxIterations);

                if (hd > hausdorffTolerance) {
                    break;
                } else {
                    canDeletes.add(branch[j]);
                }
            }

            if (i+1 === j) { 
                // no simplification occured
                continue;
            }
        }
    }

    cpNode = findFirst(cpNode_ => isTerminating(cpNode_) ? cpNode_ : undefined, cpNode)!;

    for (const cpNode of canDeletes) {
        if (!isVertex(cpNode =>
                (getProngCount(cpNode) !== 2) &&
                !cpNode.isHoleClosing
            )(cpNode)) {

            removeVertex(cpNode, mat.meta.cpTrees);
        }
    }


    return {
        cpNode,
        meta: {
            ...mat.meta,
            cpTrees: createNewCpTree(cpNode)
        }
    }
}


function getTotalHausdorffDistance(
        i: number, 
        j: number, 
        branch: CpNode[],
        hausdorffSpacing: number) {

    const hds: number[] = [];
    const longCurve = getMatCurveBetween(branch[i], branch[j].next);
    for (; i<j+1; i++) {
        hds.push(hausdorffDistanceOneSided(
            getMatCurveToNext(branch[i]),
            longCurve,
            hausdorffSpacing
        ));
    }

    return Math.max(...hds);
}


export { simplifyMat }
