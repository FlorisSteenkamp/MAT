import { tangent } from 'flo-bezier3';
import { cross, toUnitVector } from 'flo-vector2d';
import { getChildren, isFullyTerminating, isTerminating } from '../cp-node/cp-node.js';
import { getCurveToNext } from '../cp-node/get-curve-to-next.js';
/** @internal */
const defaultTolerance = 1; // 1 degree
/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given
 * vertex (represented by a [[CpNode]]). Returns the result as an array of
 * smooth branches, where smoothness is total or within a given tolerance.
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param tolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required.
 */
function getBranches(cpNode, tolerance = defaultTolerance) {
    // Start from a leaf
    while (!isFullyTerminating(cpNode)) {
        cpNode = cpNode.next;
    }
    const branches = [];
    // Since the tree is unrooted we must iterate in all directions from the
    // given vertex.
    const cps = [cpNode.prevOnCircle];
    let branchCpNodes = [];
    while (cps.length) {
        const cp = cps.pop();
        branchCpNodes.push(cp);
        let children = getChildren(cp);
        if (isFullyTerminating(cp)) {
            if (branchCpNodes.length > 1) {
                branches.push(branchCpNodes);
            }
            branchCpNodes = [];
            continue;
        }
        if (children.length === 1) {
            cps.push(children[0]);
            continue;
        }
        children = children.filter(cpNode => !isTerminating(cpNode));
        if (children.length === 0) {
            branches.push(branchCpNodes);
            branchCpNodes = [];
            continue;
        }
        if (children.length > 1) {
            // More than one branch comes together
            branches.push(branchCpNodes);
            branchCpNodes = [];
            cps.push(...children);
            continue;
        }
        const backPointingTan = toUnitVector(tangent(getCurveToNext(cp.next.prevOnCircle), 0));
        const forwardPointingTan = toUnitVector(tangent(getCurveToNext(children[0]), 0));
        const cross_ = cross(backPointingTan, forwardPointingTan);
        const angle = Math.abs(Math.asin(cross_) * (180 / Math.PI));
        if (angle > tolerance) {
            branches.push(branchCpNodes);
            branchCpNodes = [];
        }
        cps.push(children[0]);
    }
    if (branchCpNodes.length) {
        branches.push(branchCpNodes);
    }
    return branches;
}
export { getBranches };
//# sourceMappingURL=get-branches.js.map