"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_branches_1 = require("../get-branches");
const flo_bezier3_1 = require("flo-bezier3");
const smoothen_1 = require("./smoothen/smoothen");
/**
 * Simplifies the given MAT by replacing piecewise quad beziers with a single
 * one.
 * @param cpNode
 */
function simplifyMat(cpNode, anlgeTolerance = 15, hausdorffTolerance = 1e0, hausdorffSpacing = 1e0) {
    let simpleMap = new Map();
    // Start from a leaf
    while (!cpNode.isTerminating()) {
        cpNode = cpNode.next;
    }
    let branches = get_branches_1.getBranches(cpNode, anlgeTolerance);
    //let g = document.getElementById('svg').getElementsByTagName('g')[0] as SVGGElement;
    let canDeletes = [];
    //console.log(branches)
    for (let k = 0; k < branches.length; k++) {
        let branch = branches[k];
        //drawBranch(g, branch, (k+1)*1000);
        //drawBranch(g, branch);
        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            let i = j;
            while (true) {
                j++;
                if (j === branch.length) {
                    break;
                }
                let hd = getTotalHausdorffDistance(i, j, branch, hausdorffSpacing);
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
                let branStart = branch[i];
                let branEnd = branch[j - 1];
                let medial = flo_bezier3_1.toCubic(smoothen_1.getCurveBetween(branStart, branEnd.next));
                let rev = medial.slice().reverse();
                let curCpNode = branStart;
                let prevT = 0;
                while (curCpNode !== branEnd) {
                    let t = flo_bezier3_1.closestPointOnBezier(medial, curCpNode.next.cp.circle.center).t;
                    simpleMap.set(curCpNode, { ps: medial, ts: [prevT, t] });
                    let oppositeCpNode = curCpNode.nextOnCircle.prev;
                    //let rev = medial.slice().reverse();
                    simpleMap.set(oppositeCpNode, { ps: rev, ts: [1 - t, 1 - prevT] });
                    prevT = t;
                    curCpNode = curCpNode.next;
                }
                simpleMap.set(curCpNode, { ps: medial, ts: [prevT, 1] });
                let oppositeCpNode = curCpNode.nextOnCircle.prev;
                //let rev = medial.slice().reverse();
                simpleMap.set(oppositeCpNode, { ps: rev, ts: [0, 1 - prevT] });
            }
        }
    }
    /*
    for (let cpNode of canDeletes) {
        let isTerminating = cpNode.isTerminating();
        let onCircleCount = cpNode.getCpNodesOnCircle().length;
        if (isTerminating || onCircleCount !== 2) {
            continue;
        }

        CpNode.remove(cpNode);
    }
    */
    /*
    let newBranches = getBranches(cpNode, anlgeTolerance);
    //console.log(newBranches);
    let branchCount = branches.reduce((pv, cv) => pv+cv.length, 0);
    let newBranchCount = newBranches.reduce((pv, cv) => pv+cv.length, 0);

    console.log(branchCount, newBranchCount)
    //console.log(newBranches[0].map(cpNode => cpNode));
    */
    return { simpleMap, cpNode };
}
exports.simplifyMat = simplifyMat;
function getTotalHausdorffDistance(i, j, branch, hausdorffSpacing) {
    let hds = [];
    let longCurve = smoothen_1.getCurveBetween(branch[i], branch[j].next);
    for (let m = i; m < j + 1; m++) {
        hds.push(flo_bezier3_1.hausdorffDistance(smoothen_1.getCurveToNext(branch[m]), longCurve, hausdorffSpacing));
    }
    return Math.max(...hds);
}
//# sourceMappingURL=simplify-mat.js.map