import { closestPointOnBezier, hausdorffDistance, toCubic } from 'flo-bezier3';
import { getBranches } from '../get-branches.js';
import { getCurveToNext } from '../get-curve-to-next.js';
import { getCurveBetween } from '../get-curve/get-curve-between.js';
/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing
 * the MAT with fewer ones to within a given tolerance. Returns the map of
 * to be deleted nodes only - does not actually delete them. Use simplifyMat
 * instead if you want to delete the nodes.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
 * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to 0.1
 * @param hausdorffSpacing The spacing on the curves used to calculate the Hausdorff
 * Distance - defaults to 1
 */
function simplifyMatMapOnly(cpNode, anlgeTolerance = 15, hausdorffTolerance = 1e-1, hausdorffSpacing = 1e0) {
    const simpleMap = new Map();
    // Start from a leaf
    while (!cpNode.isTerminating()) {
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
                const hd = getTotalHausdorffDistance(i, j, branch, hausdorffSpacing);
                if (hd > hausdorffTolerance) {
                    break;
                }
                else {
                    canDeletes.push(branch[j]);
                }
            }
            if (i + 1 === j) {
                // no simplification occured
            }
            else {
                const branStart = branch[i];
                const branEnd = branch[j - 1];
                const medial = toCubic(getCurveBetween(branStart, branEnd.next));
                const rev = medial.slice().reverse();
                let curCpNode = branStart;
                let prevT = 0;
                while (curCpNode !== branEnd) {
                    const t = closestPointOnBezier(medial, curCpNode.next.cp.circle.center).t;
                    simpleMap.set(curCpNode, { ps: medial, ts: [prevT, t] });
                    const oppositeCpNode = curCpNode.nextOnCircle.prev;
                    simpleMap.set(oppositeCpNode, { ps: rev, ts: [1 - t, 1 - prevT] });
                    prevT = t;
                    curCpNode = curCpNode.next;
                }
                simpleMap.set(curCpNode, { ps: medial, ts: [prevT, 1] });
                const oppositeCpNode = curCpNode.nextOnCircle.prev;
                simpleMap.set(oppositeCpNode, { ps: rev, ts: [0, 1 - prevT] });
            }
        }
    }
    return { simpleMap, cpNode };
}
function getTotalHausdorffDistance(i, j, branch, hausdorffSpacing) {
    const hds = [];
    const longCurve = getCurveBetween(branch[i], branch[j].next);
    for (let m = i; m < j + 1; m++) {
        hds.push(hausdorffDistance(getCurveToNext(branch[m]), longCurve, hausdorffSpacing));
    }
    return Math.max(...hds);
}
export { simplifyMatMapOnly };
//# sourceMappingURL=simplify-mat-map-only.js.map